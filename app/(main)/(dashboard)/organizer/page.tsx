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
import { MoveLeft, MoveRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import * as XLSX from "xlsx"; // Import xlsx library

interface JudgeInput {
  name: string;
  email: string;
}

interface TeamInput {
  name: string;
  email: string; // New email field for TeamInput
  members: string[];
}

const steps = ["Hack-a-thon Details", "Create Judges", "Add Teams"];

export default function OrganiserForm() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    hackName: "",
    hackDesc: "",
    start: "",
    end: "",
  });
  const [judges, setJudges] = useState<JudgeInput[]>([]);
  const [teams, setTeams] = useState<TeamInput[]>([]);
  const [judgeFile, setJudgeFile] = useState<File | null>(null); // State for uploaded judge file
  const [teamFile, setTeamFile] = useState<File | null>(null); // State for uploaded team file

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final step, submit the form data
      const data = {
        ...formData,
        judges,
        teams: teams.map((team) => ({
          ...team,
          members: team.members.join(", "), // Convert members array to comma-separated string
        })),
      };

      try {
        const response = await fetch("/api/hackathon/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Hackathon created successfully:", result);
        } else {
          console.error("Failed to create hackathon:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating hackathon:", error);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleJudgeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJudgeFile(file); // Store the judge file in the state
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const judgesData: JudgeInput[] = parsedData
          .slice(1) // Skip the header row
          .map((row: any) => ({
            name: row[0],
            email: row[1],
          }));

        setJudges(judgesData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setJudgeFile(null); // Reset judge file state if no file is selected
    }
  };

  const handleTeamFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamFile(file); // Store the team file in the state
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const teamsData: TeamInput[] = parsedData
          .slice(1) // Skip the header row
          .map((row: any) => ({
            name: row[0],
            email: row[1], // Capture email from the file
            members: row[2] ? row[2].split(",") : [],
          }));

        setTeams(teamsData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setTeamFile(null); // Reset team file state if no file is selected
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="h-full space-y-4">
            <div>
              <Label className="font-medium" htmlFor="hackName">
                Name Your Hack-a-Thon
              </Label>
              <Input
                id="hackName"
                className="text-2xl my-1"
                type="text"
                value={formData.hackName}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label className="font-medium" htmlFor="hackDesc">
                Description
              </Label>
              <Textarea
                id="hackDesc"
                className="my-1"
                value={formData.hackDesc}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <div className="flex space-x-4">
                <div className="w-full">
                  <Label htmlFor="start">Start Date</Label>
                  <Input
                    id="start"
                    type="date"
                    value={formData.start}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="end">End Date</Label>
                  <Input
                    id="end"
                    type="date"
                    value={formData.end}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div>
              Upload the CSV with details of judges.
              <Link className="ml-1 underline text-blue-700" href="#">
                Download the sample excel from here
              </Link>
              <Input
                className="my-3"
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleJudgeFileUpload}
              />
              {judgeFile && (
                <p className="text-green-600">
                  File "{judgeFile.name}" uploaded successfully.
                </p>
              )}
            </div>

            <div className="mt-4">
              <h3>Uploaded Judges Data:</h3>
              <ul>
                {judges.map((judge, index) => (
                  <li key={index}>
                    {index + 1}. {judge.name} - {judge.email}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div>
              Upload the CSV with details of teams.
              <Link className="ml-1 underline text-blue-700" href="#">
                Download the sample excel from here
              </Link>
              <Input
                className="my-3"
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleTeamFileUpload}
              />
              {teamFile && (
                <p className="text-green-600">
                  File "{teamFile.name}" uploaded successfully.
                </p>
              )}
            </div>

            <div className="mt-4">
              <h3>Uploaded Teams Data:</h3>
              <ul>
                {teams.map((team, index) => (
                  <li key={index}>
                    {index + 1}. {team.name} - Email: {team.email} - Members:{" "}
                    {team.members.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
      <Card className="w-full border-none shadow-none max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-5xl">Create Hack-a-Thon</CardTitle>
          <CardDescription>
            Plan your next adventure step by step
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              {steps.map((step, index) => (
                <div key={step} className="space-y-2">
                  <Progress
                    value={currentStep >= index ? 100 : 0}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            <div className="pt-4 min-h-[350px]">
              <h3 className="text-2xl font-medium mb-4">
                {steps[currentStep]}
              </h3>
              {renderStep()}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 0 ? (
            <Button onClick={handlePrevious}>
              <MoveLeft />
            </Button>
          ) : (
            <div></div>
          )}
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Create" : <MoveRight />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
