import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Id, Task } from "../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import CreateNewTaskDialog from "./CreateNewTaskDialog";

interface Props {
  task: Task;
}

function TaskCard({ task, }: Props) {
  const [openCreateTaskDialog, setOpenCreateTaskDialog] = useState<Task | null>(null)
  const queryClient = useQueryClient()

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },

  });

  const {
    mutate,
    isPending,
  } = useMutation({
    mutationKey: ["DELETE_TASK"],
    mutationFn: async (id: Id) => {
      const res = await axios.delete<Task[]>(`http://localhost:4000/tasks/${id}`)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })

  const updateTask = (task: Task) => {
    setOpenCreateTaskDialog(task)
  }
  const deleteTask = (id: Id) => {
    mutate(id)
  }



  if (isDragging) {
    return (
      <Box
        ref={setNodeRef}
        style={{
          transition,
          transform: CSS.Transform.toString(transform),
        }}
        sx={{
          backgroundColor: "#1d1d1d",
          height: "100px",
          minHeight: "100px",
          padding: 1,
          opacity: 0.3,
          display: "flex",
          alignItems: "center",
          textAlign: "left",
          borderRadius: "4px",
          border: "2px solid  #1e88e5",
          cursor: "grab",
          position: "relative",
        }}
      >
        Drop Here
      </Box>
    );
  }



  return (
    <Box
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
      }}
      {...attributes}
      {...listeners}
      sx={{
        backgroundColor: "#25282e",
        minHeight: "100px",
        // padding: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",

        borderRadius: "4px",
        cursor: "grab",
        position: "relative",
        transition: "all 1s fade",
        p: 1,

      }}

    >
      <Typography sx={{ fontWeight: 600, whiteSpace: "pre-wrap", overflowX: "hidden" }} >
        {task.title}
      </Typography>
      <Typography sx={{ color: "grey.700", fontSize: 14, whiteSpace: "pre-wrap", overflowX: "hidden" }} >
        {task.description}
      </Typography>


      <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
        <IconButton
          onClick={() => updateTask(task)}
          color="info"
          sx={{ p: 0.5 }}
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          onClick={() => {
            deleteTask(task.id);
          }}
          color="error"
          sx={{ p: 0.5 }}
          disabled={isPending}
        >
          {isPending ? <CircularProgress size={20} /> : <DeleteIcon fontSize="small" />}
        </IconButton>
      </Box>
      {!!openCreateTaskDialog ? <CreateNewTaskDialog handleClose={() => setOpenCreateTaskDialog(null)} open={!!openCreateTaskDialog} task={task} /> : null}

    </Box>
  );
}

export default TaskCard;