import { FinalResultChart } from '@/components/JudgeMee';
import Leaderboard from '@/components/Leaderboard';
import { TeamPerformanceChart } from '@/components/LineChart';
import { PieChartComp } from '@/components/PieChart';
import React from 'react'

// type Props = {}

const Final = async () => {
    const res = await fetch('http://localhost:3000/api/final');
    const { populatedData } = await res.json();
    // console.log(populatedData[0]);
    // console.log(evaluations[0].answers[0])
    return (
        <div className='flex max-h-[87vh] overflow-y-scroll app-scrollbar'>
            <Leaderboard evaluations={populatedData} />
            <div className='w-[75%]'>
                <div className=''>
                <FinalResultChart evaluations={populatedData} />
                </div>
                <div className="flex">
                    <PieChartComp evaluations={populatedData}/>
                    <TeamPerformanceChart evaluations={populatedData}/>
                </div>

            </div>
        </div>
    )
}

export default Final