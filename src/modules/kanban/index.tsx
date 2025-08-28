"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./components/TaskCard";
import { Box } from "@mui/material";
import ColumnsContainer from "./components/ColumnsContainer";
import { Column } from "./types/types";
import { DEFAULT_COLUMNS } from "./constants/defaultColumns";
import { useKanbanStore } from "./store/KanbanProvider";
import KanbanHeader from "./components/KanbanHeader";








function KanbanBoard() {

  const [
    tasks,
    setTasks,

    activeTask,

    combinedData,

    setActiveTask,

  ] = useKanbanStore((state) => [
    state.tasks,
    state.setTasks,

    state.activeTask,

    state.combinedData,
    state.setActiveTask

  ]);
  const prevColumnId = useRef<string>(null);
  const [columns] = useState<Column[]>(DEFAULT_COLUMNS);
  const columnId = "columnId"




  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );


  const handleOnDragStart = useCallback(
    (event: DragStartEvent) => {
      const { type, task } = event.active.data.current || {};

      if (type === "Task") {
        (prevColumnId.current as string | null) =
          event.active.data.current?.prevColumnId;
        setActiveTask(task);
        return;
      }
    },
    [setActiveTask],
  );

  const handleOnDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id;
      const overId = over.id as string;

      if (activeId === overId) return;

      const isActiveATask = active.data.current?.type === "Task";
      const isOverATask = over.data.current?.type === "Task";

      if (!isActiveATask) return;

      // Im dropping a Task over another Task
      if (isActiveATask && isOverATask) {
        if (!tasks) return;
        const copyTasks = [...tasks];
        const activeIndex = copyTasks.findIndex((t) => t.id === activeId);
        const overIndex = copyTasks.findIndex((t) => t.id === overId);

        if (
          copyTasks[activeIndex][columnId] !== copyTasks[overIndex][columnId]
        ) {
          (copyTasks[activeIndex][columnId] as unknown) =
            copyTasks[overIndex][columnId];
          // updatedTasks(arrayMove(allTasks, activeIndex, overIndex - 1));
          setTasks(arrayMove(copyTasks, activeIndex, overIndex - 1));
        }
        // updatedTasks(arrayMove(allTasks, activeIndex, overIndex));
        setTasks(arrayMove(copyTasks, activeIndex, overIndex));
      }

      const isOverAColumn = over.data.current?.type === "Column";

      // Im dropping a Task over a column
      if (isActiveATask && isOverAColumn) {
        if (!tasks) return;
        const copyTasks = [...tasks];
        const activeIndex = copyTasks.findIndex((t) => t.id === activeId);

        (copyTasks[activeIndex][columnId] as string) = overId;
        setTasks(arrayMove(copyTasks, activeIndex, activeIndex));
      }
    },
    [columnId, setTasks, tasks],
  );

  const handleOnDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;
      if (active.data.current?.task.columnId === prevColumnId.current) return;

    },
    [setActiveTask],
  );



  const flattenedTasks = useMemo(
    () => Object.values(combinedData).flat(),
    [combinedData],
  );

  useEffect(() => {
    setTasks(flattenedTasks);
  }, [flattenedTasks, setTasks]);





  return (
    <Box sx={{ height: "100%" }}>
      <KanbanHeader />
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          height: "calc(100% - 80px)",
          display: "flex",
          // alignItems: "center",
          flexDirection: "column",
          pt: 1,
          pb: 1,
          overflowX: "auto",
          overflowY: "hidden",
          flex: 1,
          "::-webkit-scrollbar": {
            height: "0.5em !important",
          },
        }}
        className="custom-scrollbar"
      >

        <DndContext
          sensors={sensors}
          onDragStart={handleOnDragStart}
          onDragEnd={handleOnDragEnd}
          onDragOver={handleOnDragOver}
        >
          <ColumnsContainer columns={columns} />

          {createPortal(
            <DragOverlay>
              {activeTask && (
                <TaskCard
                  task={activeTask}

                />
              )}
            </DragOverlay>,
            document?.body
          )}
        </DndContext>
      </Box>
    </Box >

  );

}



export default KanbanBoard;


