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
import { Loader2, MoveLeft, MoveRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface JudgeInput {
  name: string;
  email: string;
}

interface TeamInput {
  name: string;
  email: string;
  members: string[];
}

interface FormData {
  hackName: string;
  hackDesc: string;
  start: string;
  end: string;
}

const steps = ["Hack-a-thon Details", "Create Judges", "Add Teams"];

export default function OrganiserForm() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    hackName: "",
    hackDesc: "",
    start: "",
    end: "",
  });
  const [judges, setJudges] = useState<JudgeInput[]>([]);
  const [teams, setTeams] = useState<TeamInput[]>([]);
  const [judgeFile, setJudgeFile] = useState<File | null>(null);
  const [teamFile, setTeamFile] = useState<File | null>(null);
  const router = useRouter();

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Validation
      if (
        !formData.hackName ||
        !formData.hackDesc ||
        !formData.start ||
        !formData.end
      ) {
        toast({
          title: "Missing Information",
          description: "Please fill in all hackathon details",
          variant: "destructive",
        });
        setCurrentStep(0);
        return;
      }

      if (judges.length === 0) {
        toast({
          title: "No Judges",
          description: "Please add at least one judge",
          variant: "destructive",
        });
        setCurrentStep(1);
        return;
      }

      if (teams.length === 0) {
        toast({
          title: "No Teams",
          description: "Please add at least one team",
          variant: "destructive",
        });
        return;
      }

      // Final step, submit the form data
      const data = {
        ...formData,
        judges,
        teams: teams.map((team) => ({
          ...team,
          members: team.members.join(", "),
        })),
      };

      try {
        setLoading(true);
        const response = await fetch("/api/hackathon/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          toast({
            title: "Success",
            description: "Hackathon created successfully!",
          });
          router.push(`/hackathon/${result.hackathon.id}`);
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to create hackathon",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error creating hackathon:", error);
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
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
      setJudgeFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const judgesData: JudgeInput[] = XLSX.utils
            .sheet_to_json(sheet, {
              header: 1,
            })
            .slice(1)
            .map((row: any) => ({
              name: row[0],
              email: row[1],
            }))
            .filter((judge: JudgeInput) => judge.name && judge.email);

          setJudges(judgesData);
          toast({
            title: "Success",
            description: `Imported ${judgesData.length} judges`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to parse judge data",
            variant: "destructive",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setJudgeFile(null);
    }
  };

  const handleTeamFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const teamsData: TeamInput[] = XLSX.utils
            .sheet_to_json(sheet, {
              header: 1,
            })
            .slice(1)
            .map((row: any) => ({
              name: row[0],
              email: row[1],
              members: row[2]
                ? row[2].split(",").map((m: string) => m.trim())
                : [],
            }))
            .filter(
              (team: TeamInput) =>
                team.name && team.email && team.members.length > 0
            );

          setTeams(teamsData);
          toast({
            title: "Success",
            description: `Imported ${teamsData.length} teams`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to parse team data",
            variant: "destructive",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setTeamFile(null);
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
                Name Your Hack-a-thon
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
              <Link
                className="ml-1 underline text-blue-700"
                href="/samples/sample-judges.xlsx"
              >
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
              <Link
                className="ml-1 underline text-blue-700"
                href="/samples/sample-teams.xlsx"
              >
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
          <CardTitle className="text-5xl">Create Hack-a-thon</CardTitle>
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
            <Button onClick={handlePrevious} disabled={loading}>
              <MoveLeft />
            </Button>
          ) : (
            <div></div>
          )}
          <Button onClick={handleNext} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : currentStep === steps.length - 1 ? (
              "Create"
            ) : (
              <MoveRight />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
