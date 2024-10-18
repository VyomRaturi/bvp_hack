"use client"; // Enables client-side rendering

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button } from "./ui/button";
import {
  addQuestionsToHackathon,
  getQuestionsFromParameters,
  QuestionInput,
} from "@/lib/actions/addQuestions";
import { Loader2 } from "lucide-react";
import QuestionsPreview, { Question } from "./hack/QuestionPreview";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

type ParameterSelectorProps = {
  defaultParameters: string[];
  hackId: string;
};

const ParameterSelector: React.FC<ParameterSelectorProps> = ({
  defaultParameters,
  hackId,
}) => {
  const [loading, setLoading] = useState(false);
  const [defaultParams, setDefaultParams] =
    useState<string[]>(defaultParameters);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(""); // State to handle input value
  const [showQuestions, setShowQuestions] = useState<boolean>(false);
  const [questionsArray, setQuestionsArray] = useState<Question[]>([]);
  const [remarks, setRemarks] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Function to handle parameter selection
  const handleSelectParameter = (param: string) => {
    setDefaultParams((prev) => prev.filter((p) => p !== param));
    setSelectedParams((prev) => [...prev, param]);
  };

  // Function to handle removal of selected parameter
  const handleRemoveSelectedParameter = (param: string) => {
    if (!defaultParameters.includes(param)) {
      setSelectedParams((prev) => prev.filter((p) => p !== param));
    } else {
      setDefaultParams((prev) => [...prev, param]);
      setSelectedParams((prev) => prev.filter((p) => p !== param));
    }
  };

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  // Function to handle adding a new parameter on Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const newParam = inputValue.trim();
      if (!selectedParams.includes(newParam)) {
        setSelectedParams((prev) => [...prev, newParam]);
      }
      setInputValue(""); // Clear input after adding
      e.preventDefault(); // Prevent new line in textarea
    }
  };

  const submitParameters = async () => {
    console.log(selectedParams);
    try {
      setLoading(true);
      const content = await getQuestionsFromParameters(selectedParams);
      console.log(content);
      // add an index field to each question object and rename ans to answers
      const indexedContent = content.map((q, index) => ({
        ...q,
        index: index + 1,
        answers: q.ans,
      }));
      setQuestionsArray(indexedContent as Question[]);
      setShowQuestions(true);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting parameters:", error);
      setLoading(false);
    }
  };

  const fetchWithRemarks = async () => {
    console.log("fetching with remarks");
    try {
      setLoading(true);
      const content = await getQuestionsFromParameters(selectedParams, remarks);
      console.log(content);
      // add an index field to each question object and rename ans to answers
      const indexedContent = content.map((q, index) => ({
        ...q,
        index: index + 1,
        answers: q.ans,
      }));
      setQuestionsArray(indexedContent as Question[]);
      setShowQuestions(true);
      setLoading(false);
    } catch (error) {
      console.error("Error submitting parameters:", error);
      setLoading(false);
    }
  };

  const saveQuestions = async () => {
    console.log("Saving questions");

    // from questionsArray to QuestionInput[]
    const ansContent: QuestionInput[] = questionsArray.map((q) => ({
      question: q.question,
      parameter: q.parameter,
      ans: q.answers,
    }));
    try {
      setLoading(true);
      const questions = await addQuestionsToHackathon({
        hackathonId: hackId,
        questions: ansContent,
      });
      console.log(questions);
      setLoading(false);
    } catch (error) {
      console.error("Error saving questions:", error);
      setLoading(false);
    }
  };

  if (showQuestions) {
    return (
      <div className="p-4">
        <QuestionsPreview
          questionsArray={questionsArray}
          onEvaluationSubmit={() => {}}
        />
        <div className="my-4 w-full flex justify-between">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={loading} variant="outline">
                <Loader2
                  size={16}
                  className={loading ? "animate-spin" : "hidden"}
                />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Enter any remarks here which you would like to add to the
                  questions.
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col">
                  <Textarea
                    id="remark"
                    className="col-span-3"
                    placeholder="Remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    fetchWithRemarks();
                    setOpen(false);
                  }}
                >
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button disabled={loading} onClick={() => saveQuestions()}>
            <Loader2
              size={16}
              className={loading ? "animate-spin" : "hidden"}
            />
            Save
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold">Suggested Parameters</h2>
        <div className="flex flex-wrap mb-4">
          {defaultParams.map((param) => (
            <div
              key={param}
              className="flex items-center border border-yellow-300 relative rounded-full px-3 py-1 mr-2 mb-2 cursor-pointer"
              onClick={() => handleSelectParameter(param)}
            >
              <span>
                {param}
                <span className="text-red-500 top-0 absolute">
                  <FaStar size={10} color="gold" />
                </span>
              </span>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-semibold">Selected Parameters</h2>
        <div className="">
          <div className="flex flex-wrap mb-2">
            {selectedParams.map((param) => (
              <div
                key={param}
                className={
                  !defaultParameters.includes(param)
                    ? "flex items-center relative border border-gray-300 rounded-full px-3 py-1 mr-2 mb-2 cursor-pointer"
                    : "flex items-center border border-yellow-300 relative rounded-full px-3 py-1 mr-2 mb-2 cursor-pointer"
                }
                onClick={() => handleRemoveSelectedParameter(param)}
              >
                <span>
                  {param}
                  {defaultParameters.includes(param) && (
                    <span className="text-red-500 top-0 absolute">
                      <FaStar color="gold" />
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full h-24 border-none focus:outline-none focus:border-transparent focus:ring-0"
            placeholder="Type here and press Enter to add a new parameter..."
            rows={4}
          />

          <Button disabled={loading} onClick={() => submitParameters()}>
            <Loader2
              size={16}
              className={loading ? "animate-spin" : "hidden"}
            />
            Submit Parameters
          </Button>
        </div>
      </div>
    );
  }
};

export default ParameterSelector;
