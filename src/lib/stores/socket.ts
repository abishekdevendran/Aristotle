import type PartySocket from "partysocket";
import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

const SOCKET_KEY = Symbol("SOCKET");

export function SetSocket(initial: PartySocket | null) {
    const socket = writable<PartySocket | null>(initial);
    return setContext(SOCKET_KEY, socket);
}

export function GetSocket() {
    return getContext<ReturnType<typeof SetSocket>>(SOCKET_KEY);
}