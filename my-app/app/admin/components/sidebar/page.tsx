import React, { useEffect, useState } from "react";
import "./sidebar.css";
import {
  LineStyle,
  Timeline,
  TrendingUp,
  PermIdentity,
  Storefront,
  AttachMoney,
  BarChart,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
  WorkOutline,
  Report,
  Delete,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import Link from "next/link";
import axios from "axios"; // Assuming you're using axios

const Sidebar: React.FC = () => {
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        const res = await axios.get("/api/certificates/pending"); // Update with your API route
        console.log("API Response:", res.data); // Log response
        setPendingReviews(res.data.pendingCount || 0);
      } catch (err) {
        console.error("Error fetching pending certificate reviews:", err);
      }
    };
  
    fetchPendingReviews();
  }, []);
  

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
        
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <a href="/admin/certificate-reviews" className="link">
              <li className="sidebarListItem">
                <BadgeIcon className="sidebarIcon" />
                Certificate
                {pendingReviews > 0 && (
                  <span className="badge">{pendingReviews}</span> // Badge styling
                )}
              </li>
            </a>
            <Link href="/admin/collect" className="link">
              <li className="sidebarListItem">
                <Delete className="sidebarIcon" />
                Waste Collected
              </li>
            </Link>
            <Link href="/admin/transactions" className="link">
            <li className="sidebarListItem">
              <AttachMoney className="sidebarIcon" />
              Transactions
            </li>
            </Link>
            <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
              Reports
            </li>
            <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
              Users
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
