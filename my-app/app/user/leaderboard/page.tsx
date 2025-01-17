"use client";

import { useState, useEffect } from "react";
import { getAllRewards, getUserByEmail } from "@/utils/db/actions";
import {
  Loader,
  Award,
  User,
  Trophy,
  Crown,
  Sparkles,
  Star,
  Medal,
  Shield,
} from "lucide-react";
import { toast } from "react-hot-toast";

type Reward = {
  id: number;
  userId: number;
  points: number;
  level: number;
  createdAt: Date;
  userName: string | null;
};

export default function LeaderboardPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    id: number;
    email: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchRewardsAndUser = async () => {
      setLoading(true);
      try {
        const fetchedRewards = await getAllRewards();
        setRewards(fetchedRewards);

        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          const fetchedUser = await getUserByEmail(userEmail);
          if (fetchedUser) {
            setUser(fetchedUser);
          } else {
            toast.error("User not found. Please log in again.");
          }
        }
      } catch (error) {
        console.error("Error fetching rewards and user:", error);
        toast.error("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchRewardsAndUser();
  }, []);

  const getRankStyles = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100/30 border-l-2 border-yellow-400";
      case 1:
        return "bg-gradient-to-r from-slate-50 to-slate-100/30 border-l-2 border-slate-400";
      case 2:
        return "bg-gradient-to-r from-orange-50 to-orange-100/30 border-l-2 border-orange-400";
      default:
        return "";
    }
  };

  const getTopPlayerBadge = (index: number) => {
    switch (index) {
      case 0:
        return "Champion";
      case 1:
        return "Runner-up";
      case 2:
        return "Rising Star";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#ecfdf5]">
      {/* Hero Section */}
      <div className="mx-auto w-100px max-w-5xl bg-[#047857] text-white text-center rounded-xl py-8">
        <div className="relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#047857]/80 to-transparent"></div>
          <div className="relative z-10">
            <div className="mb-3 flex justify-center">
              <div className="p-2 bg-white/10 backdrop-blur-lg rounded-xl">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Environmental Champions</h1>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg">
                  <Loader className="animate-spin h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm text-slate-600 font-medium">Loading...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden border border-slate-200">
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-4">
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-lg">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Hall of Fame</h2>
                      <p className="text-emerald-100 text-xs">
                        Leading the Change
                      </p>
                    </div>
                  </div>
                  <Award className="h-6 w-6" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Champion
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rewards.map((reward, index) => (
                      <tr
                        key={reward.id}
                        className={`${
                          user && user.id === reward.userId
                            ? "bg-indigo-50/70 hover:bg-indigo-100/70"
                            : "hover:bg-slate-50/70"
                        } ${getRankStyles(index)} transition-all duration-300`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <div className="relative">
                                <div className="p-1 bg-white rounded-lg shadow">
                                  <Crown
                                    className={`h-5 w-5 ${
                                      index === 0
                                        ? "text-yellow-400"
                                        : index === 1
                                        ? "text-slate-400"
                                        : "text-orange-400"
                                    }`}
                                  />
                                  <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-lg">
                                <span className="text-sm font-bold text-slate-700">
                                  {index + 1}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 p-1.5 shadow">
                                <User className="h-full w-full text-green-700" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-semibold text-slate-900">
                                {reward.userName}
                              </div>
                              {index < 3 && (
                                <div className="mt-0.5 flex items-center gap-1">
                                  <Medal className="h-3 w-3 text-emerald-500" />
                                  <span className="text-xs font-medium text-emerald-600">
                                    {getTopPlayerBadge(index)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-emerald-100 rounded-lg">
                              <Star className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div className="text-sm font-bold text-slate-900">
                              {reward.points.toLocaleString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="px-3 py-1 inline-flex items-center gap-1 text-xs font-bold rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white shadow">
                              <Shield className="h-3 w-3" />
                              Level {reward.level}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
