import React, { useEffect, useMemo, useState } from 'react'
import { Column, Id, Task } from '../types/types'
import ColumnHeader from './ColumnHeader'

import { SortableContext } from "@dnd-kit/sortable";
import AddIcon from '@mui/icons-material/Add';
import { useQuery, } from "@tanstack/react-query";

import axios from "axios"
import TaskCard from "./TaskCard";

import { Box, Button, CircularProgress, Pagination, Typography, } from "@mui/material";
import { useKanbanStore } from '../store/KanbanProvider';
import CreateNewTaskDialog from './CreateNewTaskDialog';

const limit = 5

export const ColumnComponent = ({ columnWidth, column }: { columnWidth: number, column: Column }) => {
  const [setCombinedData, allTasks, searchValue] = useKanbanStore((state) =>
    [state.setCombinedData, state.tasks, state.search],
  );

  const [pageNumber, setPageNumber] = useState<number>(1)

  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState<Id | null>(null)

  const {

    data,
    error,
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["COLUMN_TASKS", column.id, pageNumber],
    queryFn: async () => {
      const res = await axios.get<{ first: number, items: number, last: number, pages: number, data: Task[] }>(`http://localhost:4000/tasks?_page=${pageNumber}&_per_page=${limit}&columnId=${column.id}`)
      return {
        data: res.data.data,
        first: res.data.first,
        items: res.data.items,
        last: res.data.last,
        pages: res.data.pages
      }
    },
    enabled:
      !!column.id,
    refetchOnMount: false,
    staleTime: 1000 * 100 * 2
  });



  const filteredTasks = useMemo(() => {
    const columnTasks = allTasks.filter((task) => task?.columnId === column?.id);

    if (!searchValue || searchValue.trim() === '') {
      return columnTasks;
    }

    const searchLower = searchValue.toLowerCase().trim();

    return columnTasks.filter((task) => {
      const titleMatch = task.title?.toLowerCase().includes(searchLower);
      const descriptionMatch = task.description?.toLowerCase().includes(searchLower);
      return titleMatch || descriptionMatch;
    });
  }, [allTasks, column?.id, searchValue]);

  const taskIds = useMemo(() => {

    return filteredTasks?.map((task) => task.id) ?? [];
  }, [filteredTasks]);


  const createTask = (id: Id) => {
    setOpenCreateTaskDialog(id)
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };




  useEffect(() => {
    const columns = {
      [column.id]: data?.data,
    };

    setCombinedData(
      columns as unknown as Record<Id, Task[]>,
    );
  }, [column.id, setCombinedData, data])


  return (
    <Box
      sx={{
        minWidth: {
          xs: "280px",
          md: "340px",
          lg: `375px`,
        },
        width: {
          xs: "280px",
          md: "340px",
          lg: `calc(100% / ${columnWidth})`,
        },
        maxWidth: "100%",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1d1d1d",
        height: "100%",
      }}
      id={`KANBAN_COLUMN_${column.title}`}
    >
      <ColumnHeader title={column.title} />
      {/* Column task container */}
      <Box
        sx={{
          flex: 1,
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
          overflowX: "hidden",
          overflowY: "auto",
          height: "100%",

        }}
        className="custom-scrollbar"
      >
        {/* Data */}
        <SortableContext items={taskIds}>
          {!isLoading &&
            !isFetching && !error && filteredTasks?.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
              />
            ))}
        </SortableContext>
        {/* Loading */}
        {isLoading ||
          isFetching ? <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}><CircularProgress size={50} /></Box> : null}
        {/* No result */}
        {!isLoading &&
          !isFetching &&
          filteredTasks.length === 0 && (
            <Box
              sx={{
                flex: 1,
                height: "100px",
                border: "2px dashed transparent",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              {searchValue ? "No matching tasks found" : "No Tasks Drop tasks here"}
            </Box>
          )}
        {/* error */}
        {error ? <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}><Typography >Something went wrong  </Typography><Button onClick={() => refetch()}>try again</Button></Box> : null}
      </Box>
      {/* Column footer */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 1 }}> <Pagination color="standard" count={data?.pages ?? 1} page={pageNumber} onChange={handleChange} /></Box>

      <Button
        onClick={() => {
          createTask(column.id);
        }}
        endIcon={<AddIcon />}
      >

        Add task
      </Button>
      {!!openCreateTaskDialog ? <CreateNewTaskDialog handleClose={() => setOpenCreateTaskDialog(null)} open={!!openCreateTaskDialog} columnId={openCreateTaskDialog} /> : null}
    </Box>
  )
}
