"use client";
import "./x.css"
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import stripe from "@/assets/stripe.png"
import sslcommerz from "@/assets/sslcommerz.png"
const CertificateStatus: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const userId = parseInt(localStorage.getItem("userId") || "0", 10);
        if (!userId) {
          setError("User information is missing. Please log in.");
          return;
        }

        const response = await fetch("/user/api/certificates/approval-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to check approval status.");
        }

        const result = await response.json();
        setApproved(result.approved);

        if (!result.approved) {
          setPaymentStatus(false);
        }
      } catch (error) {
        setError("Failed to fetch approval status. Please try again later.");
      }
    };

    checkApprovalStatus();
  }, []);

  useEffect(() => {
    if (approved) {
      const success = searchParams.get("success");
      if (success === "true") {
        setPaymentStatus(true);
      }
    }
  }, [searchParams, approved]);

  const handleStripe = async () => {
    if (!approved) {
      alert("Your certificate has not been approved by the admin yet.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/user/api/stripe-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, userName, amount: 500, type: "certificate" }),
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
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSslCommerz = async () => {
    if (!approved) {
      alert("Your certificate has not been approved by the admin yet.");
      return;
    }

    setLoading(true);

    try {
      if (!userEmail || !userName) {
        alert("User information is missing. Please log in.");
        return;
      }

      const result: AxiosResponse<{ success: boolean; url: string }> = await axios.post(
        "/user/api/sslcommerz-intent/sslcommerz/create-payment",
        {
          amount: 500,
          userEmail,
          userName,
          type: "certificate",
        }
      );

      if (result.data.success && result.data.url) {
        window.location.href = result.data.url;
      } else {
        toast.error("Something went wrong during the payment initiation.");
      }
    } catch (error: any) {
      console.error("Error during payment:", error);
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = () => {
    router.push("/user/Badge");
  };

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="reload-button">
          Reload
        </button>
      </div>
    );
  }

  return (
    <div className="certificate-status-container">
      <h1>Certificate Status</h1>
      {!approved ? (
        <p>Your answers are under review. Please wait for admin approval.</p>
      ) : paymentStatus ? (
        <div>
          <p>Payment completed successfully!</p>
          <button onClick={handleGenerateCertificate} className="generate-button" style={generateButtonStyle}>
            Generate Certificate
          </button>
        </div>
      ) : (
        <div>
          <p>Please complete the payment to generate your certificate.</p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="pay-button"
            disabled={loading}
            style={{
              backgroundColor: loading ? "red" : "green",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "10px 20px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal">
          <div className="modal-content">
            <h2>Select Payment Method</h2>
            <div className="payment-options">
              <button onClick={handleStripe} className="payment-option">
                <Image src={stripe} alt="Stripe" width={100} height={50} />
                <p>Pay with Stripe</p>
              </button>
              <button onClick={handleSslCommerz} className="payment-option">
                <Image src={sslcommerz} alt="SSLCommerz" width={100} height={50} />
                <p>Pay with SSLCommerz</p>
              </button>
            </div>
            <button onClick={() => setShowPaymentModal(false)} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

const generateButtonStyle = {
  backgroundColor: "#4caf50",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "16px",
};

export default CertificateStatus;
