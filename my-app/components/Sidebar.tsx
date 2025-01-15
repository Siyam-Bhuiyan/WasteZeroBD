import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Trash,
  Coins,
  Medal,
  Settings,
  Home,
  Recycle,
  ShoppingBag, // Icon for Waste Marketplace
  Trophy, // Icon for Certificate
} from "lucide-react"; // Updated Icons

const sidebarItems = [
  { href: "/", icon: Home, label: "Homepage" },
  { href: "/user/report", icon: MapPin, label: "Report Waste" },
  { href: "/user/collect", icon: Trash, label: "Collect Waste" },
  { href: "/user/rewards", icon: Coins, label: "Rewards" },
  { href: "/user/leaderboard", icon: Medal, label: "Leaderboard" },
  {
    href: "/user/market",
    icon: ShoppingBag, // New Icon for Waste Marketplace
    label: "Waste Marketplace",
  },
  {
    href: "/user/recycling-recommendations",
    icon: Recycle,
    label: "Recycle Recommendations",
  },
  {
    href: "/user/certificate/questions",
    icon: Trophy, // New Icon for Certificate
    label: "Certificate",
  },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={`h-screen bg-black text-white shadow-lg transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-72" : "w-24"
      } fixed inset-y-0 left-0 z-30`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-6 py-6 bg-gray-800 font-bold text-xl">
        <span className={isSidebarOpen ? "block" : "hidden"}>
          WasteZeroBangladesh
        </span>
        <span className={isSidebarOpen ? "hidden" : "block"}>WZB</span>
        <button onClick={toggleSidebar} className="text-white">
          <span>{isSidebarOpen ? "←" : "→"}</span>
        </button>
      </div>

      {/* Sidebar Items */}
      <nav className="mt-6 flex flex-col space-y-3">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-300 ${
              pathname === item.href
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <item.icon className="h-6 w-6" />
            {isSidebarOpen && <span className="ml-4">{item.label}</span>}
          </Link>
        ))}

        {/* Sidebar Footer */}
        <Link
          href="/settings"
          className={`flex items-center px-6 py-3 mt-3 rounded-md font-medium transition-all ${
            pathname === "/settings"
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <Settings className="h-6 w-6" />
          {isSidebarOpen && <span className="ml-4">Settings</span>}
        </Link>
      </nav>
    </div>
  );
}
