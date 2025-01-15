import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Trash, Coins, Medal, Settings, Home, Recycle } from "lucide-react";

const sidebarItems = [
  { href: "/", icon: Home, label: "Homepage" },
  { href: "/user/report", icon: MapPin, label: "Report Waste" },
  { href: "/user/collect", icon: Trash, label: "Collect Waste" },
  { href: "/user/rewards", icon: Coins, label: "Rewards" },
  { href: "/user/leaderboard", icon: Medal, label: "Leaderboard" },
  { href: "/user/market", icon: Medal, label: "Waste Marketplace" },
  { href: "/user/recycling-recommendations", icon: Recycle, label: "Recycle Recommendations" },
  { href: "/user/certificate/questions", icon: Medal, label: "Certificate" },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-80 bg-[#DFF6DD] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="text-center py-6 bg-[#006A4E] text-white font-bold text-xl">
            WasteZeroBangladesh
          </div>

          {/* Sidebar Items */}
          <div className="flex flex-col mt-6 space-y-3 px-6">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block w-full px-4 py-3 text-left rounded-md text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-[#006A4E] text-white"
                    : "text-[#006A4E] hover:bg-[#006A4E] hover:text-white"
                }`}
              >
                {item.icon && <item.icon className="inline-block mr-3 h-5 w-5" />}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="px-6 mt-auto mb-6">
            <Link
              href="/settings"
              className={`block w-full px-4 py-3 text-left rounded-md text-base font-medium transition-colors ${
                pathname === "/settings"
                  ? "bg-[#006A4E] text-white"
                  : "text-[#006A4E] hover:bg-[#006A4E] hover:text-white"
              }`}
            >
              <Settings className="inline-block mr-3 h-5 w-5" />
              Settings
            </Link>
          </div>
        </nav>
      </aside>

      {/* Overlay (for mobile screens) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
