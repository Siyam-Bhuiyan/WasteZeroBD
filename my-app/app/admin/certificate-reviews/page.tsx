"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  getPendingCertificateReviews,
  updateCertificateReviewStatus,
} from "@/utils/db/actions";
import {questions} from "@/app/certificate/questions/page"
export interface Review {
  id: number;
  userId: number;
  answers: string; // JSON string containing user answers
  status: "pending" | "approved" | "rejected";
  score: number | null;
  adminFeedback: string | null;
}

// Static questions (example)
const questionsMap: { [key: string]: string } = {
  q1: "What is your favorite programming language?",
  q2: "Why do you want to learn programming?",
  q3: "What are your career goals?",
};

const AdminCertificateReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const fetchedReviews = await getPendingCertificateReviews();
      setReviews(
        fetchedReviews.map((review) => ({
          ...review,
          status: (review.status ?? "pending") as "pending" | "approved" | "rejected",
        }))
      );
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews. Please try again later.");
      setError("Failed to load reviews. Please try again later.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const parseAnswers = (answers: string): { [key: string]: string } => {
    try {
      return JSON.parse(answers);
    } catch {
      return {};
    }
  };

  const handleAction = async (
    id: number,
    action: "approved" | "rejected",
    score?: number,
    feedback?: string
  ) => {
    try {
      await updateCertificateReviewStatus(id, action, feedback ?? undefined, score ?? undefined);
      toast.success(`Review ${action} successfully.`);
      await fetchReviews(); // Re-fetch reviews after an update
    } catch (error) {
      console.error(`Error updating review:`, error);
      toast.error("Failed to update review.");
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (reviews.length === 0) {
    return <div>No pending reviews found.</div>;
  }

  return (
    <div>
      <h1>Pending Certificate Reviews</h1>
      {reviews.map((review) => (
        <div key={review.id} className="p-4 border rounded shadow mb-4">
          <p>
            <strong>User ID:</strong> {review.userId}
          </p>
          <p>
            <strong>Status:</strong> {review.status}
          </p>
          <p>
            <strong>Answers:</strong>
          </p>
          <ul>
            {Object.entries(parseAnswers(review.answers)).map(([key, answer], index) => (
              <li key={index} style={{paddingBottom:'10px', fontStyle:'normal'}}>
                <strong style={{fontWeight:'normal', fontFamily:'sans-serif'}}>{questions.find(q => `q${q.id}` === key)?.text || key}:</strong> {answer}
                <p> </p>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 mt-2">
            <input
              type="number"
              placeholder="Score"
              className="border rounded px-2 py-1"
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                setReviews((prev) =>
                  prev.map((r) => (r.id === review.id ? { ...r, score: value } : r))
                );
              }}
            />
            <textarea
              placeholder="Admin Feedback"
              className="border rounded px-2 py-1"
              onChange={(e) => {
                const value = e.target.value;
                setReviews((prev) =>
                  prev.map((r) => (r.id === review.id ? { ...r, adminFeedback: value } : r))
                );
              }}
            ></textarea>
            <button
              onClick={() =>
                handleAction(
                  review.id,
                  "approved",
                  review.score ?? undefined,
                  review.adminFeedback ?? undefined
                )
              }
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => handleAction(review.id, "rejected")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCertificateReviews;
