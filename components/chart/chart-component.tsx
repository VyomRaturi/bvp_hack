"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

import { TooltipProps } from "recharts";
import { TeamData } from "@/app/(main)/teamanalytics/page";


interface ChartDataPoint {
  teamId: number;
  teamName: string;
  teamLabel: string;
  score: number;
  percentile: number;
  isUserTeam: boolean;
  fill: string;
}

interface PerformanceProps {
  parameterName: string;
  title: string;
  isBest?: boolean;
  AllteamScores : TeamData[]
}
const chartConfig: ChartConfig = {
    score: {
      label: "Score",
      color: "#625CF966",
    },
  };


export const CustomChart: React.FC<PerformanceProps> = ({ parameterName, title, isBest , AllteamScores}) => {
  const chartData = mapToChartData(parameterName, AllteamScores);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="teamLabel"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={<CustomXAxisTick />}
              interval={0} // Force display all labels
            />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <Bar dataKey="score" radius={8}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};




  function getTeamScoresByParameter(
    parameterName: string, AllteamScores : TeamData[]
  ): { teamId: number; teamName: string; score: number }[] {
    return AllteamScores.map((team) => {
      const scoreEntry = team.scores.find(
        (score) => score.parameter === parameterName
      );
      return {
        teamId: team.teamId,
        teamName: team.teamName,
        score: scoreEntry ? scoreEntry.score : 0, // If parameter not found, return 0
      };
    });
  }

function mapToChartData(parameterName: string, AllteamScores : TeamData[]): ChartDataPoint[] {
    // Get all scores for the parameter across all teams
    const allScoresForParameter = getTeamScoresByParameter(parameterName, AllteamScores);
  
    // Extract all scores for percentile calculation
    const allScores = allScoresForParameter.map((entry) => entry.score);
  
    // Map data to include necessary properties
    const chartData = allScoresForParameter
      .map((entry) => {
        const percentile = calculatePercentile(entry.score, allScores);
        const isUserTeam = entry.teamId === 1; // Assuming your teamId is 1
        return {
          teamId: entry.teamId,
          teamName: entry.teamName,
          teamLabel: isUserTeam ? "Your Team" : entry.teamName, // Label your team
          score: entry.score,
          percentile,
          isUserTeam,
          fill: isUserTeam ? "purple" : "var(--color-score)", // Highlight your team
        };
      })
      .sort((a, b) => a.score - b.score); // Sort in increasing order by score
  
    return chartData;
  }

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    const { score, percentile, isUserTeam } = data;
    const percentileText = isUserTeam
      ? `You beat ${percentile.toFixed(2)}% of teams`
      : `Percentile: ${percentile.toFixed(2)}%`;
    return (
      <div className="custom-tooltip bg-white">
        <p className="label">{`${label}: ${score}`}</p>
        <p className="intro">{percentileText}</p>
      </div>
    );
  }
  return null;
};

interface CustomXAxisTickProps {
    x?: number;
    y?: number;
    payload?: {
      value: string;
      index: number;
      coordinate: number;
      offset: number;
      tickCoord: number;
      isShow: boolean;
      payload: ChartDataPoint;
    };
  }
const CustomXAxisTick: React.FC<CustomXAxisTickProps> = ({
  x = 0,
  y = 0,
  payload,
}) => {
  const isUserTeam = payload?.payload && payload?.payload.isUserTeam;
  const fill = isUserTeam ? "purple" : "#666";
  const fontWeight = isUserTeam ? "bold" : "normal";
  return (
    <text x={x} y={y + 15} textAnchor="middle" fill={fill} fontWeight={fontWeight}>
      {payload?.value}
    </text>
  );
};


function calculatePercentile(value: number, allScores: number[]): number {
    const sortedScores = [...allScores].sort((a, b) => a - b);
    const rank = sortedScores.findIndex(score => score === value);
  
    if (rank === 0) return 0;
  
    const percentile = (rank / (sortedScores.length - 1)) * 100;
    return percentile;
  }
  
  function getPerformanceParameters(teamId: number , AllteamScores : TeamData[]) {
    const team = AllteamScores.find((team) => team.teamId === teamId);
  
    if (!team) throw new Error("Team not found");
  
    let bestParameter = "";
    let bestPercentile = 0;
    let worstParameter = "";
    let worstPercentile = 100;
  
    team.scores.forEach((teamScore) => {
      const allScoresForParameter = AllteamScores.map(
        (team) => team.scores.find((score) => score.parameter === teamScore.parameter)?.score || 0
      );
      
      const percentile = calculatePercentile(teamScore.score, allScoresForParameter);
  
      if (percentile > bestPercentile) {
        bestPercentile = percentile;
        bestParameter = teamScore.parameter;
      }
  
      if (percentile < worstPercentile) {
        worstPercentile = percentile;
        worstParameter = teamScore.parameter;
      }
    });
  
    return { bestParameter, bestPercentile, worstParameter, worstPercentile };
  }
  
