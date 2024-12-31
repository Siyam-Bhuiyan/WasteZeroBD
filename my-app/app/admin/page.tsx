"use client";

import React from "react";
import FeaturedInfo from "@/app/admin/components/featuredInfo/page"
import Chart from "@/app/admin/components/chart/page";
import WidgetSm from "@/app/admin/components/widgetSm/page";
import WidgetLg from "@/app/admin/components/widgetLg/page";

const AdminDashboard: React.FC = () => {
  const data = [
    { name: "Jan", "Active User": 4000 },
    { name: "Feb", "Active User": 3000 },
    { name: "Mar", "Active User": 5000 },
  ];

  return (
    <div>
      <FeaturedInfo />
      <Chart data={data} title="User Analytics" dataKey="Active User" grid />
      <div className="widgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
};

export default AdminDashboard;
