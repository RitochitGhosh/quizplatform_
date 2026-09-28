import Link from 'next/link';

export default function HomePage() {
    return (
        <main className="flex flex-1 flex-col overflow-hidden">
            <section className="relative mx-auto grid min-h-[560px] w-full max-w-screen-2xl flex-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-10 lg:py-20">
                <div className="relative z-10 max-w-4xl">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-black uppercase tracking-[0.2em] sm:text-sm">
                        <span className="border-2 border-black bg-[#d8ff3e] px-2 py-1">
                            Inquizitive presents
                        </span>
                        <span className="text-zinc-600">Intra-college quiz competition</span>
                    </div>

                    <h1 className="mt-8 font-black uppercase leading-[0.76]">
                        <span className="block text-7xl sm:text-9xl lg:text-[10rem]">Mogoj</span>
                        <span className="mt-3 block text-6xl sm:text-8xl lg:text-[9rem] text-[#d71920]">
                            Dholai
                        </span>
                    </h1>

                    <div className="mt-8 flex flex-col gap-6 border-t-2 border-black pt-5 sm:flex-row sm:items-end sm:justify-between">
                        <p className="max-w-md text-lg font-semibold leading-snug text-zinc-700 sm:text-xl">
                            Bring your curiosity. Back your answers. Climb the live leaderboard.
                        </p>
                        <Link
                            href="/standings"
                            className="brutal-button inline-flex min-h-14 w-full items-center justify-center gap-4 bg-[#d8ff3e] px-6 py-4 text-sm font-black uppercase text-black sm:w-auto"
                        >
                            <span>View live standings</span>
                            <span aria-hidden="true" className="text-xl">
                                ↗
                            </span>
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-2 border-y-2 border-black sm:grid-cols-3">
                        <div className="border-b-2 border-r-2 border-black py-4 pr-3 sm:border-b-0 sm:pr-5">
                            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d71920]">
                                Date
                            </div>
                            <div className="mt-1 text-sm font-black uppercase sm:text-base">
                                29 September 2026
                            </div>
                        </div>
                        <div className="border-b-2 border-black py-4 pl-3 sm:border-b-0 sm:px-5 sm:border-r-2">
                            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d71920]">
                                Starts
                            </div>
                            <div className="mt-1 text-sm font-black uppercase sm:text-base">
                                11:30 AM
                            </div>
                        </div>
                        <div className="col-span-2 py-4 sm:col-span-1 sm:pl-5">
                            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d71920]">
                                Venue
                            </div>
                            <div className="mt-1 text-sm font-black uppercase sm:text-base">
                                Auditorium, Academic Building
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="relative mx-auto w-full max-w-110 lg:mr-6">
                    <div className="absolute -right-4 -top-4 z-10 grid size-24 rotate-6 place-items-center rounded-full border-2 border-black bg-[#d8ff3e] text-center text-[10px] font-black uppercase leading-tight shadow-[3px_3px_0_#171714] sm:-right-7 sm:-top-6 sm:size-28">
                        No entry
                        <br />
                        fee
                    </div>
                    <div className="relative border-[3px] border-black bg-[#fffdf7] p-5 shadow-[9px_9px_0_#171714] sm:p-7">
                        <div className="flex items-center justify-between border-b-2 border-black pb-3">
                            <span className="text-xs font-black uppercase tracking-[0.16em]">
                                Event brief
                            </span>
                            <span className="border-2 border-black bg-[#9fc9ff] px-2 py-1 text-[10px] font-black uppercase">
                                2026
                            </span>
                        </div>

                        <div className="py-7 sm:py-9">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d71920]">
                                Team strength
                            </div>
                            <p className="mt-2 text-3xl font-black uppercase leading-none sm:text-4xl">
                                Two minds.
                                <br />
                                <span className="text-zinc-500">One team.</span>
                            </p>
                            <p className="mt-4 max-w-xs text-sm font-medium leading-relaxed text-zinc-600">
                                Register as a pair and take on the college quiz. Your score updates
                                live as the rounds unfold.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 divide-x-2 divide-black border-y-2 border-black py-4">
                            <div className="pr-2">
                                <div className="text-[9px] font-black uppercase tracking-wide text-zinc-500">
                                    Format
                                </div>
                                <div className="mt-1 text-xs font-black uppercase sm:text-sm">
                                    Pairs
                                </div>
                            </div>
                            <div className="px-2">
                                <div className="text-[9px] font-black uppercase tracking-wide text-zinc-500">
                                    Entry
                                </div>
                                <div className="mt-1 text-xs font-black uppercase sm:text-sm">
                                    Free
                                </div>
                            </div>
                            <div className="pl-2">
                                <div className="text-[9px] font-black uppercase tracking-wide text-zinc-500">
                                    Scores
                                </div>
                                <div className="mt-1 text-xs font-black uppercase sm:text-sm">
                                    Live
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                            <p className="max-w-52.5 text-xs font-bold uppercase leading-relaxed text-zinc-600">
                                Think sharp.
                                <br />
                                Play fair. Make it count.
                            </p>
                            <Link
                                href="/standings"
                                aria-label="Open MogojDholai standings"
                                className="grid size-12 shrink-0 place-items-center border-2 border-black bg-[#d71920] text-2xl font-black text-white shadow-[3px_3px_0_#171714] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#171714]"
                            >
                                ↗
                            </Link>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.18em] text-zinc-600">
                        <span>MogojDholai</span>
                        <span>29.09.2026 · 11:30 AM</span>
                    </div>
                </aside>
            </section>
        </main>
    );
}
