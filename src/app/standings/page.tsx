'use client';

import { Leaderboard } from '@/components/leaderboard';
import { TeamHistory } from '@/components/team-history';
import { useAuth } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../../../convex/_generated/api';

type TeamId = string & { __tableName: 'teams' };

export default function StandingsPage() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const teams = useQuery(api.teams.getTeams);
    const [selectedTeamId, setSelectedTeamId] = useState<TeamId | null>(null);
    const orderedTeams = useMemo(() => teams ?? [], [teams]);
    const activeTeamId = selectedTeamId ?? orderedTeams[0]?._id ?? null;
    const selectedTeam = useQuery(
        api.teams.getTeam,
        activeTeamId ? { teamId: activeTeamId } : 'skip',
    );
    const scoreHistory = useQuery(
        api.scoreEvents.getScoreHistory,
        activeTeamId ? { teamId: activeTeamId } : 'skip',
    );

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace('/sign-in');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded || !isSignedIn) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-10 text-zinc-600">Loading standings...</div>
        );
    }

    return (
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="inline-block border-2 border-black bg-[#9fc9ff] px-2 py-1 text-[10px] font-black uppercase">
                        Intra-college quiz competition
                    </div>
                    <h1 className="mt-3 text-4xl font-black uppercase leading-none sm:text-6xl">
                        MogojDholai
                    </h1>
                    <p className="mt-2 text-sm font-bold uppercase tracking-widest text-zinc-600">
                        Live standings
                    </p>
                </div>
                <div className="brutal-panel flex items-center gap-3 px-4 py-3">
                    <span className="relative flex size-3">
                        <span className="absolute inline-flex size-full animate-ping bg-green-500 opacity-50" />
                        <span className="relative inline-flex size-3 border border-black bg-[#d8ff3e]" />
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest">Live feed</span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
                <div className="space-y-4">
                    <Leaderboard teams={orderedTeams} onSelectTeam={setSelectedTeamId} />
                </div>

                <div>
                    <TeamHistory team={selectedTeam ?? null} events={scoreHistory ?? []} />
                </div>
            </div>
        </main>
    );
}
