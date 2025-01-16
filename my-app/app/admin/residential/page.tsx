'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme, Modal } from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { tokens } from '../theme';
import Header from '../components/Header';

const ResidentialServices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // Fetch residential services from the database
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch('/user/api/residential/services');
        if (!response.ok) throw new Error('Failed to fetch residential services');
        const data = await response.json();
        setServices(data.services);
      } catch (error) {
        console.error('Error fetching residential services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fetch images for a specific user
  const fetchImages = async (userId: string) => {
    try {
      const response = await fetch(`/user/api/fetchPicture?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }
      const data = await response.json();
      return data.images || [];
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  };

  const columns = [
    { field: 'id', headerName: 'Service ID', flex: 1 },
    { field: 'userId', headerName: 'User ID', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    { field: 'wasteType', headerName: 'Waste Type', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <Typography
          color={params.row.status === 'completed' ? colors.greenAccent[500] : colors.redAccent[500]}
        >
          {params.row.status}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
    },
    {
      field: 'images',
      headerName: 'Images',
      flex: 2,
      renderCell: (params: GridCellParams) => (
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            const images = await fetchImages(params.row.userId);
            if (images.length > 0) {
              setSelectedImages(images.map((img) => img.secure_url)); // Store image URLs
              setModalOpen(true); // Open the modal
            } else {
              alert('No images found for this user.');
            }
          }}
        >
          View Images
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Residential Services" subtitle="Manage Residential Service Requests" />

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
          rows={services}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          checkboxSelection
        />
      </Box>

      {/* Modal for displaying images */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxHeight: '80%',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
          }}
        >
          <Typography id="image-modal-title" variant="h6" component="h2">
            User Uploaded Images
          </Typography>
          <Box id="image-modal-description" mt={2} display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            {selectedImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`User uploaded image ${index + 1}`}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            ))}
          </Box>
          <Button
            onClick={() => setModalOpen(false)}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ResidentialServices;
