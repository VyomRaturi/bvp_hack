"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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

import { PopulatedEvaluation } from "@/models/Evaluation"; // Import your data type

// Sample PopulatedEvaluation array to replace with actual data from props or API

const colorPalette = [
  "#001f3f", // Dark Navy Blue
  "#003366", // Dark Blue
  "#004080", // Blue
  "#0059b3", // Medium Blue
  "#0073e6", // Sky Blue
  "#3399ff", // Light Blue
  "#66b3ff", // Lighter Blue
  "#99ccff", // Pale Blue
  "#000000", // Black
  "#1a1a1a", // Dark Gray
  "#333333", // Medium Dark Gray
  "#4d4d4d"  // Gray
];
const chartConfig = {
  score: {
    label: "Total Score",
  },
} satisfies ChartConfig;

export function PieChartComp({evaluations} : {evaluations : PopulatedEvaluation[]}) {
  // Calculate the total score for each parameter
  const chartData = useMemo(() => {
    const parameterScores: Record<string, number> = {};

    evaluations.forEach(({ parameter, score }) => {
      if (!parameterScores[parameter]) {
        parameterScores[parameter] = 0;
      }
      parameterScores[parameter] += score;
    });

    // Convert the parameterScores object to an array for the chart
    return Object.keys(parameterScores).map((param,index) => ({
      parameter: param,
      totalScore: parameterScores[param],
      fill: colorPalette[index % colorPalette.length],
    }));
  }, [evaluations]);

  return (
    <Card className="flex border-l-0 rounded-none border-t-0 border-b-0  flex-col w-[26vw]">
      <CardHeader className=" pb-0">
        <CardTitle>Pie Chart - Parameter Scores</CardTitle>
        {/* <CardDescription>Overview of all parameters</CardDescription> */}
      </CardHeader>
      <CardContent className="flex-1 mt-6 ">
        <ChartContainer
          config={chartConfig}
          className="aspect-square -ml-5 max-h-[40vh]  [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="totalScore"
              className=""
              label={(entry) => `${entry.parameter}`}
              nameKey="parameter"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
