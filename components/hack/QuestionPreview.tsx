// src/components/QuestionsPreview.tsx

"use client";

import React, { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";

interface AnswerOption {
    answer: string;
    score: number;
}

interface Question {
    index: number;
    question: string;
    parameter: string;
    answers: AnswerOption[];
}

interface QuestionsPreviewProps {
    teamId: string;
    onEvaluationSubmit: () => void;
  }
  
  const QuestionsPreview: React.FC<QuestionsPreviewProps> = ({ teamId, onEvaluationSubmit }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [questionIndex: number]: AnswerOption;
    }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);

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
                    title: error.message || "An error occurred while fetching questions.",
                    variant: "destructive"
                })
                // toast.error();
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [teamId]);

    const handleOptionChange = (questionIndex: number, option: AnswerOption) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: option,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if all questions are answered
        if (Object.keys(selectedAnswers).length !== questions.length) {
            toast({
                title: "Please answer all questions.",
                variant: "destructive"
            })
            //   toast.error("Please answer all questions.");
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
                title: data.message
            })
            onEvaluationSubmit();
            //   toast.success(data.message);
            // Optionally, redirect or update UI
            // For example, reload the teams sidebar to update status
            // This would require lifting state or using a state management solution
        } catch (error: any) {
            console.error("Submission Error:", error);
            toast({
                title: error.message || "Failed to submit evaluation.",
                variant: "destructive"
            })
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading questions...</p>;
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
                            <span className="text-sm text-gray-500 italic">{q.parameter}</span>
                        </div>
                        <div className="space-y-2">
                            {q.answers.map((option, idx) => (
                                <label
                                    key={idx}
                                    className={`flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-200 cursor-pointer ${selectedAnswers[q.index]?.answer === option.answer
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

                <button
                    type="submit"
                    className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ${submitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Submit Evaluation"}
                </button>
            </form>
        </div>
    );
};

export default QuestionsPreview;
