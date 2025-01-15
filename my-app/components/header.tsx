"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/components/logo.png";
import {
  Menu,
  ChevronDown,
  LogIn,
  LogOut,
  Coins,
  User,
  Bell,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  createUser,
  getUnreadNotifications,
  getUserBalance,
  getUserByEmail,
  markNotificationAsRead,
} from "@/utils/db/actions";

const clientID =
  "BFpR6wWj7Qdf9y1Gjyca6XcSBzhpYZ4fk5LiGiurjFmKg5UovV5rl3yii41-0C0Xb8Ur-zlbmT6h1H9tzXMu6Dc";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId: clientID,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

type HeaderProps = {
  onMenuClick: () => void;
  totalEarnings: number;
};

export default function Header({ onMenuClick, totalEarnings }: HeaderProps) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [notification, setNotification] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        console.log("Initializing Web3Auth...");
        await web3auth.initModal();
        console.log("Web3Auth initialized successfully.");

        if (web3auth.connected) {
          setProvider(web3auth.provider);
          setLoggedIn(true);

          const user = await web3auth.getUserInfo();
          setUserInfo(user);

          if (user.email) {
            localStorage.setItem("userEmail", user.email);
            await createUser(user.email, user.name || "Anonymous User");
          }
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    initWeb3Auth();
  }, []);

  const login = async () => {
    try {
      const web3AuthProvider = await web3auth.connect();
      setProvider(web3AuthProvider);
      setLoggedIn(true);

      const user = await web3auth.getUserInfo();
      setUserInfo(user);

      if (user.email) {
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name || "Anonymous User");
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name || "Anonymous User",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create or fetch user.");
        }

        const data = await response.json();
        if (data.userId) {
          localStorage.setItem("userId", data.userId);
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      setUserInfo(null);
      localStorage.removeItem("userEmail");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="bg-[#DFF6DD] border-b border-[#006A4E] sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:mr-4"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6 text-[#006A4E]" />
          </Button>
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="Logo" className="h-10 w-10 mr-2" />
            <span className="font-bold text-xl text-[#006A4E]">
              WasteZeroBangladesh
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-3 relative">
                <Bell className="h-5 w-5 text-[#006A4E]" />
                {notification.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5">
                    {notification.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {notification.length > 0 ? (
                notification.map((n) => (
                  <DropdownMenuItem key={n.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{n.type}</span>
                      <span className="text-sm text-gray-500">{n.message}</span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Balance */}
          <div className="mr-3 flex items-center bg-[#BDE0C0] rounded-full px-3 py-1">
            <Coins className="h-5 w-5 text-[#006A4E] mr-1" />
            <span className="font-semibold text-sm text-[#006A4E]">
              {balance.toFixed(2)}
            </span>
          </div>

          {/* Login/Logout */}
          {!isLoggedIn ? (
            <Button
              onClick={login}
              className="bg-[#006A4E] hover:bg-[#005A3E] text-white font-medium px-6 rounded-full shadow-md transition-all"
            >
              Login
              <LogIn className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#BDE0C0] flex items-center justify-center">
                    <User className="h-4 w-4 text-[#006A4E]" />
                  </div>
                  <span className="text-[#006A4E] font-medium">
                    {userInfo?.name || "Anonymous"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#006A4E]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/admin_auth" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Admin
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
