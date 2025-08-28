import { Box, TextField } from '@mui/material';
import React from 'react'
import { useKanbanStore } from '../store/KanbanProvider';

const KanbanHeader = () => {
  const [search, setSearch] = useKanbanStore((state) =>
    [state.search, state.setSearch],
  );
  return (
    <Box sx={{ p: 1, py: 2, borderBottom: "0.5px solid #444" }}>
      <TextField

        name="Search"
        placeholder="Search by Task Title or description"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
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
              minWidth: 500,
              color: "#fff",
              borderColor: "#fff !important"
            }
          }
        }}
      />
    </Box>
  )
}

export default KanbanHeader
