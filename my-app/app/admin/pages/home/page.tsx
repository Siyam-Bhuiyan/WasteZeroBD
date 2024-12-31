"use client"
import React, { useEffect, useMemo, useState } from "react";
import Chart from "../../components/chart/page";
import FeaturedInfo from "../../components/featuredInfo/page";
import "./home.css";
import WidgetSm from "../../components/widgetSm/page";
import WidgetLg from "../../components/widgetLg/page";
import { userRequest } from "../../requestMethods";

interface UserStat {
  name: string;
  [key: string]: string | number; // Add index signature
}
const Home: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStat[]>([]);

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("/users/stats");
        const stats = res.data.map((item: { _id: number; total: number }) => ({
          name: MONTHS[item._id - 1],
          "Active User": item.total,
        }));
        setUserStats(stats);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      }
    };
    getStats();
  }, [MONTHS]);

  return (
    <div className="home">
      <FeaturedInfo />
      <Chart
        data={userStats}
        title="User Analytics"
        grid
        dataKey="Active User"
      />
      <div className="homeWidgets">
        <WidgetSm />
        <WidgetLg />
      </div>
    </div>
  );
};

export default Home;

