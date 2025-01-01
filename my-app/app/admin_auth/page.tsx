"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For App Router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react"; // Assuming you have lucide-react icons installed

const SUPERADMIN_USERNAME = "ish"; // Replace with your secure username
const SUPERADMIN_PASSWORD = "maam"; // Replace with your secure password

export default function SuperAdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authState = localStorage.getItem("isSuperAdminAuthenticated");
    if (authState === "true") {
      setIsAuthenticated(true);
      router.push("/admin"); // Redirect to /admin if already authenticated
    }
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => { // Simulate a network request
      if (username === SUPERADMIN_USERNAME && password === SUPERADMIN_PASSWORD) {
        localStorage.setItem("isSuperAdminAuthenticated", "true"); // Store login state
        router.push("/admin"); // Redirect to admin dashboard
      } else {
        setError("Invalid username or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isSuperAdminAuthenticated");
    router.push("/admin"); // Redirect to admin login
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-semibold text-center mb-6">SuperAdmin Login</h1>
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <Button
            className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin mr-2 h-5 w-5 text-white" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return null; // Redirecting authenticated users to /admin
}