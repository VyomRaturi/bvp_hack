"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Score = {
  parameter: string; // The name of the parameter, e.g., "innovationCreativity"
  score: number; // The score associated with that parameter
};

type Team = {
  teamId: number; // Unique identifier for the team
  teamName: string; // Name of the team
  scores: Score[]; // Array of scores for the team, each score being an object of type Score
};
export const AllteamScores = [
  {
    teamId: 1,
    teamName: "Alpha",
    scores: [
      { parameter: "innovationCreativity", score: 3 },
      { parameter: "technicalImplementation", score: 4 },
      { parameter: "problemSolutionFit", score: 2 },
      { parameter: "impactScalability", score: 3 },
      { parameter: "userExperience", score: 4 },
      { parameter: "designVisualAppeal", score: 3 },
      { parameter: "presentationCommunication", score: 2 },
      { parameter: "feasibilityPracticality", score: 4 },
      { parameter: "collaborationTeamwork", score: 3 },
      { parameter: "useOfTechnology", score: 4 },
    ],
  },
  {
    teamId: 2,
    teamName: "Beta",
    scores: [
      { parameter: "innovationCreativity", score: 4 },
      { parameter: "technicalImplementation", score: 3 },
      { parameter: "problemSolutionFit", score: 4 },
      { parameter: "impactScalability", score: 2 },
      { parameter: "userExperience", score: 3 },
      { parameter: "designVisualAppeal", score: 4 },
      { parameter: "presentationCommunication", score: 3 },
      { parameter: "feasibilityPracticality", score: 2 },
      { parameter: "collaborationTeamwork", score: 4 },
      { parameter: "useOfTechnology", score: 3 },
    ],
  },
  {
    teamId: 3,
    teamName: "Gamma",
    scores: [
      { parameter: "innovationCreativity", score: 4 },
      { parameter: "technicalImplementation", score: 4 },
      { parameter: "problemSolutionFit", score: 3 },
      { parameter: "impactScalability", score: 4 },
      { parameter: "userExperience", score: 4 },
      { parameter: "designVisualAppeal", score: 4 },
      { parameter: "presentationCommunication", score: 4 },
      { parameter: "feasibilityPracticality", score: 3 },
      { parameter: "collaborationTeamwork", score: 4 },
      { parameter: "useOfTechnology", score: 4 },
    ],
  },
];

// Function to calculate average scores for each team
function calculateTeamAverageScores(teams: Team[]): number[] {
  return teams.map((team) => {
    const totalScore = team.scores.reduce(
      (acc, scoreObj) => acc + scoreObj.score,
      0
    );
    return totalScore / team.scores.length;
  });
}

// Utility functions to calculate mean, mode, and median
function calculateMean(values: number[]): number {
  const total = values.reduce((acc, val) => acc + val, 0);
  return total / values.length;
}

function calculateMode(values: number[]): number[] {
  const frequency: Record<number, number> = {};
  let maxFreq = 0;
  let modes: number[] = [];

  values.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value];
    }
  });

  for (const key in frequency) {
    if (frequency[key] === maxFreq) {
      modes.push(Number(key));
    }
  }

  return modes;
}

function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2; // Average of the two middle values
  } else {
    return sorted[mid]; // Middle value
  }
}

// Calculate average scores for each team
const averageScores = calculateTeamAverageScores(AllteamScores);

// Calculate mean, mode, and median
const mean = calculateMean(averageScores);
const mode = calculateMode(averageScores);
const median = calculateMedian(averageScores);

// Prepare chart data with calculated statistics
const chartData = [
  { parameter: "Mean", value: mean, fill: "var(--color-Mean)" },
  {
    parameter: "Mode",
    value: mode.length > 0 ? mode[0] : 0,
    fill: "var(--color-Mode)",
  }, // Display the first mode if it exists
  { parameter: "Median", value: median, fill: "var(--color-Median)" },
  {
    parameter: "YourTeamAverage",
    value: averageScores[0],
    fill: "var(--color-YourTeamAverage)",
  }, // Assuming the first team is "Your Team"
];

// Chart configuration
const chartConfig = {
  values: {
    label: "Scores",
  },
  Mean: {
    label: "Mean Score",
    color: "#625CF9",
  },
  Mode: {
    label: "Mode Score",
    color: "#625CF966",
  },
  Median: {
    label: "Median Score",
    color: "#625CF999",
  },
  YourTeamAverage: {
    label: "Your Team Score",
    color: "#625CF9CC",
  },
} satisfies ChartConfig;

export function ComparisonWinning() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Statistics</CardTitle>
        <CardDescription>
          Mean, Mode, Median, and Your Team Score
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-muted">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="parameter"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
              className=""
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="value"
              layout="vertical"
              fill="var(--color-Team)"
              radius={5}
              barSize={50}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
