"use client"; // Enables client-side rendering

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Button } from "./ui/button";

type ParameterSelectorProps = {
  defaultParameters: string[];
};

const ParameterSelector: React.FC<ParameterSelectorProps> = ({
  defaultParameters,
}) => {
  const [defaultParams, setDefaultParams] =
    useState<string[]>(defaultParameters);
  const [selectedParams, setSelectedParams] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(""); // State to handle input value

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

  const submitParameters = () => {
    console.log(selectedParams);
  };

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

        <Button onClick={submitParameters}>Submit Parameters</Button>
      </div>
    </div>
  );
};

export default ParameterSelector;
