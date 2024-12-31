"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import jsPDF from "jspdf";
const CertificateStatus: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const userEmail= localStorage.getItem('userEmail')
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const userId = parseInt(localStorage.getItem("userId") || "0", 10);
        if (!userId) {
          setError("User information is missing. Please log in.");
          return;
        }

        const response = await fetch("/api/certificates/approval-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to check approval status.");
        }

        const result = await response.json();
        console.log("Approval status response:", result); // Log the response
        setApproved(result.approved);
        if (!result.approved) {
          setPaymentStatus(false); // Ensure payment is blocked if not approved
        }
      } catch (error) {
        console.error("Error checking approval status:", error);
        setError("Failed to fetch approval status. Please try again later.");
      }
    };

    checkApprovalStatus();
  }, []);

  useEffect(() => {
    // Only set payment status after ensuring approval
    if (approved) {
      const success = searchParams.get("success");
      if (success === "true") {
        setPaymentStatus(true);
      }
    }
  }, [searchParams, approved]);

  const handlePayment = async () => {
    if (!approved) {
      alert("Your certificate has not been approved by the admin yet.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to create payment session");
      }

      const { sessionId } = await response.json();

      const stripe = await loadStripe("pk_test_51PMqS2GhvT5slJMQ88OIGK4hnLOJQ3MtXOgVFd5y75wzA63FMoy5cIre7yNblPkaURi5cm7fm0mSr3TJAwSezxlJ00JA67URdL");
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = () => {
    const userName = "John Doe"; // Replace with dynamic user data if available
    const courseName = "Advanced React Development"; // Replace with dynamic course data if available
    const date = new Date().toLocaleDateString();

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Certificate of Completion", 105, 40, { align: "center" });

    doc.setFontSize(16);
    doc.text(`This certifies that ${userEmail}'s business`, 105, 70, { align: "center" });
    doc.text(`has successfully proved their eco-friendly impact`, 105, 85, { align: "center" });
    doc.text(`on ${date}.`, 105, 100, { align: "center" });

    doc.setFontSize(12);
    doc.text("Congratulations on your achievement!", 105, 140, { align: "center" });

    // Signature
    doc.setFontSize(10);
    doc.text("Authorized Signature", 105, 170, { align: "center" });
    doc.line(75, 175, 135, 175); // Signature line

    doc.save("Certificate.pdf");
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="certificate-status-container">
      <h1>Certificate Status</h1>
      {!approved ? (
        <p>Your answers are under review. Please wait for admin approval.</p>
      ) : paymentStatus ? (
        <div>
          <p>Payment completed successfully!</p>
          <button
            onClick={handleGenerateCertificate}
            className="generate-button"
          >
            Generate Certificate
          </button>
        </div>
      ) : (
        <div>
          <p>Please complete the payment to generate your certificate.</p>
          <button
            onClick={handlePayment}
            className="pay-button"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificateStatus;
