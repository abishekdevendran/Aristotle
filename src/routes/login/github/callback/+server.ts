// routes/login/github/callback/+server.ts
import { OAuth2RequestError } from 'arctic';
import { generateIdFromEntropySize } from 'lucia';
import { github, lucia } from '$lib/server/auth';

import type { RequestEvent } from '@sveltejs/kit';
import { db, queryDb } from '$lib/server/db';
import { oauthAccountTable, userTable } from '$lib/server/db/schema';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();
		console.log('Github User: ', githubUser);

		// Replace this with your own DB client.
		// const existingUser = await db.table('user').where('github_id', '=', githubUser.id).get();
		const existingUser = await queryDb.query.oauthAccountTable.findFirst({
			where: (oauth, { eq, and }) =>
				and(eq(oauth.providerId, 'github'), eq(oauth.providerUserId, githubUser.id.toString()))
		});

		if (existingUser) {
      console.log("Existing user found")
			const session = await lucia.createSession(existingUser.userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
      console.log("Creating new user")
			const userId = generateIdFromEntropySize(10); // 16 characters long

			// Replace this with your own DB client.
			// await db.table('user').insert({
			// 	id: userId,
			// 	github_id: githubUser.id,
			// 	username: githubUser.login
			// });
			await db.transaction(async (txn) => {
				await txn.insert(userTable).values({
					id: userId,
					name: githubUser.login
				});
				await txn.insert(oauthAccountTable).values({
					providerId: 'github',
					providerUserId: githubUser.id.toString(),
					userId: userId
				});
			});
      console.log("txn completed successfully")

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}

interface GitHubUser {
	id: number;
	login: string;
}
