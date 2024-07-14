import type { User } from "lucia";
import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

const USER_KEY = Symbol("USER");

export function setUser(initial:User|null){
    const user = writable<User | null>(initial);
    return setContext(USER_KEY, user);
}

export function getUser(){
    return getContext<ReturnType<typeof setUser>>(USER_KEY);
}