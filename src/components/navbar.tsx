'use client';

import { SignInButton, UserButton, useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const pathname = usePathname();
    const { isLoaded, isSignedIn } = useAuth();
    const { isLoaded: userLoaded, user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
    const adminEmails = (process.env.NEXT_PUBLIC_ADMINEMAILS ?? '')
        .split(',')
        .map((adminEmail) => adminEmail.trim().toLowerCase())
        .filter(Boolean);
    const canAccessAdmin = Boolean(
        isLoaded && isSignedIn && userLoaded && email && adminEmails.includes(email),
    );

    return (
        <header className="border-b-2 border-black bg-[#fffdf7]">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="grid size-9 shrink-0 place-items-center border-2 border-black bg-[#d8ff3e] text-xs font-black shadow-[2px_2px_0_#171714]">
                        Q!
                    </div>
                    <Link
                        href="/standings"
                        className="truncate text-base font-black uppercase text-zinc-900 sm:text-lg"
                    >
                        MogojDholai
                    </Link>
                </div>

                <nav className="flex items-center gap-1 text-xs font-black uppercase sm:gap-2 sm:text-sm">
                    <Link
                        href="/standings"
                        className={
                            pathname === '/standings'
                                ? 'border-2 border-black bg-[#d8ff3e] px-2 py-2 text-black sm:px-3'
                                : 'border-2 border-transparent px-2 py-2 text-zinc-600 hover:border-black hover:bg-white sm:px-3'
                        }
                    >
                        Standings
                    </Link>
                    {canAccessAdmin ? (
                        <Link
                            href="/admin"
                            className={
                                pathname === '/admin'
                                    ? 'border-2 border-black bg-[#9fc9ff] px-2 py-2 text-black sm:px-3'
                                    : 'border-2 border-transparent px-2 py-2 text-zinc-600 hover:border-black hover:bg-white sm:px-3'
                            }
                        >
                            Admin Panel
                        </Link>
                    ) : null}
                </nav>

                <div className="flex shrink-0 items-center gap-2">
                    {!isLoaded ? null : isSignedIn ? (
                        <UserButton />
                    ) : (
                        <SignInButton mode="modal">
                            <button className="brutal-button bg-[#d8ff3e] px-3 py-2 text-xs font-black uppercase text-black sm:px-4 sm:text-sm">
                                Sign in
                            </button>
                        </SignInButton>
                    )}
                </div>
            </div>
        </header>
    );
}
