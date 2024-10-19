'use client';
import React from 'react';
import Link from 'next/link';

export function TailwindcssButtons() {
    return (
        <Link
            href="/login"
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white w-[25%] mt-6"
        >
            <span className="absolute inset-[-1000%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,#93C5FD_0%,#3B82F6_50%,#93C5FD_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-white px-3 py-1 text-sm font-medium text-blue-600 backdrop-blur-3xl">
                <Link href="/organizer">List Your Hackathon Now!</Link>
            </span>
        </Link>
    );
}
