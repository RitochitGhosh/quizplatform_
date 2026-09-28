const organizers = [
    'Koutav Hazra',
    'Pranoyjit Bose',
    'Tanay Roy',
    'Tamojit Mandal',
    'Ritochit Ghosh',
    'Rupam Mullick',
];

export function SiteFooter() {
    return (
        <footer className="mt-auto border-t-2 border-black bg-[#fffdf7]">
            <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto] md:items-end lg:px-8">
                <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                        Presented by
                    </div>
                    <h2 className="mt-2 text-2xl font-black uppercase">MogojDholai</h2>
                    <div className="mt-4 flex max-w-3xl flex-wrap gap-x-2 gap-y-1 text-sm font-medium text-zinc-700">
                        {organizers.map((organizer, index) => (
                            <span key={organizer}>
                                {organizer}
                                {index < organizers.length - 1 ? (
                                    <span className="ml-2 text-zinc-400">·</span>
                                ) : null}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="border-t border-dashed border-zinc-400 pt-4 text-sm font-medium text-zinc-600 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                    Developed by{' '}
                    <a
                        href="https://www.ritochit.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-black text-black underline decoration-2 underline-offset-4 hover:bg-[#d8ff3e]"
                    >
                        Ritochit Ghosh
                    </a>
                </div>
            </div>
        </footer>
    );
}
