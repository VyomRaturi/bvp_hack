import { TeamData } from "@/app/(main)/teamanalytics/page";
import { CustomChart } from "./chart/chart-component";

export function LowScoring({AllteamScores} : {AllteamScores : TeamData[]}) {
    function getPerformanceParameters(
        teamId: number
      ): {
        bestParameter: string;
        bestPercentile: number;
        worstParameter: string;
        worstPercentile: number;
      } {
        const team = AllteamScores.find((team) => team.teamId === teamId);
      
        if (!team) {
          throw new Error("Team not found");
        }
      
        let bestParameter = "";
        let bestPercentile = 0;
        let worstParameter = "";
        let worstPercentile = 100; // Start with the highest possible percentile
      
        team.scores.forEach((teamScore) => {
          // Get all the scores for the current parameter across all teams
          const allScoresForParameter = AllteamScores.map(
            (team) =>
              team.scores.find((score) => score.parameter === teamScore.parameter)
                ?.score || 0
          );
      
          // Calculate the percentile for the current team's score
          const percentile = calculatePercentile(teamScore.score, allScoresForParameter);
          // console.log(teamScore.parameter,percentile)
      
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
        });
      
        return {
          bestParameter,
          bestPercentile,
          worstParameter,
          worstPercentile,
        };
      }
      function calculatePercentile(value: number, allScores: number[]): number {
        const sortedScores = [...allScores].sort((a, b) => a - b);
        const rank = sortedScores.findIndex(score => score === value);
        
        // Handle edge case when your team is at the lowest score
        if (rank === 0) {
          return 0; // You beat 0% of the teams
        }
      
        // Calculate the exact percentile without rounding
        const percentile = (rank / (sortedScores.length - 1)) * 100;
        return percentile;
      }

    const { worstParameter } = getPerformanceParameters(1);
    return <CustomChart AllteamScores={AllteamScores} parameterName={worstParameter} title={`Lowest Scoring Parameter: ${worstParameter.replace(/([A-Z])/g, " $1")}`} />;
  }