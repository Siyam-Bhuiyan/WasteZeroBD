import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FC, SVGProps } from "react";
import { MapPin, Trash, Heart, Medal, Settings, Home, Recycle, Page } from "lucide-react";

interface NavbarItem {
  href: string;
  icon?: FC<SVGProps<SVGSVGElement>>; // Optional icon
  label: string;
}

const navbarItems: NavbarItem[] = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/report", icon: MapPin, label: "Report Waste" },
  { href: "/collect", icon: Trash, label: "Collect Waste" },
  { href: "/rewards", icon: Heart, label: "Rewards" },
  { href: "/leaderboard", icon: Medal, label: "Leaderboard" },
  { href: "/admin", icon: Settings, label: "Admin" }, // Added icon
  { href: "/recycling-recommendations", icon: Recycle, label: "Recycle Recommendations" },
  { href: "/certificate/questions", icon: Medal, label: "Certificate" },
];

interface NavbarProps {
  open: boolean;
}

export default function Navbar({ open }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-[#DFF6DD] border-b border-gray-200 text-gray-800 w-full sticky top-0 z-30">
      <div className="px-4 py-4 flex items-center justify-center">
        <div className="flex space-x-0">
          {navbarItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={`px-4 py-2 ${
                  pathname === item.href
                    ? "bg-[#006A4E] text-white" // Active link styling
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800" // Inactive link styling
                }`}
              >
                {item.icon && <item.icon className="mr-2 h-5 w-5" />} {/* Check if icon exists */}
                <span className="text-base">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
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
