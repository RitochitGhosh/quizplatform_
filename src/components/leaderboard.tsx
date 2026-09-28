type TeamId = string & { __tableName: 'teams' };

type TeamRecord = {
    _id: TeamId;
    name: string;
    members: { name: string }[];
    score: number;
    createdAt: number;
};

export function Leaderboard({
    teams,
    onSelectTeam,
}: {
    teams: TeamRecord[];
    onSelectTeam: (teamId: TeamId) => void;
}) {
    if (teams.length === 0) {
        return (
            <div className="brutal-panel p-8 text-center text-zinc-700">
                No teams have been registered yet.
                <div className="mt-2 text-sm text-zinc-500">
                    Add the first team to begin the quiz.
                </div>
            </div>
        );
    }

    return (
        <div className="brutal-panel overflow-hidden">
            <div className="hidden grid-cols-[72px_minmax(0,1.8fr)_minmax(0,1.4fr)_120px] gap-4 border-b-2 border-black bg-[#171714] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-white md:grid">
                <span>Rank</span>
                <span>Team</span>
                <span>Members</span>
                <span className="text-right">Score</span>
            </div>

            <div className="divide-y-2 divide-black">
                {teams.map((team, index) => {
                    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

                    return (
                        <button
                            key={team._id}
                            type="button"
                            onClick={() => onSelectTeam(team._id)}
                            className={`grid w-full cursor-pointer grid-cols-1 gap-3 px-4 py-4 text-left transition-colors md:grid-cols-[72px_minmax(0,1.8fr)_minmax(0,1.4fr)_120px] md:items-center ${index === 0 ? 'bg-[#d8ff3e]' : 'bg-[#fffdf7] hover:bg-[#fff3a6]'}`}
                        >
                            <div className="flex items-center justify-between text-sm font-black text-black md:justify-start md:gap-2">
                                <span className="md:hidden text-zinc-500">#{index + 1}</span>
                                <span>{medal || `#${index + 1}`}</span>
                            </div>

                            <div>
                                <div className="text-base font-black uppercase text-zinc-900 md:text-lg">
                                    {team.name}
                                </div>
                                <div className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500 md:hidden">
                                    {team.members.map((member) => member.name).join(' • ')}
                                </div>
                            </div>

                            <div className="hidden text-sm text-zinc-600 md:block">
                                {team.members.map((member) => member.name).join(' • ')}
                            </div>

                            <div className="text-right text-xl font-black tabular-nums text-zinc-900 md:text-3xl">
                                {team.score}
                                <span className="ml-1 text-xs uppercase md:text-sm">pts</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
