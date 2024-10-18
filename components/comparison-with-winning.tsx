"use client"

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
import { AllteamScores } from "@/app/(main)/teamanalytics/page"

export const description = "A multiple bar chart"

const yourTeam = AllteamScores.find(team => team.teamId === 1);
const winningTeam = AllteamScores.find(team => team.teamId === 3);

const chartData = yourTeam?.scores.map((yourTeamScore, index) => {
    const winningTeamScore = winningTeam?.scores[index].score; // Score from the winning team
    return {
        parameter: yourTeamScore.parameter,
        team: yourTeamScore.score,          // Your team's score
        winningteam: winningTeamScore,      // Winning team's score
    };
});


const chartConfig = {
    winningteam: {
        label: "Winning Team",
        color: "#625CF9",

    },
    team: {
        label: "Your Team",
        color: "#625CF966",

    },
} satisfies ChartConfig

export function ComparisonWinning() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Comparison Your Team Vs Winning Team</CardTitle>
            </CardHeader>
            <CardContent className="w-full bg-muted">
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="parameter"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)} // Shorten parameter name
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="winningteam" fill="var(--color-winningteam)" radius={4} />
                        <Bar dataKey="team" fill="var(--color-team)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
