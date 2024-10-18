"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"
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
            { parameter: "useOfTechnology", score: 4 }
        ]
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
            { parameter: "useOfTechnology", score: 3 }
        ]
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
            { parameter: "useOfTechnology", score: 4 }
        ]
    },
    {
        teamId: 4,
        teamName: "Delta",
        scores: [
            { parameter: "innovationCreativity", score: 2 },
            { parameter: "technicalImplementation", score: 3 },
            { parameter: "problemSolutionFit", score: 3 },
            { parameter: "impactScalability", score: 2 },
            { parameter: "userExperience", score: 4 },
            { parameter: "designVisualAppeal", score: 3 },
            { parameter: "presentationCommunication", score: 3 },
            { parameter: "feasibilityPracticality", score: 4 },
            { parameter: "collaborationTeamwork", score: 2 },
            { parameter: "useOfTechnology", score: 3 }
        ]
    },
    {
        teamId: 5,
        teamName: "Epsilon",
        scores: [
            { parameter: "innovationCreativity", score: 4 },
            { parameter: "technicalImplementation", score: 4 },
            { parameter: "problemSolutionFit", score: 5 },
            { parameter: "impactScalability", score: 4 },
            { parameter: "userExperience", score: 5 },
            { parameter: "designVisualAppeal", score: 4 },
            { parameter: "presentationCommunication", score: 4 },
            { parameter: "feasibilityPracticality", score: 4 },
            { parameter: "collaborationTeamwork", score: 4 },
            { parameter: "useOfTechnology", score: 5 }
        ]
    },
    {
        teamId: 6,
        teamName: "Zeta",
        scores: [
            { parameter: "innovationCreativity", score: 3 },
            { parameter: "technicalImplementation", score: 2 },
            { parameter: "problemSolutionFit", score: 4 },
            { parameter: "impactScalability", score: 3 },
            { parameter: "userExperience", score: 3 },
            { parameter: "designVisualAppeal", score: 2 },
            { parameter: "presentationCommunication", score: 3 },
            { parameter: "feasibilityPracticality", score: 2 },
            { parameter: "collaborationTeamwork", score: 4 },
            { parameter: "useOfTechnology", score: 3 }
        ]
    },
    {
        teamId: 7,
        teamName: "Theta",
        scores: [
            { parameter: "innovationCreativity", score: 5 },
            { parameter: "technicalImplementation", score: 5 },
            { parameter: "problemSolutionFit", score: 5 },
            { parameter: "impactScalability", score: 4 },
            { parameter: "userExperience", score: 5 },
            { parameter: "designVisualAppeal", score: 5 },
            { parameter: "presentationCommunication", score: 5 },
            { parameter: "feasibilityPracticality", score: 5 },
            { parameter: "collaborationTeamwork", score: 4 },
            { parameter: "useOfTechnology", score: 5 }
        ]
    },
    {
        teamId: 8,
        teamName: "Iota",
        scores: [
            { parameter: "innovationCreativity", score: 2 },
            { parameter: "technicalImplementation", score: 3 },
            { parameter: "problemSolutionFit", score: 2 },
            { parameter: "impactScalability", score: 3 },
            { parameter: "userExperience", score: 2 },
            { parameter: "designVisualAppeal", score: 2 },
            { parameter: "presentationCommunication", score: 3 },
            { parameter: "feasibilityPracticality", score: 3 },
            { parameter: "collaborationTeamwork", score: 3 },
            { parameter: "useOfTechnology", score: 3 }
        ]
    }
];

// Helper function to calculate percentile
function calculatePercentile(value: number, allScores: number[]): { percentile: number, lowest: number } {
    const sortedScores = [...allScores].sort((a, b) => a - b);
    const rank = sortedScores.indexOf(value) + 1;
    const percentile = (rank / sortedScores.length) * 100;
    const lowest = sortedScores[0]; // Lowest score in the sorted array
    return { percentile, lowest };
}

// Function to calculate the best and worst performing parameter and their percentiles
function getPerformanceParameters(teamId: number) {
    const team = AllteamScores.find((team) => team.teamId === teamId)

    if (!team) {
        throw new Error("Team not found")
    }

    let bestParameter = '';
    let bestPercentile = 0;
    let worstParameter = '';
    let worstPercentile = 100; // Start with the highest possible percentile

    team.scores.forEach((teamScore) => {
        // Get all the scores for the current parameter across all teams
        const allScoresForParameter = AllteamScores.map((team) => team.scores.find((score) => score.parameter === teamScore.parameter)?.score || 0
        );

        // Calculate the percentile for the current team's score
        const { percentile, lowest } = calculatePercentile(teamScore.score, allScoresForParameter);

        // Update best parameter if the current one has a higher percentile
        if (percentile > bestPercentile) {
            bestPercentile = percentile;
            bestParameter = teamScore.parameter;
        }

        // Update worst parameter if the current one has a lower percentile
        if (percentile < worstPercentile) {
            worstPercentile = percentile;
            worstParameter = teamScore.parameter;
        }
    })

    return {
        bestParameter,
        bestPercentile,
        worstParameter,
        worstPercentile,
    }
}

// Modify the function to get team scores
function getTeamScoresByParameter(parameterName: string) {
    return AllteamScores.map(team => {
        const scoreEntry = team.scores.find(score => score.parameter === parameterName);
        return {
            teamId: team.teamId,
            score: scoreEntry ? scoreEntry.score : null // If parameter not found, return null
        };
    });
}

// Modify mapToChartData to sort in increasing order
function mapToChartData(parameterName: string) {
    const scores = getTeamScoresByParameter(parameterName);
    return scores
        .map(teamScore => ({
            teamid: teamScore.teamId,
            score: teamScore.score || 0 // Default to 0 if score is null
        }))
        .sort((a, b) => a.score - b.score); // Sort in increasing order by score
}

// Example usage of the modified functions
const { bestParameter, bestPercentile, worstParameter, worstPercentile } = getPerformanceParameters(1);
const chartData = mapToChartData(bestParameter);
console.log('Best Parameter:', bestParameter, 'Percentile:', bestPercentile);
console.log('Worst Parameter:', worstParameter, 'Percentile:', worstPercentile);

const chartConfig = {
    score: {
        label: "Score",
        color: "#625CF966",
    },
} satisfies ChartConfig

export function LowScoring() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Low Scoring Parameters</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="teamid"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false  }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="score" fill="var(--color-score)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
