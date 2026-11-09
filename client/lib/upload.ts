import { entries, setMany, type UseStore } from "idb-keyval";

type TStore = UseStore;
type TFiles = [IDBValidKey, File][];

export const getFiles = async (
    store: TStore
) => {
    const items: TFiles = await entries(store);
    return items.map(([key, val]) => ({ id: key, file: val }));
};

export const setFiles = async (
    files: File[], 
    store: TStore
) => {
    const items: TFiles = files.map((file) => [crypto.randomUUID(), file]);
    await setMany(items, store);
};

