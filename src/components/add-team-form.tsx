'use client';

import { getConvexErrorMessage } from '@/lib/convex-error';
import { useMutation } from 'convex/react';
import { useState, type FormEvent } from 'react';
import { api } from '../../convex/_generated/api';

export function AddTeamForm() {
    const createTeam = useMutation(api.teams.createTeam);
    const [name, setName] = useState('');
    const [memberOne, setMemberOne] = useState('');
    const [memberTwo, setMemberTwo] = useState('');
    const [initialScore, setInitialScore] = useState('0');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        if (!name.trim() || !memberOne.trim() || !memberTwo.trim()) {
            setError('All three fields are required.');
            return;
        }

        try {
            setIsSubmitting(true);
            await createTeam({
                name,
                members: [{ name: memberOne }, { name: memberTwo }],
                initialScore: Number(initialScore),
            });
            setName('');
            setMemberOne('');
            setMemberTwo('');
            setInitialScore('0');
        } catch (submitError) {
            setError(getConvexErrorMessage(submitError, 'Unable to add team.'));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="brutal-panel p-5">
            <div className="mb-6 flex items-center justify-between gap-3 border-b-2 border-black pb-4">
                <div>
                    <h2 className="text-2xl font-black uppercase text-zinc-900">Register Team</h2>
                    <p className="mt-1 text-sm text-zinc-600">
                        Two members, plus an optional preliminary score.
                    </p>
                </div>
                <span className="hidden border-2 border-black bg-[#d8ff3e] px-3 py-2 text-xs font-black uppercase sm:inline-block">
                    New entry
                </span>
            </div>

            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr_0.8fr]">
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                        Team Name
                    </label>
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="brutal-input w-full px-3 py-3 text-base text-zinc-900 outline-none"
                        placeholder="Code Warriors"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Member 1</label>
                    <input
                        value={memberOne}
                        onChange={(event) => setMemberOne(event.target.value)}
                        className="brutal-input w-full px-3 py-3 text-base text-zinc-900 outline-none"
                        placeholder="Ritochit Ghosh"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">Member 2</label>
                    <input
                        value={memberTwo}
                        onChange={(event) => setMemberTwo(event.target.value)}
                        className="brutal-input w-full px-3 py-3 text-base text-zinc-900 outline-none"
                        placeholder="Aryan Vishwakarma"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                        Preliminary starting score
                    </label>
                    <input
                        value={initialScore}
                        onChange={(event) => setInitialScore(event.target.value)}
                        type="number"
                        min={0}
                        step={1}
                        className="brutal-input w-full px-3 py-3 text-base text-zinc-900 outline-none"
                        placeholder="0"
                    />
                    <p className="mt-2 text-xs text-zinc-500">
                        Nonzero starting scores are recorded in team history.
                    </p>
                </div>
            </div>

            {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}

            <button
                type="submit"
                disabled={isSubmitting}
                className="brutal-button mt-6 min-h-12 w-full bg-[#d8ff3e] px-4 py-3 text-base font-black uppercase text-black disabled:cursor-not-allowed disabled:opacity-60 sm:max-w-sm"
            >
                {isSubmitting ? 'Adding team...' : 'Add Team'}
            </button>
        </form>
    );
}
