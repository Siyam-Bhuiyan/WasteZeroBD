"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
export interface Question {
  id: number;
  text: string;
}

export const questions: Question[] = [
  { id: 1, text: "What are the primary causes of climate change and how can we mitigate them?" },
  { id: 2, text: "Explain the importance of biodiversity and ecosystems for maintaining environmental balance." },
  { id: 3, text: "Discuss the impact of plastic pollution on marine life and suggest some ways to reduce it." },
  { id: 4, text: "What is renewable energy and why is it considered important for sustainable development?" },
  { id: 5, text: "How does deforestation affect carbon dioxide levels in the atmosphere?" }
];
const CertificateQuestions: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const email = localStorage.getItem("userEmail"); // Retrieve email
    if (!email) {
      alert("User email not found. Please log in.");
      return;
    }

    try {
      const response = await fetch("/api/certificates/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, email }), // Use the answers state
      });

      if (!response.ok) {
        throw new Error(`Failed to submit answers: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Submission successful:", result);
      alert("Your answers have been submitted for review.");
      router.push("/certificate/status");
    } catch (error) {
      console.error("Error submitting answers:", error);
      alert("Failed to submit answers. Please try again.");
    }
  };

  return (
    <div className="certificate-container">
      <h2>Certificate Questions</h2>
      <p>Please answer the questions. Marks will be reviewed by the admin.</p>

      {error && <p className="error-message">{error}</p>}

      {questions.map((question) => (
        <div className="form-question" key={question.id}>
          <label htmlFor={`q${question.id}`}>Question {question.id}: {question.text}</label>
          <textarea id={`q${question.id}`} name={`q${question.id}`} onChange={handleChange}></textarea>
        </div>
      ))}
      
      <button
        onClick={handleSubmit}
        className="generate-button"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Answers"}
      </button>
    </div>
  );
};

export default CertificateQuestions;
