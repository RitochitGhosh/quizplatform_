type TeamRecord = {
    _id: string;
    name: string;
    members: { name: string }[];
    score: number;
};

type ScoreEvent = {
    _id: string;
    teamId: string;
    points: number;
    type: 'initial' | 'award' | 'correction';
    note: string;
    previousScore: number;
    newScore: number;
    scoredByEmail: string;
    createdAt: number;
};

function formatEventTimestamp(timestamp: number) {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    const day = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    return `${day} · ${time}`;
}

export function TeamHistory({ team, events }: { team: TeamRecord | null; events: ScoreEvent[] }) {
    if (!team) return null;

    return (
        <div className="brutal-panel p-5">
            <div className="mb-4 flex items-start justify-between gap-4 border-b-2 border-black pb-4">
                <div>
                    <h2 className="text-2xl font-black uppercase text-zinc-900">{team.name}</h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        {team.members.map((member) => member.name).join(' • ')}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                        Current Score
                    </div>
                    <div className="text-4xl font-black tabular-nums text-zinc-900">
                        {team.score}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Members
                </div>
                <ul className="space-y-2">
                    {team.members.map((member) => (
                        <li key={member.name} className="text-base text-zinc-700">
                            {member.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-6">
                <h3 className="mb-4 text-xl font-black uppercase text-zinc-900">Score History</h3>
                {events.length === 0 ? (
                    <div className="border-2 border-dashed border-black bg-white p-4 text-sm text-zinc-600">
                        No scoring events yet.
                    </div>
                ) : (
                    <div className="relative space-y-3 before:absolute before:bottom-4 before:left-3.25 before:top-4 before:w-0.5 before:bg-black">
                        {events.map((event) => {
                            const accent =
                                event.type === 'correction'
                                    ? 'bg-[#ff9e91]'
                                    : event.type === 'initial'
                                      ? 'bg-[#9fc9ff]'
                                      : 'bg-[#d8ff3e]';
                            const label =
                                event.type === 'correction'
                                    ? `SCORE EDIT ${event.points > 0 ? '+' : ''}${event.points}`
                                    : event.type === 'initial'
                                      ? `START +${event.points}`
                                      : `+${event.points} POINTS`;

                            return (
                                <article key={event._id} className="relative pl-9">
                                    <span
                                        className={`absolute left-1 top-5 size-5 border-2 border-black ${accent}`}
                                    />
                                    <div className="border-2 border-black bg-white p-4 shadow-[3px_3px_0_#171714]">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <div
                                                    className={`inline-block border-2 border-black px-2 py-1 text-sm font-black text-zinc-900 ${accent}`}
                                                >
                                                    {label}
                                                </div>
                                                <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-800">
                                                    {event.note}
                                                </p>
                                            </div>
                                            <div className="border-2 border-black bg-[#f4f1e8] px-2 py-1 text-xs font-black tabular-nums text-zinc-900">
                                                {event.previousScore}{' '}
                                                <span aria-hidden="true">→</span> {event.newScore}
                                            </div>
                                        </div>
                                        <div className="mt-3 border-t border-dashed border-zinc-400 pt-2 text-[11px] font-medium text-zinc-500">
                                            {event.type === 'initial'
                                                ? `Starting score by ${event.scoredByEmail}`
                                                : `${event.type === 'award' ? 'Awarded' : 'Corrected'} by ${event.scoredByEmail}`}
                                            <span className="ml-2">
                                                · {formatEventTimestamp(event.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
