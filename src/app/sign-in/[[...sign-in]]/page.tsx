import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-4xl items-center justify-center px-4 py-12">
            <SignIn routing="hash" />
        </main>
    );
}
