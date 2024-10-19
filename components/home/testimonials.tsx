import React from 'react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';

export function Testimonials() {
    return (
        <BentoGrid className="mx-auto">
            {items.map((item, i) => (
                <BentoGridItem
                    key={i}
                    title={item.title}
                    description={
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={item.photo}
                                alt={item.title}
                                className="w-16 h-16 rounded-full mb-4"
                            />
                            <div className="flex items-center mb-2">
                                {Array.from({ length: item.rating }).map((_, idx) => (
                                    <svg
                                        key={idx}
                                        className="w-5 h-5 text-yellow-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.189c.969 0 1.371 1.24.588 1.81l-3.39 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.538 1.118l-3.39-2.455a1 1 0 00-1.175 0l-3.39 2.455c-.783.57-1.838-.197-1.538-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.537 9.393c-.783-.57-.38-1.81.588-1.81h4.189a1 1 0 00.95-.69l1.286-3.966z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600">{item.description}</p>
                        </div>
                    }
                    className={i === 3 || i === 6 ? 'md:col-span-2' : ''}
                />
            ))}
        </BentoGrid>
    );
}

const items = [
    {
        title: 'Emily R., Event Coordinator at TechFest',
        description:
            'Judge Smart transformed our events by providing instant feedback to participants and significantly reducing the workload for our judges. The analytics dashboard is a game-changer!',
        photo: 'https://randomuser.me/api/portraits/women/1.jpg',
        rating: 5,
    },
    {
        title: 'Michael S., Senior Judge at Innovate Awards',
        description:
            'With Judge Smart, I can focus more on evaluating performances rather than getting bogged down by administrative tasks. The platform is intuitive and highly efficient.',
        photo: 'https://randomuser.me/api/portraits/men/2.jpg',
        rating: 4,
    },
    {
        title: 'Sophia L., Participant at CodeSprint',
        description:
            'Receiving immediate feedback helped me understand my strengths and areas for improvement. Judge Smart made the entire experience more engaging and rewarding.',
        photo: 'https://randomuser.me/api/portraits/women/3.jpg',
        rating: 5,
    },
    // Additional testimonials can be added here
];
