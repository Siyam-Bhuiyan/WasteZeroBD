import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import newRequest from "@/utils/newRequest";
import "./CheckoutForm.scss";

interface CheckoutFormProps {
  onPaymentSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe has not been properly initialized.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card details are required.");
      setLoading(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET!,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        setError(error.message || "Payment failed. Please try again.");
      } else if (paymentIntent?.status === "succeeded") {
        console.log("Payment successful:", paymentIntent);

        // Notify the backend to confirm the payment
        await newRequest.post(`/orders/confirm`);
        onPaymentSuccess();
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <CardElement className="StripeElement" />
      {error && <p className="error-message">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="submit-button"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
