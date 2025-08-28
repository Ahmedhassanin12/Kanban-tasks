import { createStore } from "zustand/vanilla";
import { mutative } from "zustand-mutative";

import { Column, Id, Task } from "../types/types";

export interface KanbanState {
  search: string,
  activeTask: Task | null;
  tasks: Task[];
  columns: Column[];
  initialColumns: Column[];
  activeColumn: Column | null;
  combinedData: Record<Id, Task[]>;


}

export interface KanbanActions {
  setTasks: (tasks: Task[]) => void;
  setColumns: (columns: Column[]) => void;
  setActiveTask: (activeTask: Task | null) => void;
  setActiveColumn: (activeColumn: Column | null) => void;


  setSearch: (value: string) => void
  setCombinedData: (columns: Record<Id, Task[]>) => void;

  resetState: () => void;
}

export const initialKanbanState: KanbanState = {
  search: "",
  activeColumn: null,
  activeTask: null,
  tasks: [],
  columns: [],
  initialColumns: [],
  combinedData: {
    "backLog": [],
    "done": [],
    "review": [],
    "inProgress": [],
  },
};

export const createKanbanStore = (
  initialState: KanbanState = initialKanbanState,
) => {
  return createStore<KanbanState & KanbanActions>()(
    mutative<KanbanState & KanbanActions>((set) => ({
      ...initialState,
      setTasks: (tasks) =>
        set((state) => {
          state.tasks = tasks;
        }),
      setColumns: (columns) =>
        set((state) => {
          state.initialColumns = columns;
          state.columns = columns;
        }),
      setCombinedData: (columns) =>
        set((state) => {
          state.combinedData = {
            ...state.combinedData,
            ...columns,
          };
        }),
      setActiveTask: (activeTask) =>
        set((state) => {
          state.activeTask = activeTask;
        }),
      setActiveColumn: (activeColumn) =>
        set((state) => {
          state.activeColumn = activeColumn;
        }),
      setSearch: (value) => set(state => {
        state.search = value
      }),
      resetState: () =>
        set(() => {
          return initialKanbanState;
        }),
    })),
  );
};
