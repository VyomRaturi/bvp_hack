import { cn } from '@/lib/utils';
import { AiFillThunderbolt } from 'react-icons/ai';
import { MdOutlineTimer } from 'react-icons/md';
import { TbReportAnalytics } from 'react-icons/tb';
import { FaLink } from 'react-icons/fa6';

export function FeaturesSectionDemo() {
    const features = [
        {
            title: 'Lightning-Fast Feedback',
            description:
                'Empower participants with immediate insights on their performances, enabling rapid improvement and heightened engagement.',
            icon: <AiFillThunderbolt className="text-blue-500 w-8 h-8" />,
        },
        {
            title: 'Time-Saving for Judges',
            description:
                'Simplify the judging process with intuitive interfaces and automated workflows, allowing judges to focus on what truly matters.',
            icon: <MdOutlineTimer className="text-green-500 w-8 h-8" />,
        },
        {
            title: 'Advanced Analytics',
            description:
                'Leverage comprehensive data analysis to gain actionable insights, streamline decision-making, and enhance overall event quality.',
            icon: <TbReportAnalytics className="text-purple-500 w-8 h-8" />,
        },
        {
            title: 'Seamless Integration',
            description:
                'Easily integrate with your existing systems and tools, ensuring a smooth transition and minimal disruption to your workflow.',
            icon: <FaLink className="text-orange-500 w-8 h-8" />,
        },
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div className="flex flex-col items-center text-center p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
};
