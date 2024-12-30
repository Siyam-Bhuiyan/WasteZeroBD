import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Trash,
  Heart,
  Medal,
  Settings,
  Home,
  Recycle,
  Coins,
} from "lucide-react";

const navbarItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/report", icon: MapPin, label: "Report Waste" },
  { href: "/collect", icon: Trash, label: "Collect Waste" },
  { href: "/rewards", icon: Heart, label: "Rewards" },
  { href: "/leaderboard", icon: Coins, label: "Leaderboard" },
  { href: "/market", icon: Medal, label: "Waste Marketplace" },
  {
    href: "/recycling-recommendations",
    icon: Recycle,
    label: "Recycling Recommendations",
  }, // New item
];

interface NavbarProps {
  open: boolean;
}

export default function Navbar({ open }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-[#DFF6DD] border-b border-gray-200 text-gray-800 w-full sticky top-0 z-30">
      <div className="px-4 py-4 flex items-center justify-center">
        {" "}
        {/* Center navbar items */}
        {/* Menu items */}
        <div className="flex space-x-6">
          {navbarItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={`px-4 py-2 ${
                  pathname === item.href
                    ? "bg-[#006A4E] text-white" // Bottlegreen for active
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800" // Lighter hover effect
                }`}
              >
                <item.icon className="mr-2 h-5 w-5" />
                <span className="text-base">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
        {/* Settings Button (optional, you can center it or remove it) */}
        <div className="ml-8">
          <Link href="/settings" passHref>
            <Button
              variant={pathname === "/settings" ? "secondary" : "outline"}
              className={`px-4 py-2 ${
                pathname === "/settings"
                  ? "bg-[#006A4E] text-white"
                  : "text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Settings className="mr-2 h-5 w-5" />
              <span className="text-base">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
