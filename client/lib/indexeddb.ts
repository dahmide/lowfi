import { createStore, type UseStore } from "idb-keyval";

const stores = new Map<string, UseStore>();
export function getStore(name: string): UseStore {
    let s = stores.get(name);
    if (!s) {
        s = createStore(name, "data");
        stores.set(name, s);
    }
    return s;
}
