import { Box, Typography } from '@mui/material'
import React from 'react'

const ColumnHeader = ({ title }: { title: string }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#25282e",
        height: "50px",
        minHeight: "50px",
        p: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderStartEndRadius: "4px",
        borderStartStartRadius: "4px",
      }}

    >
      <Typography
        sx={{
          px: 0.5,
          fontSize: "16px",
          fontWeight: "800",
        }}
      >
        {title}
      </Typography>

    </Box>
  )
}

export default ColumnHeader
