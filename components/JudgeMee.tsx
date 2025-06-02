"use client";

import { useState, useMemo } from "react";
// import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    //   CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { PopulatedEvaluation } from "@/models/Evaluation";
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
    "#4d4d4d", // Gray
  ];


// Statistical helper functions
const calculateMean = (scores: number[]) =>
    scores.reduce((acc, score) => acc + score, 0) / scores.length;

const calculateMode = (scores: number[]) => {
    const freq: Record<number, number> = {};
    let mode = scores[0];
    let maxCount = 1;

    scores.forEach((score) => {
        freq[score] = (freq[score] || 0) + 1;
        if (freq[score] > maxCount) {
            maxCount = freq[score];
            mode = score;
        }
    });

    return mode;
};

const calculateMedian = (scores: number[]) => {
    const sorted = [...scores].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
};

// UI Component
export function FinalResultChart({ evaluations }: { evaluations: PopulatedEvaluation[] }) {
    const [filter, setFilter] = useState<"mean" | "mode" | "median">("mean");

    // Memoize the calculation of statistics
    const chartData = useMemo(() => {
        const judgeScores: Record<string, number[]> = {};

        evaluations.forEach((evale) => {
            if (!judgeScores[evale.judge.name]) {
                judgeScores[evale.judge.name] = [];
            }
            judgeScores[evale.judge.name].push(evale.score);
        });

        const overallScores: number[] = Object.values(judgeScores).flat();

        const computeStat = (scores: number[]) => {
            if (filter === "mean") return calculateMean(scores);
            if (filter === "mode") return calculateMode(scores);
            return calculateMedian(scores);
        };

        const chartData = Object.keys(judgeScores).map((judgeName, index) => ({
            judge: judgeName,
            score: computeStat(judgeScores[judgeName]),
            fill: colorPalette[index % colorPalette.length],
        }));

        chartData.push({
            judge: "Overall",
            score: computeStat(overallScores),
            fill: colorPalette[chartData.length % colorPalette.length],
        });

        return chartData;
    }, [filter]);


      
      // Updated chartConfig to use colorPalette
      const chartConfig = {
        score: {
          label: "Score",
          color: colorPalette[0], // Use the first color from the palette for now
        },
      } satisfies ChartConfig;

    return (
        <Card className="rounded-none">
            <CardHeader className="flex justify-between flex-row items-center">
                <CardTitle>Judgewise Analytics</CardTitle>
                {/* <CardDescription>Business Plan - January 2024</CardDescription> */}


                <div className="w-48">
                    <Select onValueChange={(value: "mean" | "mode" | "median") => setFilter(value)} defaultValue="mean">
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mean">Mean</SelectItem>
                            <SelectItem value="median">Median</SelectItem>
                            <SelectItem value="mode">Mode</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[20vh] w-full">
                    <BarChart
                        className=""
                        data={chartData}
                        layout="vertical"
                        // margin={{ left: -10 }}
                        barSize={20}
                    >
                        <XAxis type="number" dataKey="score" hide />
                        <YAxis
                            // className="!ml-10"
                            dataKey="judge"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="score" fill="var(--color-desktop)" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>

        </Card>
    );
}
