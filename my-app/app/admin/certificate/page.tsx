"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Box, Typography, useTheme, Button, TextField } from "@mui/material";
import {
  getPendingCertificateReviews,
  updateCertificateReviewStatus,
} from "@/utils/db/actions";
import { questions } from "@/app/user/certificate/questions/page";

export interface Review {
  id: number;
  userId: number;
  answers: string; // JSON string containing user answers
  status: "pending" | "approved" | "rejected";
  score: number | null;
  adminFeedback: string | null;
}

const Certificate: React.FC = () => {
  const theme = useTheme();
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
    return <Typography color="error" textAlign="center" mt={4}>{error}</Typography>;
  }

  if (reviews.length === 0) {
    return <Typography color="textSecondary" textAlign="center" mt={4}>No pending reviews found.</Typography>;
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        p: 4,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          p: 2,
          borderRadius: "8px",
          mb: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Pending Certificate Reviews
        </Typography>
      </Box>

      {/* Review Cards */}
      {reviews.map((review) => (
        <Box
          key={review.id}
          sx={{
            backgroundColor: "white", // Always white
            color: "black",
            p: 3,
            borderRadius: "8px",
            boxShadow: theme.shadows[1],
            mb: 4,
          }}
        >
          <Typography variant="h6">
            <strong>User ID:</strong> {review.userId}
          </Typography>
          <Typography variant="h6">
            <strong>Status:</strong> {review.status}
          </Typography>
          <Typography variant="h6" mt={2}>
            <strong>Answers:</strong>
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            {Object.entries(parseAnswers(review.answers)).map(([key, answer], index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                <Typography>
                  <strong>{questions.find((q) => `q${q.id}` === key)?.text || key}:</strong> {answer}
                </Typography>
              </li>
            ))}
          </Box>
          <Box display="flex" gap={2} mt={3} flexWrap="wrap" color={"black"}>
            <TextField
              type="number"
              label="Score"
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "black", // Fixed text color
                  backgroundColor: "white", // Fixed background color
                  "& fieldset": {
                    borderColor: "#ccc", // Fixed border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#888", // Fixed hover border color
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#555", // Fixed focus border color
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#666", // Fixed label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#333", // Fixed focused label color
                },
              }}
            />
            <TextField
              label="Admin Feedback"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "black", // Fixed text color
                  backgroundColor: "white", // Fixed background color
                  "& fieldset": {
                    borderColor: "#ccc", // Fixed border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#888", // Fixed hover border color
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#555", // Fixed focus border color
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#666", // Fixed label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#333", // Fixed focused label color
                },
              }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={() =>
                handleAction(
                  review.id,
                  "approved",
                  review.score ?? undefined,
                  review.adminFeedback ?? undefined
                )
              }
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleAction(review.id, "rejected")}
            >
              Reject
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Certificate;
