import { writable } from "svelte/store";
import type { TUserTable } from "$lib/server/db/schema";

export let user = writable<null | TUserTable>(null);