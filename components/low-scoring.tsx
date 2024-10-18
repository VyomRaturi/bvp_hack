"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
const AllteamScores = [
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
    }
];

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

// Define types for individual score and team structure
type Score = {
    parameter: string;
    score: number;
};

type Team = {
    teamId: number;
    teamName: string;
    scores: Score[];
};
type ChartData = {
    paramters: string;
    Team: number;
};
// Define the structure of average scores (record where the key is a parameter, and value is a number)
type AverageScores = Record<string, number>;

// Function to calculate average scores for each parameter across all teams


export function LowScoring() {
    function calculateAverageParameterScores(teams: Team[]): AverageScores {
        const totalScores: Record<string, number> = {};
        const countScores: Record<string, number> = {};
    
        teams.forEach((team) => {
            team.scores.forEach((scoreObj) => {
                const { parameter, score } = scoreObj;
                if (!totalScores[parameter]) {
                    totalScores[parameter] = 0;
                    countScores[parameter] = 0;
                }
                totalScores[parameter] += score;
                countScores[parameter] += 1;
            });
        });
    
        // Calculate averages
        const averageScores: AverageScores = {};
        for (const parameter in totalScores) {
            averageScores[parameter] = totalScores[parameter] / countScores[parameter];
        }
    
        return averageScores;
    }
    
    // Function to get high-scoring parameters for a specific team
    function getHighScoringParametersForTeam(team: Team, averageScores: AverageScores): string[] {
        const highScoringParameters: string[] = [];
    
        team.scores.forEach((scoreObj) => {
            const { parameter, score } = scoreObj;
            if (score > averageScores[parameter]) {
                highScoringParameters.push(parameter);
            }
        });
    
        return highScoringParameters;
    }
    
    // New function to get low-scoring parameters for a specific team
    function getLowScoringParametersForTeam(team: Team, averageScores: AverageScores): string[] {
        const lowScoringParameters: string[] = [];
    
        team.scores.forEach((scoreObj) => {
            const { parameter, score } = scoreObj;
            if (score < averageScores[parameter]) {
                lowScoringParameters.push(parameter);
            }
        });
    
        return lowScoringParameters;
    }
    
    // Function to generate chart data for high- or low-scoring parameters

    
    // The function takes team scores and high- or low-scoring parameters and returns an array of chart data
    function getChartData(teamScores: Team, scoringParameters: string[]): ChartData[] {
        return scoringParameters.map((param) => {
            const scoreObj = teamScores.scores.find((s) => s.parameter === param);
            return {
                paramters: param,
                Team: scoreObj ? scoreObj.score : 0
            };
        });
    }
    
    // Example: Calculate average scores across all teams
    const averageScores: AverageScores = calculateAverageParameterScores(AllteamScores);
    
    // Step 2: Find high- and low-scoring parameters for each team
    AllteamScores.forEach((team) => {
        const highScoringParameters: string[] = getHighScoringParametersForTeam(team, averageScores);
        console.log(`High scoring parameters for ${team.teamName}:`, highScoringParameters);
        
        const lowScoringParameters: string[] = getLowScoringParametersForTeam(team, averageScores);
        console.log(`Low scoring parameters for ${team.teamName}:`, lowScoringParameters);
    });
    
    // Example of low-scoring parameters for a specific team
    const lowScoringParameters: string[] = getLowScoringParametersForTeam(AllteamScores[0], averageScores);
    
    // Chart data for your team based on low-scoring parameters
    const lowScoringChartData: ChartData[] = getChartData(AllteamScores[0], lowScoringParameters);
    
    // Example chart configuration
    const chartConfig = {
        Team: {
            label: "Your Team (Low Scoring Parameters)",
            color: "#625CF966", // Example color for low scoring
        },
    } satisfies ChartConfig;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Low Scoring Parameters</CardTitle>
            </CardHeader>
            <CardContent className="bg-muted">
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={lowScoringChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="paramters"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="Team" fill="var(--color-Team)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
