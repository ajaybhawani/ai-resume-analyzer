import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResume, setLoadingResume] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoadingResume(true);
        const resumes = (await kv.list("resume:*", true)) as KVItem[];
        const parsedResumes = resumes?.map(
          (resume) => JSON.parse(resume?.value) as Resume,
        );
        setResumes(parsedResumes || []);
        setLoadingResume(false);
      } catch (error) {
      } finally {
        setLoadingResume(false);
      }
    };
    loadResume();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-6 sm:py-8 lg:py-10">
          <h1>Track Your Application & Resume Ratings</h1>
          {!loadingResume && resumes?.length === 0 ? (
            <h2>No resume found. Upload your first resume to get feedback</h2>
          ) : (
            <h2>Review Your Submissions and check AI-powered feedback.</h2>
          )}
        </div>
        {loadingResume && (
          <div className="flex flex-col items-center justify-center">
            <img
              src="/images/resume-scan-2.gif"
              className="w-40 sm:w-50"
              alt="loading"
            />
          </div>
        )}
        {!loadingResume && resumes?.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {!loadingResume && resumes?.length === 0 && (
          <div className="flex flex-col mt-10 items-center justify-center gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
