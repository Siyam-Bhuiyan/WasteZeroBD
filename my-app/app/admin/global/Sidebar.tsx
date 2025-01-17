"use client"
import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import Image from "next/image"
import userImage from "../assets/User.jpg";
import { Box, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { tokens } from "../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

const SidebarComponent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box sx={{ height: "100vh", backgroundColor: colors.primary[400] }}>
      <Sidebar
        collapsed={collapsed}
        backgroundColor={colors.primary[400]}
        style={{ height: "100vh" }}
      >
        {/* Header */}
        <Menu>
          <MenuItem
            onClick={() => setCollapsed(!collapsed)}
            icon={<MenuOutlinedIcon />}
            style={{ marginBottom: "20px" }}
          >
            {!collapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={2}
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMINIS
                </Typography>
              </Box>
            )}
          </MenuItem>

          {/* Profile Section */}
          {!collapsed && (
            <Box textAlign="center" mb={3}>
              <Image
                alt="profile-user"
                src={userImage}
                width={100}
                height={100}
                style={{ borderRadius: "50%" }}
              />
              <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                mt={2}
              >
                Ishmaam
              </Typography>
              <Typography variant="h5" color={colors.greenAccent[500]}>
                Admin
              </Typography>
            </Box>
          )}

          {/* Menu Items */}
          <Menu>
            <MenuItem
              icon={<HomeOutlinedIcon />}
              component="a"
              href="/admin" // Ensures no nested <a> tag issue
            >
              Dashboard
            </MenuItem>

            {/* Data Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              px={2}
              py={1}
              mt={2}
            >
              Data
            </Typography>
            <MenuItem
              icon={<PeopleOutlinedIcon />}
              component="a"
              href="/admin/users"
            >
              Manage Users
            </MenuItem>
            <MenuItem
              icon={<ContactsOutlinedIcon />}
              component="a"
              href="/admin/certificate"
            >
              Certificate Review
            </MenuItem>
            <MenuItem
              icon={<ReceiptOutlinedIcon />}
              component="a"
              href="/admin/transactions"
            >
              Transactions
            </MenuItem>

            {/* Pages Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              px={2}
              py={1}
              mt={2}
            >
              Pages
            </Typography>
            <MenuItem
              icon={<PersonOutlinedIcon />}
              component="a"
              href="/admin/form"
            >
              Profile Form
            </MenuItem>
            <MenuItem
              icon={<CalendarTodayOutlinedIcon />}
              component="a"
              href="/admin/calendar"
            >
              Calendar
            </MenuItem>
            <MenuItem
              icon={<HomeOutlinedIcon />}
              component="a"
              href="/admin/residential"
            >
              Residential Service
            </MenuItem>

            {/* Charts Section */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              px={2}
              py={1}
              mt={2}
            >
              Charts
            </Typography>
            <MenuItem
              icon={<BarChartOutlinedIcon />}
              component="a"
              href="/admin/bar"
            >
              Bar Chart
            </MenuItem>
            <MenuItem
              icon={<PieChartOutlineOutlinedIcon />}
              component="a"
              href="/admin/pie"
            >
              Pie Chart
            </MenuItem>
            <MenuItem
              icon={<TimelineOutlinedIcon />}
              component="a"
              href="/admin/line"
            >
              Line Chart
            </MenuItem>
            <MenuItem
              icon={<MapOutlinedIcon />}
              component="a"
              href="/admin/geography"
            >
              Geography Chart
            </MenuItem>
          </Menu>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SidebarComponent;
