import {Box, CircularProgress} from "@mui/material";
import React from "react";

export function SuspenseContent() {
    return <Box className='m-auto p-24'>
        <CircularProgress size={100}/>
    </Box>
}