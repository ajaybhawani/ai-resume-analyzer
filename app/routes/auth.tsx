import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Auth" },
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
      <div className="gradient-border shadow-lg w-full max-w-sm sm:max-w-md">
        <section className="flex flex-col gap-5 sm:gap-6 bg-white rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-1.5 items-center text-center">
            <h1 className="text-2xl sm:text-3xl">Welcome to Resumind</h1>
            <h2 className="text-sm sm:text-base">
              Log In to Continue Your Job Journey
            </h2>
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
