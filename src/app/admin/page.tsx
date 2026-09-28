'use client';

import dynamic from 'next/dynamic';

const AdminView = dynamic(() => import('./admin-view'), {
    ssr: false,
    loading: () => (
        <div className="mx-auto max-w-6xl px-4 py-10 text-zinc-600">Loading admin...</div>
    ),
});

export default function AdminPage() {
    return <AdminView />;
}
