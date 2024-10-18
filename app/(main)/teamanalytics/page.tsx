
import { ComparisonWinning } from '@/components/comparison-with-winning';
import React from 'react'

type Props = {}


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

// Output the ranked teams
// console.log(rankedTeams);

function getTeamRank(teamId: number) {
    const team = rankedTeams.find(t => t.teamId === teamId);
    return team ? team.rank : "Team not found";
}
const MyTeamAnalytics = (props: Props) => {
    return (
        <div>
            <div className='flex  gap-4 justify-center'>
                <div className='bg-muted rounded-3xl w-[40%] px-8 flex items-center justify-center'>
                    <h1 className='font-bold px-4 py-2 text-6xl'>Your Rank: #{getTeamRank(3)}</h1>
                    {/* <Chartui /> */}
                </div>
                <ComparisonWinning />
                {/* <div className='bg-muted rounded-3xl px-6 py-4 h-[40%] flex flex-col items-center justify-center'>
                        <h1 className='text-primary font-bold text-6xl'>$75,000</h1>
                        <p className='font-bold'>Dawdle Revenue</p>
                    </div>
                    <div className='bg-muted rounded-3xl px-6 py-4 h-[40%] flex flex-col items-center justify-center'>
                        <h1 className='text-primary font-bold text-6xl'>$40,000</h1>
                        <p className='font-bold'>Consultant Earnings</p>
                    </div> */}
            </div>
        </div>
    )
}

export default MyTeamAnalytics