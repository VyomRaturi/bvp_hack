"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
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
function calculatePercentile(value: number, allScores: number[]): number {
    const sortedScores = [...allScores].sort((a, b) => a - b)
    const rank = sortedScores.indexOf(value) + 1
    return (rank / sortedScores.length) * 100
}
// Function to calculate the best-performing parameter and its percentile
function getBestPerformingParameter(teamId: number) {
    const team = AllteamScores.find((team) => team.teamId === teamId)

    if (!team) {
        throw new Error("Team not found")
    }

    let bestParameter = ''
    let bestPercentile = 0

    team.scores.forEach((teamScore) => {
        // Get all the scores for the current parameter across all teams
        const allScoresForParameter = AllteamScores.map((team) => team.scores.find((score) => score.parameter === teamScore.parameter)?.score || 0
        )

        // Calculate the percentile for the current team's score
        const percentile = calculatePercentile(teamScore.score, allScoresForParameter)

        // Update best parameter if the current one has a higher percentile
        if (percentile > bestPercentile) {
            bestPercentile = percentile
            bestParameter = teamScore.parameter
        }
    })

    return {
        bestParameter,
        bestPercentile,
    }
}



function getTeamScoresByParameter(parameterName) {
    return AllteamScores.map(team => {
        const scoreEntry = team.scores.find(score => score.parameter === parameterName);
        return {
            teamId: team.teamId,
            score: scoreEntry ? scoreEntry.score : null // If parameter not found, return null
        };
    });
}
const chartConfig = {
    views: {
        label: "Page Views",
    },
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function HighScoring() {
    const [activeChart, setActiveChart] =
        React.useState<keyof typeof chartConfig>("desktop")

    const total = React.useMemo(
        () => ({
            desktop: getTeamScoresByParameter(getBestPerformingParameter.bestParameter).reduce((acc, curr) => acc + curr.score, 0),
        }),
        []
    )

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Bar Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing total visitors for the last 3 months
                    </CardDescription>
                </div>
                <div className="flex">
                    {["desktop", "mobile"].map((key) => {
                        const chart = key as keyof typeof chartConfig
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chartConfig[chart].label}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {total[key as keyof typeof total].toLocaleString()}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
