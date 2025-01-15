"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import { getUserStatistics } from "@/utils/db/actions";

export default function CertificatePage() {
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    reportedWastes: 0,
    collectedWastes: 0,
  });
  const [certificateType, setCertificateType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const stats = await getUserStatistics(); // Mock function from actions
      setUserStats(stats);

      // Determine Certificate Type
      if (
        stats.totalPoints > 200 &&
        stats.reportedWastes > 100 &&
        stats.collectedWastes > 60
      ) {
        setCertificateType("Gold");
      } else if (
        stats.totalPoints >= 100 &&
        stats.reportedWastes >= 50 &&
        stats.collectedWastes >= 30
      ) {
        setCertificateType("Silver");
      } else {
        setCertificateType("Bronze");
      }
    };

    fetchData();
  }, []);

  const downloadCertificate = () => {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.text("WasteZero Bangladesh", 105, 30, { align: "center" });
    doc.setFontSize(18);
    doc.text(`Certificate of Achievement`, 105, 50, { align: "center" });
    doc.setFontSize(14);
    doc.text(
      `Awarded to ${userStats.name || "Anonymous User"}`,
      105,
      70,
      { align: "center" }
    );
    doc.text(
      `For exceptional efforts in waste management:`,
      105,
      90,
      { align: "center" }
    );
    doc.text(`Total Points: ${userStats.totalPoints}`, 105, 110, {
      align: "center",
    });
    doc.text(`Wastes Reported: ${userStats.reportedWastes}`, 105, 130, {
      align: "center",
    });
    doc.text(`Wastes Collected: ${userStats.collectedWastes}`, 105, 150, {
      align: "center",
    });
    doc.setFontSize(16);
    doc.text(`Certificate Type: ${certificateType}`, 105, 180, {
      align: "center",
    });

    doc.save("WasteZero_Certificate.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-green-700">
              Certificate of Achievement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">
                Congratulations, {userStats.name || "User"}!
              </h2>
              <p className="text-lg text-gray-600">
                You have earned the <span className="font-bold">{certificateType}</span>{" "}
                certificate for your efforts in waste management.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-lg font-bold text-green-600">Total Points</p>
                <p className="text-2xl">{userStats.totalPoints}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-lg font-bold text-blue-600">Wastes Reported</p>
                <p className="text-2xl">{userStats.reportedWastes}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <p className="text-lg font-bold text-yellow-600">Wastes Collected</p>
                <p className="text-2xl">{userStats.collectedWastes}</p>
              </div>
            </div>
            <Button
              onClick={downloadCertificate}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg"
            >
              Download Your Certificate
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
