import React from "react";
import "./topbar.css";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";

const Topbar: React.FC = () => {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
        <a href="/" className="iconLink">
            <ArrowBack />
          </a>
          <span className="logo">Admin </span>
          <span className="logo2"> Dashboard</span>

        </div>
      </div>
    </div>
  );
};

export default Topbar;
