import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { initialState } from "./state";
import type { UserState, UserActions } from "./types";

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,

                addBackground: (bg) =>
                    set((state) => ({
                        ...state,
                        backgrounds: [...state.backgrounds, bg],
                    })),
                popBackground: (id) =>
                    set((state) => ({
                        ...state,
                        backgrounds: state.backgrounds.filter(
                            (s) => s.id !== id
                        ),
                    })),
            }),
            { name: "lowfi-user" }
        ),
        { name: "UserStore" }
    )
);
