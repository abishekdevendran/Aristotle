import type * as Party from "partykit/server";

const DEFAULT_APPLICATION_ENDPOINT = "http://localhost:3000";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) { }
  static async onBeforeConnect(request: Party.Request, lobby: Party.Lobby) {
    try {
      // get authentication server url from environment variables (optional)
      const issuer = lobby.env.APPLICATION_ENDPOINT || DEFAULT_APPLICATION_ENDPOINT;
      // get token from request query string
      const sessionId = new URL(request.url).searchParams.get("sessionId") ?? "";
      const userId = new URL(request.url).searchParams.get("userId") ?? "";
      // verify the JWT (in this case using LUCIA)
      const resp=await fetch(DEFAULT_APPLICATION_ENDPOINT+`/api/auth?userId=${userId}&sessionId=${sessionId}`)
      if(!resp || !resp.ok){
        throw new Error("No response")
      }
      const response = await resp.json()
      if(response.message==='unauthorized'){
        throw new Error("Unauthorized")
      }
      console.log(`Authenticated user ${userId} in session ${sessionId}`);
      // forward the request onwards on onConnect
      return request;
    } catch (e) {
      // authentication failed!
      // short-circuit the request before it's forwarded to the party
      return new Response("Unauthorized", { status: 401 });
    }
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send("hello from server");
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id]
    );
  }
}

Server satisfies Party.Worker;
