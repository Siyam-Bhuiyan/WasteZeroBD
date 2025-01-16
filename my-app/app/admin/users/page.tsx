"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { tokens } from "../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../components/Header";

type User = {
  id: number;
  name: string;
  email: string;
  access: string; // 'admin', 'manager', or 'user'
  banned: boolean;
};

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("/user/api/fetchUsers");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle ban/unban functionality
  const handleBanUnban = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/user/api/fetchUsers/banUnban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, banned: !currentStatus }),
      });

      if (!response.ok) throw new Error("Failed to update user status");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, banned: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const columns: GridColDef<User>[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      renderCell: ({ row }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          sx={{
            backgroundColor:
              row.access === "admin"
                ? colors.greenAccent[600]
                : row.access === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[500],
          }}
          borderRadius="4px"
        >
          {row.access === "admin" && <AdminPanelSettingsOutlinedIcon />}
          {row.access === "manager" && <SecurityOutlinedIcon />}
          {row.access === "user" && <LockOpenOutlinedIcon />}
          <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
            {row.access}
          </Typography>
        </Box>
      ),
    },
    {
      field: "banned",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row }) => (
        <Typography
          color={row.banned ? colors.redAccent[500] : colors.greenAccent[500]}
        >
          {row.banned ? "Banned" : "Active"}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          color={row.banned ? "success" : "error"}
          onClick={() => handleBanUnban(row.id, row.banned)}
        >
          {row.banned ? "Unban" : "Ban"}
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="USERS" subtitle="Managing the Users" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          disableRowSelectionOnClick // Only select rows by clicking on checkboxes
          rows={users}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default Users;
