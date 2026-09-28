'use client';

import dynamic from 'next/dynamic';

const StandingsView = dynamic(() => import('./standings-view'), {
    ssr: false,
    loading: () => (
        <div className="mx-auto max-w-6xl px-4 py-10 text-zinc-600">Loading standings...</div>
    ),
});

export default function StandingsPage() {
    return <StandingsView />;
}
