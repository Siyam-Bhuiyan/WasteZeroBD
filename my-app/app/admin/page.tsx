"use client";

import { usePathname } from "next/navigation";
import Dashboard from "./dashboard/page";
import Team from "./team/page";
import Contacts from "./contacts/page";
import Invoices from "./invoices/page";
import Form from "./form/page";
import Bar from "./bar/page";
import Pie from "./pie/page";
import Line from "./line/page";
import Calendar from "./calendar/page";
import Geography from "./geography/page";

export default function AdminPage() {
  const pathname = usePathname();

  // Dynamically render the correct page based on the route
  const renderContent = () => {
    switch (pathname) {
      case "/admin/team":
        return <Team />;
      case "/admin/contacts":
        return <Contacts />;
      case "/admin/invoices":
        return <Invoices />;
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
      default:
        return <Dashboard />;
    }
  };

  return renderContent();
}
