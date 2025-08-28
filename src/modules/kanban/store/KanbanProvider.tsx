"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  createKanbanStore,
  initialKanbanState,
  type KanbanActions,
  type KanbanState,
} from "./useKanbanStore";

const KanbanStoreContext = createContext<StoreApi<
  KanbanState & KanbanActions
> | null>(null);

interface KanbanStoreProviderProps {
  children: ReactNode;
  initialState?: Partial<KanbanState>;
}

export const KanbanStoreProvider = ({
  children,
  initialState,
}: KanbanStoreProviderProps) => {
  const storeRef = useRef<StoreApi<KanbanState & KanbanActions> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createKanbanStore({
      ...initialKanbanState,
      ...initialState,
    }) as StoreApi<KanbanState & KanbanActions>;
  }

  return (
    <KanbanStoreContext.Provider value={storeRef.current}>
      {children}
    </KanbanStoreContext.Provider>
  );
};

export const useKanbanStore = <T,>(
  selector: (store: KanbanState & KanbanActions) => T,
) => {
  const kanbanStoreContext = useContext(KanbanStoreContext);

  if (!kanbanStoreContext) {
    throw new Error("useKanbanStore must be use within KanbanStoreProvider");
  }

  return useStore(kanbanStoreContext, useShallow(selector));
};

export const useKanbanStoreRef = () => {
  const kanbanStoreContext = useContext(KanbanStoreContext);

  if (!kanbanStoreContext) {
    throw new Error("useKanbanStoreRef must be use within KanbanStoreProvider");
  }

  return kanbanStoreContext;
};
