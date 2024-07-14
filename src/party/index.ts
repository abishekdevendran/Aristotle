import type { Player } from "$lib/types";
import type * as Party from "partykit/server";

const DEFAULT_APPLICATION_ENDPOINT = "http://localhost:3000";

export default class Server implements Party.Server {
  static players: Player[] = [];
  static playerOrder: string[] = [];
  static messages: {
    id: string;
    message: string;
  }[] = [];
  static playerCount: number = 0;
  constructor(public room: Party.Room) { }
  static async onBeforeConnect(request: Party.Request, lobby: Party.Lobby) {
    try {
      // get authentication server url from environment variables (optional)
      const issuer = lobby.env.APPLICATION_ENDPOINT || DEFAULT_APPLICATION_ENDPOINT;
      // get token from request query string
      const sessionId = new URL(request.url).searchParams.get("sessionId") ?? "";
      const userId = new URL(request.url).searchParams.get("userId") ?? "";
      // verify the JWT (in this case using LUCIA)
      const resp = await fetch(DEFAULT_APPLICATION_ENDPOINT + `/api/auth?userId=${userId}&sessionId=${sessionId}`)
      if (!resp || !resp.ok) {
        throw new Error("No response")
      }
      const response: {
        message: 'unauthorized',
      } | {
        message: 'validated',
        user: {
          id: string;
          name: string;
        }
      } = await resp.json()
      if (response.message === 'unauthorized') {
        throw new Error("Unauthorized")
      }
      console.log(`Authenticated user ${userId} in session ${sessionId}`);
      // store the user data locally
      this.players.push(
        response.user
      );
      this.playerOrder.push(response.user.id);
      // forward the request onwards on onConnect
      return request;
    } catch (e) {
      // authentication failed!
      // short-circuit the request before it's forwarded to the party
      return new Response("Unauthorized", { status: 401 });
    }
  }

  async onClose(connection: Party.Connection) {
    // A websocket just disconnected!
    console.log(`Disconnected: ${connection.id}`);
    // let's remove the player from the list of players
    const index = Server.players.findIndex((p) => p.connId === connection.id);
    const player = Server.players[index];
    if (index !== -1) {
      Server.players.splice(index, 1);
    }
    // let's remove the player from the list of playerOrder
    const orderIndex = Server.playerOrder.findIndex((p) => p === player.id);
    if (orderIndex !== -1) {
      Server.playerOrder.splice(orderIndex, 1);
    }
    // let everyone know that a player has left
    this.room.broadcast(
      JSON.stringify({
        type: "LEAVE",
        data: {
          message: `${player.name} has left the game!`,
          player: player
        }
      })
    );
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.room.id}`
    );
    const sessionId = new URL(ctx.request.url).searchParams.get("sessionId") ?? "";
    const userId = new URL(ctx.request.url).searchParams.get("userId") ?? "";
    // update connId
    let idx = Server.players.findIndex(el => el.id === userId);
    if (idx === -1) {
      // error
      return conn.close(1000, "Something went wrong");
    }
    Server.players[idx].connId = conn.id;
    Server.playerCount++;
    console.log(Server.players);

    // let everyone know that a new player has joined
    this.room.broadcast(
      JSON.stringify({
        type: "JOIN",
        data: {
          message: `${Server.players[idx].name} has joined the game!`,
          player: Server.players[idx]
        }
      }),
      // ...except for the connection it came from
      [conn.id]
    );

    // let's send a message to the connection
    conn.send(JSON.stringify({
      type: "POPULATE",
      data: {
        messages: Server.messages,
        players: Server.players,
        playerOrder: Server.playerOrder,
      }
    }));
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    const msg = JSON.parse(message) as {
      type: 'MESSAGE';
      data: {
        message: string;
      };
    };
    // save it to the list of messages
    Server.messages.push({
      id: Server.players.find((p) => p.connId === sender.id)?.id ?? '',
      message: msg.data.message
    });
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      JSON.stringify({
        type: "MESSAGE",
        data: {
          message: msg.data.message,
          id: Server.players.find((p) => p.connId === sender.id)?.id,
        }
      }),
      // ...except for the connection it came from
      [sender.id]
    );
  }
}

Server satisfies Party.Worker;
