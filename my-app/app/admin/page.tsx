"use client";

import { usePathname } from "next/navigation";
import Dashboard from "./dashboard/page";
import Users from "./users/page";
import Certificate from "./certificate/page";
import Form from "./form/page";
import Bar from "./bar/page";
import Pie from "./pie/page";
import Line from "./line/page";
import Calendar from "./calendar/page";
import Geography from "./geography/page";
import Transactions from "./transactions/page";

export default function AdminPage() {
  const pathname = usePathname();

  // Dynamically render the correct page based on the route
  const renderContent = () => {
    switch (pathname) {
      case "/admin/users":
        return <Users />;
      case "/admin/certificate":
        return <Certificate />;
      case "/admin/transactions":
        return <Transactions />;
      case "/admin/form":
        return <Form />;
      case "/admin/bar":
        return <Bar />;
      case "/admin/pie":
        return <Pie />;
      case "/admin/line":
        return <Line />;
      case "/admin/calendar":
        return <Calendar />;
      case "/admin/geography":
        return <Geography />;
      case "/admin":
        return <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return renderContent();
}
