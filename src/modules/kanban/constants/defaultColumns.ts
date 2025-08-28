import { Column } from "../types/types";

export const DEFAULT_COLUMNS: Column[] = [
  {
    id: "backLog", title: "BackLog",
  },
  {
    id: "inProgress",
    title: "Work in progress",
  },
  {
    id: "review",
    title: "Review",
  },
  {
    id: "done",
    title: "Done",
  },
];