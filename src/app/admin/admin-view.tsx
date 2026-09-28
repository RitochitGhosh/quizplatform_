'use client';

import { AddTeamForm } from '@/components/add-team-form';
import { TeamScoreControls } from '@/components/team-score-controls';
import { useAuth, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../convex/_generated/api';

export default function AdminView() {
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();
    const teams = useQuery(api.teams.getTeams);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace('/sign-in');
            return;
        }

        const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
        const allowed =
            (process.env.NEXT_PUBLIC_ADMINEMAILS ?? '')
                .split(',')
                .map((value) => value.trim().toLowerCase())
                .filter(Boolean)
                .includes(email ?? '') || false;
        if (isLoaded && isSignedIn && !allowed) {
            router.replace('/standings');
        }
    }, [isLoaded, isSignedIn, user, router]);

    const orderedTeams = useMemo(() => teams ?? [], [teams]);
    const filteredTeams = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return orderedTeams;
        return orderedTeams.filter((team) =>
            [team.name, ...team.members.map((member) => member.name)]
                .join(' ')
                .toLowerCase()
                .includes(query),
        );
    }, [orderedTeams, search]);

    if (!isLoaded || !isSignedIn) {
        return <div className="mx-auto max-w-6xl px-4 py-10 text-zinc-600">Loading admin...</div>;
    }

    return (
        <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <div className="inline-block border-2 border-black bg-[#ff9e91] px-2 py-1 text-[10px] font-black uppercase">
                        Operator mode / 02
                    </div>
                    <h1 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">
                        Score desk
                    </h1>
                    <p className="mt-3 text-sm font-medium text-zinc-600">
                        Search once, then score from clearly sized team stations.
                    </p>
                </div>
            </div>

            <div className="space-y-9">
                <AddTeamForm />

                <section aria-label="Team scoring stations">
                    <div className="mb-5 flex flex-col justify-between gap-4 border-y-2 border-black py-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-2xl font-black uppercase">Scoring stations</h2>
                            <p className="mt-1 text-sm text-zinc-600">
                                {filteredTeams.length}{' '}
                                {filteredTeams.length === 1 ? 'team' : 'teams'} shown
                            </p>
                        </div>
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            type="search"
                            aria-label="Search teams or members"
                            placeholder="Find team or member..."
                            className="brutal-input w-full px-4 py-3 text-base sm:w-96"
                        />
                    </div>

                    {orderedTeams.length === 0 ? (
                        <div className="brutal-panel p-8 text-center text-zinc-600">
                            No teams have been registered yet.
                        </div>
                    ) : filteredTeams.length === 0 ? (
                        <div className="brutal-panel p-8 text-center text-zinc-600">
                            No teams match “{search}”.
                        </div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-stretch gap-7">
                            {filteredTeams.map((team) => (
                                <TeamScoreControls key={team._id} team={team} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
