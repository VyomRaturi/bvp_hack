"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { PopulatedEvaluation } from "@/models/Evaluation"; // Your evaluation type

type TeamPerformanceChartProps = {
    evaluations: PopulatedEvaluation[];
};
type ChartData = {
    parameter: string;
    [teamName: string]: number | string; // Allow parameter to be a string while keeping team scores as numbers
};
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
export const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({ evaluations }) => {
    // Extract unique parameters
    const parameters = Array.from(new Set(evaluations.map((evale) => evale.parameter)));

    // Create a mapping of team scores per parameter
    const teamScores: Record<string, Record<string, { totalScore: number; count: number }>> = {};

    evaluations.forEach(({ team, score, parameter }) => {
        if (!teamScores[team.id]) {
            teamScores[team.id] = {};
        }
        if (!teamScores[team.id][parameter]) {
            teamScores[team.id][parameter] = { totalScore: 0, count: 0 };
        }
        teamScores[team.id][parameter].totalScore += score;
        teamScores[team.id][parameter].count += 1;
    });

    // Prepare data for the chart
    const chartData: ChartData[] = parameters.map((parameter) => {
        const dataEntry: ChartData = { parameter };

        for (const teamId in teamScores) {
            const teamScoreData = teamScores[teamId][parameter];
            const averageScore = teamScoreData.totalScore / teamScoreData.count;
            dataEntry[teamId] = Number(averageScore.toFixed(2));
        }

        return dataEntry;
    });

    return (
        <div className="flex justify-center p-4 w-[50vw]">
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData} layout="horizontal" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="h-[300px]" />
                    {/* XAxis should now represent the categories (parameters) */}
                    <XAxis dataKey="parameter" type="category" />
                    {/* YAxis should now represent the numerical score */}
                    <YAxis type="number" domain={[0, 4]} />
                    <Tooltip />
                    <Legend />
                    {Object.keys(teamScores).map((teamId, idx) => (
                        <Line key={teamId} dataKey={teamId} name={evaluations.find((e) => e.team.id === teamId)?.team.name} stroke={colorPalette[idx % 12]} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

