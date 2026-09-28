'use client';

import { useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '../../convex/_generated/api';

type TeamId = string & { __tableName: 'teams' };

type Team = {
    _id: TeamId;
    name: string;
    score: number;
    members: { name: string }[];
};

export function TeamScoreControls({ team }: { team: Team }) {
    const addPoints = useMutation(api.teams.addPoints);
    const addManualPoints = useMutation(api.teams.addManualPoints);
    const setScore = useMutation(api.teams.setScore);
    const deleteTeam = useMutation(api.teams.deleteTeam);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [manualPoints, setManualPoints] = useState('');
    const [manualScoreDraft, setManualScoreDraft] = useState<string | null>(null);
    const manualScore = manualScoreDraft ?? String(team.score);

    async function handleScore(points: number) {
        setError('');
        const nextNote = note.trim();
        if (!nextNote) {
            setError('Score note is required.');
            return;
        }

        try {
            setPending(true);
            await addPoints({ teamId: team._id, points, note: nextNote });
            setNote('');
            setManualScoreDraft(null);
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'Unable to add points.');
        } finally {
            setPending(false);
        }
    }

    async function handleCorrection() {
        setError('');
        const trimmedNote = note.trim();
        if (!trimmedNote) {
            setError('Score note is required.');
            return;
        }

        const value = Number(manualScore);
        if (Number.isNaN(value) || value < 0) {
            setError('Score cannot be negative.');
            return;
        }

        try {
            setPending(true);
            await setScore({ teamId: team._id, score: value, note: trimmedNote });
            setNote('');
            setManualScoreDraft(null);
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'Unable to edit score.');
        } finally {
            setPending(false);
        }
    }

    async function handleManualPoints() {
        setError('');
        const points = Number(manualPoints);
        if (!Number.isInteger(points) || points < 1 || points > 10000) {
            setError('Enter a whole number from 1 to 10000.');
            return;
        }
        if (!note.trim()) {
            setError('Score note is required.');
            return;
        }

        try {
            setPending(true);
            await addManualPoints({ teamId: team._id, points, note: note.trim() });
            setNote('');
            setManualPoints('');
        } catch (submitError) {
            setError(submitError instanceof Error ? submitError.message : 'Unable to add points.');
        } finally {
            setPending(false);
        }
    }

    async function handleDelete() {
        setError('');
        try {
            setPending(true);
            await deleteTeam({ teamId: team._id });
            setDeleteConfirmationOpen(false);
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete team.');
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="brutal-panel flex h-full flex-col p-6">
            <div className="mb-5 flex min-h-20 items-start justify-between gap-4">
                <div>
                    <h3 className="wrap-break-word text-2xl font-black uppercase leading-tight text-zinc-900">
                        {team.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                        {team.members.map((member) => member.name).join(' • ')}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                        Current Score
                    </div>
                    <div className="whitespace-nowrap text-3xl font-black tabular-nums text-zinc-900">
                        {team.score} pts
                    </div>
                </div>
            </div>

            <div className="mb-5 flex items-center justify-between border-y-2 border-black py-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Scoring station
                </span>
                <button
                    type="button"
                    onClick={() => {
                        setError('');
                        setDeleteConfirmationOpen(true);
                    }}
                    disabled={pending}
                    className="border-2 border-black bg-[#ff9e91] px-2 py-1 text-[10px] font-black uppercase text-black hover:bg-[#ff8170] disabled:opacity-50"
                >
                    Delete team
                </button>
            </div>

            <div className="flex flex-1 flex-col gap-5">
                <div>
                    <label className="mb-1 block text-sm font-medium text-zinc-700">
                        Scoring Note
                    </label>
                    <input
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        className="brutal-input min-h-12 w-full px-3 py-3 text-base text-zinc-900 outline-none"
                        placeholder="Direct answer — Round 2, Q1"
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[5, 10, 15].map((points) => (
                        <button
                            key={points}
                            type="button"
                            onClick={() => void handleScore(points)}
                            disabled={pending}
                            className="brutal-button min-h-12 bg-[#d8ff3e] px-2 py-3 text-base font-black text-black disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            +{points}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_minmax(110px,auto)] items-end gap-3 border-t-2 border-dashed border-black pt-5">
                    <div className="flex-1">
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            Manual award points
                        </label>
                        <input
                            value={manualPoints}
                            onChange={(event) => setManualPoints(event.target.value)}
                            type="number"
                            min={1}
                            max={10000}
                            step={1}
                            className="brutal-input min-h-12 w-full px-3 py-3 text-base text-zinc-900 outline-none"
                            placeholder="e.g. 25"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => void handleManualPoints()}
                        disabled={pending}
                        className="brutal-button min-h-12 bg-[#9fc9ff] px-3 py-3 text-xs font-black uppercase text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Add points
                    </button>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_minmax(110px,auto)] items-end gap-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700">
                            Correct score
                        </label>
                        <input
                            value={manualScore}
                            onChange={(event) => setManualScoreDraft(event.target.value)}
                            type="number"
                            min={0}
                            step={1}
                            className="brutal-input min-h-12 w-full px-3 py-3 text-base text-zinc-900 outline-none"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => void handleCorrection()}
                        disabled={pending}
                        className="brutal-button min-h-12 bg-[#ff9e91] px-3 py-3 text-xs font-black uppercase text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Set score
                    </button>
                </div>
            </div>

            {error ? <div className="mt-4 text-sm text-red-600">{error}</div> : null}

            {deleteConfirmationOpen ? (
                <div
                    className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !pending) {
                            setDeleteConfirmationOpen(false);
                        }
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape' && !pending) {
                            setDeleteConfirmationOpen(false);
                        }
                    }}
                >
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={`delete-team-title-${team._id}`}
                        aria-describedby={`delete-team-description-${team._id}`}
                        className="w-full max-w-md border-2 border-black bg-[#fffdf7] p-6 shadow-[6px_6px_0_#171714]"
                    >
                        <h2
                            id={`delete-team-title-${team._id}`}
                            className="text-xl font-black uppercase"
                        >
                            Delete {team.name}?
                        </h2>
                        <p
                            id={`delete-team-description-${team._id}`}
                            className="mt-3 text-sm leading-relaxed text-zinc-700"
                        >
                            This permanently removes the team and its complete score history. This
                            action cannot be undone.
                        </p>
                        {error ? (
                            <p role="alert" className="mt-3 text-sm font-medium text-red-700">
                                {error}
                            </p>
                        ) : null}
                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                autoFocus
                                onClick={() => setDeleteConfirmationOpen(false)}
                                disabled={pending}
                                className="brutal-button min-h-11 border-2 border-black bg-white px-4 py-2 text-sm font-black uppercase disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleDelete()}
                                disabled={pending}
                                className="brutal-button min-h-11 border-2 border-black bg-[#ff9e91] px-4 py-2 text-sm font-black uppercase disabled:opacity-60"
                            >
                                {pending ? 'Deleting...' : 'Delete team'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
