'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  Modal,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { tokens } from '../theme';
import Header from '../components/Header';
import cleanerData from '../cleanerData/data'; // Import cleaner data

type Cleaner = {
  cleanerId: number;
  cleanerName: string;
  cleanerContact: string;
  cleanerPicture: string;
  cleanerResidence: string;
  tasksAssigned?: string[];
};

type Service = {
  id: string;
  userId: number;
  location: string;
  wasteType: string;
  status: string;
  cleanerId?: number | null;
  createdAt: string;
};

const ResidentialServices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [services, setServices] = useState<Service[]>([]);
  const [cleaners, setCleaners] = useState<Cleaner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [cleanerAssignments, setCleanerAssignments] = useState<Record<string, string>>({});

  // Fetch residential services and cleaners data
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

    const fetchCleaners = () => {
      setCleaners(cleanerData); // Simulate fetching data from cleanerData
    };

    fetchServices();
    fetchCleaners();
  }, []);

  // Handle assigning a cleaner to a service
  const handleAssignCleaner = async (serviceId: string, cleanerId: string, cleanerName: string) => {
    try {
      const response = await fetch('/user/api/assignCleaner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, cleanerId, cleanerName }),
      });

      if (!response.ok) {
        throw new Error('Failed to assign cleaner');
      }

      // Update the UI after successful assignment
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === serviceId
            ? { ...service, cleanerId, status: `Assigned to ${cleanerName}` }
            : service
        )
      );

      // Notify the user
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        const notificationMessage =
          'Your residential service is ready. A cleaner has been assigned, pay now to get the details.';
        const notificationType = 'assignment';
        await fetch('/user/api/createNotification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: service.userId, message: notificationMessage, type: notificationType }),
        });
      }

      alert(`Cleaner ${cleanerName} assigned to Service ID ${serviceId}`);
    } catch (error) {
      console.error('Error assigning cleaner:', error);
      alert('Failed to assign cleaner. Please try again.');
    }
  };

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
      flex: 2,
      renderCell: (params: GridCellParams) => {
        const serviceId = params.row.id;
        const currentAssignment = cleanerAssignments[serviceId] || 'pending';

        if (params.row.status.includes('Assigned to')) {
          return <Typography>{params.row.status}</Typography>;
        }

        return (
          <Box display="flex" flexDirection="column" gap={1}>
            <FormControl fullWidth>
              <Select
                value={currentAssignment}
                onChange={(e) =>
                  setCleanerAssignments((prev) => ({ ...prev, [serviceId]: e.target.value }))
                }
              >
                <MenuItem value="pending">Pending</MenuItem>
                {cleaners.map((cleaner) => (
                  <MenuItem key={cleaner.cleanerId} value={cleaner.cleanerId}>
                    {cleaner.cleanerName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const cleanerId = cleanerAssignments[serviceId];
                if (cleanerId && cleanerId !== 'pending') {
                  const cleaner = cleaners.find((c) => c.cleanerId === parseInt(cleanerId, 10));
                  if (cleaner) {
                    handleAssignCleaner(serviceId, cleaner.cleanerId, cleaner.cleanerName);
                  }
                } else {
                  alert('Please select a cleaner.');
                }
              }}
            >
              Assign Cleaner
            </Button>
          </Box>
        );
      },
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
          '& .MuiDataGrid-root': { border: 'none' },
          '& .MuiDataGrid-cell': { borderBottom: 'none' },
          '& .MuiDataGrid-columnHeaders': { backgroundColor: colors.blueAccent[700], borderBottom: 'none' },
          '& .MuiDataGrid-virtualScroller': { backgroundColor: colors.primary[400] },
          '& .MuiDataGrid-footerContainer': { borderTop: 'none', backgroundColor: colors.blueAccent[700] },
          '& .MuiCheckbox-root': { color: `${colors.greenAccent[200]} !important` },
        }}
      >
        <DataGrid rows={services} columns={columns} loading={loading} getRowId={(row) => row.id} rowHeight={120} />
      </Box>

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
          <Typography id="image-modal-title" variant="h6">
            User Uploaded Images
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            {selectedImages.map((url, index) => (
              <img key={index} src={url} alt={`Uploaded image ${index + 1}`} style={{ width: '100%' }} />
            ))}
          </Box>
          <Button onClick={() => setModalOpen(false)} variant="contained" color="secondary" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ResidentialServices;
