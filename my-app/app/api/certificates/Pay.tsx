import React, { useEffect, useState } from "react";
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm/CheckoutForm";

const stripePromise = loadStripe("pk_test_51PMqS2GhvT5slJMQ88OIGK4hnLOJQ3MtXOgVFd5y75wzA63FMoy5cIre7yNblPkaURi5cm7fm0mSr3TJAwSezxlJ00JA67URdL");

const Pay: React.FC = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handlePaymentSuccess = () => {
    alert("Payment successful! Your certificate will be generated.");
    // You can add logic to trigger certificate generation or redirect here
  };

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("Error creating payment intent:", err);
        setError("Failed to initialize payment. Please try again.");
      }
    };

    createPaymentIntent();
  }, []);

  const appearance = { theme: "stripe" } as const;
  const options = { clientSecret, appearance };

  return (
    <div className="pay">
      {error && <div className="error">{error}</div>}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
        </Elements>
      )}
    </div>
  );
};

export default Pay;
