import Close from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  dialogActionsClasses,
  dialogContentClasses,
  dialogTitleClasses,
  Grid,
  IconButton,
  paperClasses,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Id, Task } from "../types/types";
import axios from "axios";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${dialogContentClasses.root}`]: {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
  },
  [`& .${dialogActionsClasses.root}`]: {
    padding: theme.spacing(2),
  },
  [`& .${paperClasses.root}`]: {
    backgroundColor: "#121212",

  },
}));

type RenameFileDialogProps = {
  open: boolean;
  handleClose: () => void;
  task?: Task;
  columnId?: Id;
};

const CreateNewTaskDialog = ({
  open,
  task,
  handleClose,
  columnId,
}: RenameFileDialogProps) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string>(
    task?.title ?? "",
  );
  const [desc, setDesc] = useState<string>(
    task?.description ?? "",
  );


  const {
    mutate,
    isError,
    isPending,
  } = useMutation({
    mutationKey: ["CREATE_TASK"],
    mutationFn: async (task: Task) => {
      const res = await axios.post<Task[]>(`http://localhost:4000/tasks`, task)
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      handleClose()
    }
  })

  const {
    mutate: mutateUpdate,
    isPending: isUpdating,
  } = useMutation({
    mutationKey: ["UPDATE_TASK"],
    mutationFn: async (task: Task) => {
      const res = await axios.put<Task>(`http://localhost:4000/tasks`, task)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      handleClose()
    }
  })


  const handleCreateTask = async () => {
    if (!task?.id && columnId) {
      mutate({
        id: Math.random().toString(),
        columnId: columnId,
        title,
        description: desc
      })
    } else {
      mutateUpdate({
        id: task?.id ?? "",
        columnId: task?.columnId ?? "",
        title: title ?? task?.title,
        description: desc ?? task?.description
      })
    }
  };

  return (
    <StyledDialog
      open={open}
      maxWidth="xl"
      slotProps={{
        paper: {
          sx: {
            [`& .${dialogContentClasses.root}`]: {
              paddingX: { xs: 1, sm: 3 },
              position: "relative",
              overflow: "hidden",
              minHeight: "170px",
              pb: 2,
              minWidth: {
                xs: "340px",
                md: "30vw",
              },
              margin: "0px",
              backgroundColor: "#121212"
            },
            [`& .${dialogTitleClasses.root}`]: {
              paddingX: { xs: 1, sm: 3 },
            },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 0.5,
          backgroundColor: "#121212"

        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Grid sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>

            <Typography sx={{ color: "#fff" }}>{task?.id ? "Update" : "Create"}</Typography>
          </Grid>

          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => {
                handleClose();
              }}
              sx={{
                color: (theme) => theme.palette.grey[500],
                p: 0.5,
              }}
            >
              <Close />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateTask();
          }}
        >
          <Box sx={{ my: 1 }}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "flex-start",
                flexDirection: "column"
              }}
            >
              <TextField
                fullWidth
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                size="small"
                sx={{
                  color: "#fff",
                  borderColor: "#444",
                  ".MuiOutlinedInput-root fieldset": {
                    borderColor: "#fff"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                }}
                slotProps={{
                  input: {
                    sx: {
                      color: "#fff",
                      borderColor: "#fff !important"
                    }
                  }
                }}
              />
              <TextField
                fullWidth
                name="description"
                placeholder="Description"
                value={desc}
                onChange={(e) => {
                  setDesc(e.target.value);
                }}
                size="small"
                color="info"
                sx={{
                  color: "#fff",
                  ".MuiOutlinedInput-root fieldset": {
                    borderColor: "#fff"
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },


                }}
                slotProps={{
                  input: {
                    sx: {
                      color: "#fff",
                      borderColor: "#fff !important"
                    }
                  }
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              onClick={handleClose}
              disabled={isPending || isUpdating}
              color="inherit"
              variant="outlined"
              sx={{
                color: "#fff",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isPending}
              disabled={
                isPending || !title || isUpdating
              }
              sx={{
                color: "#fff",

              }}

              variant="contained"
            >
              {task?.id ? "Update" : "Create"}
            </Button>
            {isError ? <Typography color="error">Try Again</Typography> : null}
          </Box>
        </form>
      </DialogContent>
    </StyledDialog>
  );
};

export default CreateNewTaskDialog;

