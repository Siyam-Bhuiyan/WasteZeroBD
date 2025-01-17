'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { tokens } from '../theme';
import Header from '../components/Header';
import cleanerData from '../cleanerData/data';
const Cleaners = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  // Fetch cleaner data from the database
  const [cleaners, setCleaners] = useState([]);

  // Load cleaners data
  useEffect(() => {
    // Simulate fetching data from the cleanerData file
    setCleaners(cleanerData);
  }, []);

  const columns = [
    { field: 'cleanerId', headerName: 'Cleaner ID', flex: 2 },
    { field: 'cleanerName', headerName: 'Name', flex: 2 },
    { field: 'cleanerContact', headerName: 'Contact', flex: 2 },
    { field: 'cleanerResidence', headerName: 'Residence', flex: 2 },
    {
        field: 'cleanerPicture',
        headerName: 'Picture',
        flex: 2,
        renderCell: (params: GridCellParams) => (
          <Box
            component="img"
            src={params.row.cleanerPicture}
            alt={`${params.row.cleanerName}'s picture`}
            sx={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ),
      },
      
  ];

  return (
    <Box m="20px">
      <Header title="Cleaners" subtitle="Manage Cleaners Information" />

      <Box
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
            color: theme.palette.text.primary,
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
            color: theme.palette.text.primary,
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={cleaners}
          columns={columns}
          getRowId={(row) => row.cleanerId}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Cleaners;
