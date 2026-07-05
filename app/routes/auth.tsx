import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind AI | Auth" },
  {
    name: "description",
    content: "Log into your account",
  },
];
const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, next]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center p-4">
      <div className="gradient-border shadow-lg w-full max-w-md">
        <section className="flex flex-col gap-6 bg-white rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-3 items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl primary-gradient text-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.6}
                stroke="currentColor"
                className="size-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl! sm:text-3xl! leading-tight">
                Welcome to Resumind AI
              </h1>
              <h2 className="text-sm! sm:text-base! text-dark-200">
                Log in to continue your job journey
              </h2>
            </div>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    <p>Log In</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
