"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid, GridCellParams } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";

const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [activeSection, setActiveSection] = useState("certificate");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions dynamically based on the active section
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/user/api/transactions?type=${activeSection}`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [activeSection]);

  const columns = [
    { field: "transactionId", headerName: "Transaction ID", flex: 1 },
    { field: "userName", headerName: "Username", flex: 1 },
    { field: "userEmail", headerName: "User Email", flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <Typography color={colors.greenAccent[500]}>
          ${params.row.amount}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date Paid",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="Transactions" subtitle="Manage All Transactions" />

      {/* Section Buttons */}
      <Box
        display="flex"
        justifyContent="space-between"
        mb="20px"
        sx={{
          "& > button": {
            flex: 1,
            height: "60px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: 0,
            color: theme.palette.text.primary, // Text color for all buttons
          },
          "& > button.MuiButton-contained": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? colors.blueAccent[700] // Darker background for dark mode
                : colors.blueAccent[300], // Lighter background for light mode
            color: theme.palette.common.white, // Ensure text is always visible
            boxShadow: "none",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? colors.blueAccent[600] // Slightly lighter hover color for dark mode
                  : colors.blueAccent[400], // Slightly darker hover color for light mode
            },
          },
          "& > button.MuiButton-outlined": {
            borderColor: theme.palette.mode === "dark" ? colors.grey[500] : colors.grey[300],
            color: theme.palette.text.primary,
          },
          "& > button:not(:last-child)": {
            borderRight: "1px solid",
            borderColor: theme.palette.mode === "dark" ? colors.grey[700] : colors.grey[300],
          },
        }}
      >
        <Button
          variant={activeSection === "certificate" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setActiveSection("certificate")}
        >
          Certificates
        </Button>
        <Button
          variant={activeSection === "buySell" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setActiveSection("buySell")}
        >
          Buy and Sell
        </Button>
        <Button
          variant={activeSection === "residential" ? "contained" : "outlined"}
          color="primary"
          onClick={() => setActiveSection("residential")}
        >
          Residential Services
        </Button>
      </Box>

      {/* Transactions Table */}
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            color: theme.palette.text.primary, // Dynamically set text color
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            color: theme.palette.text.primary, // Dynamically set footer text color
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={transactions}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default Transactions;
