"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const steps = [
  "Name Your Hack-a-Thon",
  "",
  "Budget",
  "Travel Type",
  "Key Interests",
  "Travel Companions",
];

export default function TravelForm() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("done");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const ToggleBox = ({
    label,
    isSelected,
    onClick,
  }: {
    label: string;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <button
      className={`p-4 rounded-lg text-center transition-colors ${
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-secondary hover:bg-secondary/80"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <div className="space-y-3 relative">step0</div>;
      case 1:
        return <div>Step 1</div>;
      case 2:
        return <div>step2</div>;
      case 3:
        return <div>step3</div>;
      case 4:
        return <div>step4</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
      <Card className="w-full border-none shadow-none max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-4xl">Create Hack-a-Thon</CardTitle>
          <CardDescription>
            Plan your next adventure step by step
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-6 gap-2">
              {steps.map((step, index) => (
                <div key={step} className="space-y-2">
                  <Progress
                    value={currentStep >= index ? 100 : 0}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            <div className="pt-4 min-h-[300px]">
              <h3 className="text-2xl font-medium mb-4">
                {steps[currentStep]}
              </h3>
              {renderStep()}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 0 ? (
            <Button onClick={handlePrevious}>Previous</Button>
          ) : (
            <div></div>
          )}
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
