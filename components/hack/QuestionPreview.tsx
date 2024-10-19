// src/components/QuestionsPreview.tsx

"use client";

import React, { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton"; // Import ShadCN Skeleton

interface AnswerOption {
  answer: string;
  score: number;
}

export interface Question {
  index: number;
  question: string;
  parameter: string;
  answers: AnswerOption[];
}

interface QuestionsPreviewProps {
  questionsArray?: Question[];
  teamId?: string;
  onEvaluationSubmit: () => void;
}

const QuestionsPreview: React.FC<QuestionsPreviewProps> = ({
  questionsArray,
  teamId,
  onEvaluationSubmit,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionIndex: number]: AnswerOption;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!teamId && !questionsArray) {
    throw new Error("teamId or questionsArray prop is required.");
  }

  if (questionsArray) {
    useEffect(() => {
      setQuestions(questionsArray);
      setLoading(false);
    }, [questionsArray]);
  } else {
    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const res = await fetch(`/api/team/${teamId}/questions`);
          if (!res.ok) throw new Error("Failed to fetch questions.");
          const data = await res.json();
          setQuestions(data.questions);
        } catch (error: any) {
          console.error("Error fetching questions:", error);
          toast({
            title:
              error.message || "An error occurred while fetching questions.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    }, [teamId]);
  }

  const handleOptionChange = (questionIndex: number, option: AnswerOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(selectedAnswers).length !== questions.length) {
      toast({
        title: "Please answer all questions.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        teamId,
        answers: questions.map((q) => ({
          questionIndex: q.index,
          selectedOption: selectedAnswers[q.index],
        })),
      };

      const res = await fetch("/api/evaluation/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Submission failed.");
      }

      toast({
        title: data.message,
      });
      onEvaluationSubmit();
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast({
        title: error.message || "Failed to submit evaluation.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Evaluate Team</h2>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="mb-6">
              <div>
                <Skeleton className="h-6 w-3/4 mb-2" />{" "}
                {/* Question Skeleton */}
                <Skeleton className="h-4 w-1/6 mb-4" />{" "}
                {/* Parameter Skeleton */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-md" />
                {/* Answer Option 1 */}
                <Skeleton className="h-10 w-full rounded-md" />
                {/* Answer Option 2 */}
                <Skeleton className="h-10 w-full rounded-md" />
                {/* Answer Option 3 */}
                <Skeleton className="h-10 w-full rounded-md" />
                {/* Answer Option 4 */}
              </div>
            </div>
          ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return <p>No questions available for this team.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Evaluate Team</h2>
      <form onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.index} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">{`${q.index}. ${q.question}`}</h3>
              <span className="text-sm text-gray-500 italic">
                {q.parameter}
              </span>
            </div>
            <div className="space-y-2">
              {q.answers.map((option, idx) => (
                <label
                  key={idx}
                  className={`flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-200 cursor-pointer ${
                    selectedAnswers[q.index]?.answer === option.answer
                      ? "bg-blue-100 border-blue-300"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.index}`}
                    value={option.answer}
                    className="form-radio h-5 w-5 text-blue-600"
                    onChange={() => handleOptionChange(q.index, option)}
                    required
                  />
                  <span className="ml-3 text-gray-700">{option.answer}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {questionsArray ? null : (
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Evaluation"}
          </button>
        )}
      </form>
    </div>
  );
};

export default QuestionsPreview;
