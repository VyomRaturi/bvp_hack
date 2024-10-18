// src/components/QuestionsPreview.tsx

"use client";

import React, { useState } from "react";
// import { QuestionInput, AnswerOption } from "@/types/question";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Answer, QuestionInput } from "@/lib/actions/addQuestions";

interface QuestionsPreviewProps {
    questions: QuestionInput[];
}

const QuestionsPreview: React.FC<QuestionsPreviewProps> = ({ questions }) => {
    // State to track selected answers
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [questionIndex: number]: Answer;
    }>({});

    // Handler for selecting an answer
    const handleOptionChange = (questionIndex: number, option: Answer) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: option,
        }));
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Evaluation Preview</h1>
            <form>
                {questions.map((q, index) => (
                    <div key={index} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold text-gray-700">
                                {index + 1}. {q.question}
                            </h2>
                            <span className="text-sm text-gray-500 italic">{q.parameter}</span>
                        </div>
                        <div className="space-y-2">
                            {q.ans.map((option, idx) => (
                                <Label
                                    key={idx}
                                    className={`flex items-center p-2 border border-gray-200 rounded-md hover:bg-gray-50 transition duration-200 cursor-pointer ${selectedAnswers[index]?.answer === option.answer
                                            ? "bg-blue-100 border-blue-300"
                                            : ""
                                        }`}
                                >
                                    <Input
                                        type="radio"
                                        name={`question-${index}`} // Unique name per question based on index
                                        value={option.answer}
                                        className="form-radio h-5 w-5 text-blue-600"
                                        onChange={() => handleOptionChange(index, option)}
                                    />
                                    <span className="ml-3 text-gray-700">{option.answer}</span>
                                </Label>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Since submission is not required, the submit button is omitted */}
            </form>
        </div>
    );
};

export default QuestionsPreview;
