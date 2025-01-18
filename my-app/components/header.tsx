"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
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
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { toast } from "react-hot-toast";

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
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Function to initialize the user
    const initializeUser = async () => {
        try {
            const user = await web3auth.getUserInfo();

            if (!user.email || !user.name) {
                throw new Error("Incomplete user information.");
            }

            console.log("User email:", user.email);
            console.log("User name:", user.name);

            // Check if the user is banned
            const isBanned = await checkBanStatus(user.email);
            if (isBanned) {
                toast.error("You have been banned! Contact Admin for further assistance.");
                throw new Error("Banned user.");
            }

            // Fetch user ID
            const fetchedUserId = await fetchUserId(user.email);
            if (!fetchedUserId) {
                throw new Error("User ID not found for the given email.");
            }

            // Store user data in state and localStorage
            setUserEmail(user.email);
            setUserName(user.name);
            setUserId(fetchedUserId);
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userId", fetchedUserId);

            // Fetch notifications
            await fetchNotifications(fetchedUserId);

            return user; // Return user for further use if needed
        } catch (error: any) {
            console.error("Error initializing user:", error.message);
            throw error;
        }
    };

    // Effect to initialize Web3Auth on component mount
    useEffect(() => {
        const initWeb3Auth = async () => {
            try {
                await web3auth.initModal();
                localStorage.removeItem("userId");
                localStorage.removeItem("userName");
                localStorage.removeItem("userEmail");

                if (web3auth.connected) {
                    setProvider(web3auth.provider);
                    setLoggedIn(true);
                    const user = await initializeUser();
                    setUserInfo(user);
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to initialize Web3Auth.");
            }
        };

        initWeb3Auth();
    }, []);

    // Function to log in
    const login = async () => {
        try {
            const web3AuthProvider = await web3auth.connect();
            setProvider(web3AuthProvider);
            setLoggedIn(true);

            const user = await initializeUser();
            setUserInfo(user);

            toast.success("Login successful.");
        } catch (error: any) {
            console.error("Login failed:", error.message);
            toast.error(error.message || "Login failed.");
        }
    };

    // Function to log out
    const logout = async () => {
        try {
            await web3auth.logout();
            setProvider(null);
            setLoggedIn(false);
            setUserInfo(null);
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            toast.success("Logged out successfully.");
        } catch (error) {
            toast.error("Logout failed.");
        }
    };

    // Check if a user is banned
    const checkBanStatus = async (email: string): Promise<boolean> => {
        try {
            const response = await fetch(`/user/api/checkBanStatus`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error("Failed to check ban status.");
            }

            const data = await response.json();
            return data.banned;
        } catch (err: any) {
            throw new Error(err.message || "Error checking ban status.");
        }
    };

    // Fetch user ID
    const fetchUserId = async (email: string): Promise<string | null> => {
        try {
            console.log("Fetching user ID for email:", email);

            const response = await fetch(`/user/api/fetchUserByEmail?email=${encodeURIComponent(email)}`, {
                method: "GET",
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                console.error("Error fetching user ID:", response.statusText);
                throw new Error(`Failed to fetch user ID: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("User ID fetch response data:", data);

            return data.userId || null;
        } catch (err: any) {
            console.error("Error in fetchUserId:", err.message);
            return null;
        }
    };

    // Fetch notifications
    const fetchNotifications = async (userId: string) => {
        try {
            const response = await fetch(`/user/api/getNotifications?userId=${userId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch notifications");
            }
            const data = await response.json();
            setNotification(data.notifications || []);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    // Handle payment
    const handlePayment = async (notificationId: number, amount: number, type: string) => {
        if (!userEmail || !userName) {
            toast.error("User information is missing. Please log in.");
            return;
        }

        try {
            const result = await axios.post("/user/api/sslcommerz-intent/sslcommerz/create-payment", {
                amount,
                userEmail,
                userName,
                type:'residential',
            });

            if (result.data.success && result.data.url) {
                window.location.href = result.data.url;
            } else {
                toast.error("Failed to initiate payment.");
            }
        } catch (error: any) {
            console.error("Error during payment:", error.message);
            toast.error(error.response?.data?.message || "Payment failed. Please try again.");
        }
    };

    return (
        <header className="bg-black text-white border-b border-gray-800 sticky top-0 z-50 shadow-md">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="mr-2 text-white" onClick={onMenuClick}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <Link href="/" className="font-bold text-xl">
                        WasteZeroBangladesh
                    </Link>
                </div>

                <div className="flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative text-white">
                                <Bell className="h-5 w-5" />
                                {notification.length > 0 && (
                                    <Badge className="absolute -top-1 -right-1 px-1 min-w-[1.2rem] h-5 bg-red-500 text-white">
                                        {notification.length}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 bg-black text-white border border-gray-700">
                            {notification.length > 0 ? (
                                notification.map((n, index) => (
                                    <DropdownMenuItem
                                        key={n.id || `notification-${index}`}
                                        onClick={() => handlePayment(n.id, 500, "residential")}
                                        className="hover:bg-gray-800 cursor-pointer"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{n.type}</span>
                                            <span className="text-sm text-gray-400">{n.message}</span>
                                        </div>
                                    </DropdownMenuItem>
                                ))
                            ) : (
                                <DropdownMenuItem className="hover:bg-gray-800">
                                    No new notifications
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="mr-3 flex items-center bg-gray-900 rounded-full px-3 py-1">
                        <Coins className="h-5 w-5 text-white mr-1" />
                        <span className="font-semibold text-sm">{balance.toFixed(2)}</span>
                    </div>

                    {!isLoggedIn ? (
                        <Button onClick={login} className="bg-white text-black font-medium px-6 rounded-full shadow-md">
                            Login
                            <LogIn className="ml-2 h-5 w-5" />
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 text-white">
                                    <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">{userInfo?.name || "Anonymous"}</span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-black text-white border border-gray-700">
                                <DropdownMenuItem className="hover:bg-gray-800">
                                    <Link href="/profile" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-500 hover:bg-gray-800"
                                    onClick={logout}
                                >
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
