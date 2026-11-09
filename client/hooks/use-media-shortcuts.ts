import { useHotkeys } from "@tanstack/react-hotkeys";
import { HOTKEYS } from "@/utils/constants";

type ShortcutId = (typeof HOTKEYS)[number]["id"];
export type ShortcutHandlers = Partial<Record<ShortcutId, () => void>>;

export function useMediaShortcuts(
    handlers: ShortcutHandlers,
    enabled: boolean = true
) {
    const definitions = HOTKEYS.filter(({ id }) => handlers[id]).map(
        ({ id, shortcut }) => ({
            hotkey: shortcut,
            callback: () => handlers[id]?.(),
        })
    );
    useHotkeys(definitions, { conflictBehavior: "replace", enabled });
}
