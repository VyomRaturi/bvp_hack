// src/components/Leaderboard.tsx

'use client';

import { useState, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Shadcn Select
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableBody,
  TableHead,
} from '@/components/ui/table'; // Shadcn Table
// import { PopulatedEvaluation } from '@/types/leaderboard'; // Adjust the import path as needed
// import { FaCaretDown } from 'react-icons/fa';
import { PopulatedEvaluation } from '@/models/Evaluation';

export const calculateLeaderboard = (
  evaluations: PopulatedEvaluation[],
  selectedParameter: string | 'all'
) => {
  const teamScores: Record<
    string,
    { teamName: string; totalScore: number; count: number }
  > = {};

  // Process each evaluation
//   console.log(evaluations)
  evaluations.forEach(({ team, score, parameter }) => {
    // Ensure 'score' is a number
    const numericScore = Number(score);
    if (isNaN(numericScore)) {
      console.warn('Invalid score encountered:', score);
      return; // Skip this evaluation if score is invalid
    }

    // Only consider evaluations matching the selected parameter or all parameters
    if (selectedParameter === 'All' || selectedParameter === parameter) {
      // Initialize score tracking for the team if not already present
      if (!teamScores[team.id]) {
        teamScores[team.id] = { teamName: team.name, totalScore: 0, count: 0 };
      }

      // Add the score for the team
      teamScores[team.id].totalScore += numericScore;
      teamScores[team.id].count += 1;
    }
  });

  // Calculate the leaderboard with average scores
  const leaderboard = Object.keys(teamScores)
    .map((teamId) => {
      const { totalScore, count, teamName } = teamScores[teamId];

      // Prevent division by zero (should not happen but just in case)
      const averageScore = count > 0 ? totalScore / count : 0;

      return {
        teamId,
        teamName,
        averageScore: Number(averageScore.toFixed(2)), // Ensure it's a number
      };
    })
    .sort((a, b) => b.averageScore - a.averageScore); // Sort descending by score

  return leaderboard;
};

type LeaderboardProps = {
  evaluations: PopulatedEvaluation[];
};

const Leaderboard: React.FC<LeaderboardProps> = ({ evaluations }) => {
  const [selectedParam, setSelectedParam] = useState<string>('All');

  // Extract unique parameters from evaluations
  const parameters = [
    'All',
    ...Array.from(new Set(evaluations.map((evale) => evale.parameter))),
  ];

  const leaderboard = useMemo(
    () => calculateLeaderboard(evaluations, selectedParam),
    [evaluations, selectedParam]
  );

  return (
    <div className="p-4 w-[25%] border-r-2 max-h-[90vh] app-scrollbar overflow-y-auto">
      {/* Parameter Selection */}
      <h2 className='text-2xl font-semibold leading-none tracking-tight text-center'>
        Leaderboard
      </h2>
      <div className="flex gap-4 items-center justify-center">
        <div className=''>
      Filter by parameter : 
        </div>
        <Select onValueChange={(value) => setSelectedParam(value)} defaultValue="All">
        <SelectTrigger className="w-fit border  gap-3 px-4 py-2">
          <SelectValue placeholder="select" />
        </SelectTrigger>
        <SelectContent>
          {parameters.map((param) => (
            <SelectItem key={param} value={param}>
              {param}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      </div>
      

      {/* Leaderboard Table */}
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Team Name</TableHead>
            {/* <TableHead>Average Score</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No teams found.
              </TableCell>
            </TableRow>
          ) : (
            leaderboard.map((team, index) => (
              <TableRow key={team.teamId} className={index%2 ? "bg-muted" : ""}>
                <TableCell  className='text-lg w-1/3'>{index + 1}</TableCell>
                <TableCell className='text-lg'>{team.teamName}</TableCell>
                {/* <TableCell>{team.averageScore.toFixed(2)}</TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;
