//app/collect/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Trash2,
  MapPin,
  CheckCircle,
  Clock,
  Upload,
  Loader,
  Calendar,
  Weight,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import {
  getWasteCollectionTasks,
  updateTaskStatus,
  saveReward,
  saveCollectedWaste,
  getUserByEmail,
} from "@/utils/db/actions";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure to set your Gemini API key in your environment variables
const geminiApiKey = "AIzaSyBHsDwAUeSLBwze08tuF3Yukz90jeU5nE0";

type CollectionTask = {
  id: number;
  location: string;
  wasteType: string;
  amount: string;
  status: "pending" | "in_progress" | "completed" | "verified";
  date: string;
  collectorId: number | null;
};

const ITEMS_PER_PAGE = 9;

export default function CollectPage() {
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredWasteType, setHoveredWasteType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<{
    id: number;
    email: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      setLoading(true);
      try {
        // Fetch user
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          const fetchedUser = await getUserByEmail(userEmail);
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            toast.error("User not found. Please log in again.");
            // Redirect to login page or handle this case appropriately
          }
        } else {
          toast.error("User not logged in. Please log in.");
          // Redirect to login page or handle this case appropriately
        }

        // Fetch tasks
        const fetchedTasks = await getWasteCollectionTasks();
        setTasks(fetchedTasks as CollectionTask[]);
      } catch (error) {
        console.error("Error fetching user and tasks:", error);
        toast.error("Failed to load user data and tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndTasks();
  }, []);

  const [selectedTask, setSelectedTask] = useState<CollectionTask | null>(null);
  const [verificationImage, setVerificationImage] = useState<string | null>(
    null
  );
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "verifying" | "success" | "failure"
  >("idle");
  const [verificationResult, setVerificationResult] = useState<{
    wasteTypeMatch: boolean;
    quantityMatch: boolean;
    confidence: number;
  } | null>(null);
  const [reward, setReward] = useState<number | null>(null);

  const handleStatusChange = async (
    taskId: number,
    newStatus: CollectionTask["status"]
  ) => {
    if (!user) {
      toast.error("Please log in to collect waste.");
      return;
    }

    try {
      const updatedTask = await updateTaskStatus(taskId, newStatus, user.id);
      if (updatedTask) {
        setTasks(
          tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: newStatus, collectorId: user.id }
              : task
          )
        );
        toast.success("Task status updated successfully");
      } else {
        toast.error("Failed to update task status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVerificationImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const readFileAsBase64 = (dataUrl: string): string => {
    return dataUrl.split(",")[1];
  };

  const handleVerify = async () => {
    if (!selectedTask || !verificationImage || !user) {
      toast.error("Missing required information for verification.");
      return;
    }

    setVerificationStatus("verifying");

    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const base64Data = readFileAsBase64(verificationImage);

      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg", // Adjust this if you know the exact type
          },
        },
      ];

      const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
        1. Confirm if the waste type matches: ${selectedTask.wasteType}
        2. Estimate if the quantity matches: ${selectedTask.amount}
        3. Your confidence level in this assessment (as a percentage)
        
        Respond in JSON format like this:
        {
          "wasteTypeMatch": true/false,
          "quantityMatch": true/false,
          "confidence": confidence level as a number between 0 and 1
        }`;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();

      try {
        // Clean the response text: remove the JSON markdown formatting
        const cleanedText = text.replace(/json\n|\n/g, "").trim();

        // Parse the cleaned-up text
        const parsedResult = JSON.parse(cleanedText);

        setVerificationResult({
          wasteTypeMatch: parsedResult.wasteTypeMatch,
          quantityMatch: parsedResult.quantityMatch,
          confidence: parsedResult.confidence,
        });
        setVerificationStatus("success");

        if (
          parsedResult.wasteTypeMatch &&
          parsedResult.quantityMatch &&
          parsedResult.confidence > 0.7
        ) {
          await handleStatusChange(selectedTask.id, "verified");
          const earnedReward = Math.floor(Math.random() * 50) + 10; // Random reward between 10 and 59

          // Save the reward
          await saveReward(user.id, earnedReward);

          // Save the collected waste
          await saveCollectedWaste(selectedTask.id, user.id, parsedResult);

          setReward(earnedReward);
          toast.success(
            `Verification successful! You earned ${earnedReward} tokens!`,
            {
              duration: 5000,
              position: "top-center",
            }
          );
        } else {
          toast.error(
            "Verification failed. The collected waste does not match the reported waste.",
            {
              duration: 5000,
              position: "top-center",
            }
          );
        }
      } catch (error) {
        console.error("Failed to parse JSON response:", text);
        setVerificationStatus("failure");
      }
    } catch (error) {
      console.error("Error verifying waste:", error);
      setVerificationStatus("failure");
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#ecfdf5",
      }}
    >
      {" "}
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-900 to-green-700 mb-4">
            Waste Collection Tasks
          </h1>
          <p className="text-gray-800 text-lg max-w-2xl mx-auto">
            Join our mission to create a cleaner environment. Collect waste,
            verify your contribution, and earn rewards.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg bg-transparent">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-transparent border-none focus:outline-none focus:ring-0"
                />
              </div>
              <Button className="bg-[#047857] hover:bg-[#03543F] text-white">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-8 w-8 text-blue-500" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedTasks.map((task) => (
              <Card
                key={task.id}
                className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-gray-800">
                        {task.location}
                      </h3>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Trash2 className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{task.wasteType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Weight className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{task.amount}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{task.date}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    {task.status === "pending" && (
                      <Button
                        onClick={() =>
                          handleStatusChange(task.id, "in_progress")
                        }
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        Start Collection
                      </Button>
                    )}
                    {task.status === "in_progress" &&
                      task.collectorId === user?.id && (
                        <Button
                          onClick={() => setSelectedTask(task)}
                          className="w-full bg-[#047857] hover:bg-[#03543F] text-white"
                        >
                          Complete & Verify
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {currentPage} of {pageCount}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
            className="bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
          >
            Next
          </Button>
        </div>

        {/* Verification Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Verify Collection
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTask(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <label
                        htmlFor="verification-image"
                        className="block text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                      >
                        Upload verification image
                        <input
                          id="verification-image"
                          type="file"
                          className="sr-only"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </label>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>

                  {verificationImage && (
                    <div className="relative">
                      <img
                        src={verificationImage}
                        alt="Verification"
                        className="rounded-lg w-full"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setVerificationImage(null)}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  <Button
                    onClick={handleVerify}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={
                      !verificationImage || verificationStatus === "verifying"
                    }
                  >
                    {verificationStatus === "verifying" ? (
                      <div className="flex items-center justify-center">
                        <Loader className="animate-spin mr-2 h-5 w-5" />
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify Collection"
                    )}
                  </Button>

                  {verificationStatus === "success" && verificationResult && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                      <div className="flex items-center text-green-800">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">
                          Verification Successful
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          Waste Type Match:{" "}
                          {verificationResult.wasteTypeMatch ? "Yes" : "No"}
                        </p>
                        <p>
                          Quantity Match:{" "}
                          {verificationResult.quantityMatch ? "Yes" : "No"}
                        </p>
                        <p>
                          Confidence:{" "}
                          {(verificationResult.confidence * 100).toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    in_progress: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Trash2,
    },
    completed: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    verified: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: CheckCircle,
    },
  };

  const { color, icon: Icon } = config[status];

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${color} border flex items-center gap-1`}
    >
      <Icon className="h-3 w-3" />
      {status.replace("_", " ")}
    </span>
  );
};
