'use client'
import { ComparisonWinning } from '@/components/comparison-with-winning';
import { HighScoring } from '@/components/high-scoring';
import { LowScoring } from '@/components/low-scoring';
import React from 'react'

type Props = {}
interface TeamScore {
    parameter: string;
    score: number;
}

export interface TeamData {
    teamId: number;
    teamName: string;
    scores: TeamScore[];
}


export const IndividualTeamScores = [
    {
        teamId: 1,
        teamName: " Alpha",
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
    }
];

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

const teamAverages = AllteamScores.map(team => {
    const totalScore = team.scores.reduce((sum, scoreObj) => sum + scoreObj.score, 0);
    const averageScore = totalScore / team.scores.length;
    return {
        teamId: team.teamId,
        teamName: team.teamName,
        averageScore: averageScore
    };
});

// Step 2: Sort the teams based on their average score (descending order)
teamAverages.sort((a, b) => b.averageScore - a.averageScore);

// Step 3: Assign ranks based on the sorted average scores
const rankedTeams = teamAverages.map((team, index) => ({
    teamId: team.teamId,
    teamName: team.teamName,
    rank: index + 1
}));
function getTeamRank(teamId: number) {
    const team = rankedTeams.find(t => t.teamId === teamId);
    return team ? team.rank : "Team not found";
}
const MyTeamAnalytics = (props: Props) => {
    return (
        <div className=' h-screen relative'>
            <div className='bg-muted rounded-3xl flex items-center justify-center flex-col absolute'>
                <h1 className='font-bold px-4 py-2 text-4xl '>#{getTeamRank(3)}/{AllteamScores.length}</h1>
                <h1 className='font-bold px-4 py-2 '>Your Rank </h1>
            </div>
            <div className='grid grid-cols-1 grid-rows-4 gap-2 mx-auto my-auto w-fit h-fit justify-center max-w-screen-md max-h-screen-md'>

                <ComparisonWinning />
                <HighScoring AllteamScores={AllteamScores} />
                <LowScoring AllteamScores={AllteamScores} />
            </div>
        </div>
    )
}

export default MyTeamAnalytics