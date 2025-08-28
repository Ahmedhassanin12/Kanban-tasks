
import { Box } from "@mui/material";
import { Column, Id, } from "../types/types";
import { SortableContext } from "@dnd-kit/sortable";
import { ColumnComponent } from "./ColumnComponent";
import { useMemo } from "react";

interface Props {
  columns: Column[];


}

function ColumnsContainer({
  columns,



}: Props) {

  const columnsId = useMemo(() => {
    return columns.map((task) => task.id);
  }, [columns]);





  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <Box sx={{ display: "flex", gap: 1, height: "100%", p: 1 }}>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <ColumnComponent
              key={col.id}
              column={col}
              columnWidth={400}
            />
          ))}
        </SortableContext>
      </Box>

    </Box>
  );
}

export default ColumnsContainer;
