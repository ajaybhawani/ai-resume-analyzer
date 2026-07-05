import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [isWiping, setIsWiping] = useState(false);
  const [wipeError, setWipeError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files || []);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const openConfirm = () => {
    if (!files.length || isWiping) return;
    setWipeError(null);
    setShowConfirm(true);
  };

  const confirmWipe = async () => {
    if (!files.length || isWiping) return;

    setIsWiping(true);
    setWipeError(null);

    try {
      await Promise.all(files.map((file) => fs.delete(file.path)));
      await kv.flush();
      await loadFiles();
      setShowConfirm(false);
    } catch (err) {
      setWipeError(err instanceof Error ? err.message : "Failed to wipe data");
    } finally {
      setIsWiping(false);
    }
  };

  if (isLoading) {
    return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/images/resume-scan-2.gif"
            className="w-32 sm:w-40"
            alt="loading"
          />
          <p className="text-dark-200">Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover flex items-center justify-center p-4">
        <div className="gradient-border w-full max-w-md">
          <div className="bg-white rounded-2xl p-6 text-center text-red-600 font-medium">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
      <Navbar />
      <section className="flex-1 flex items-center justify-center px-4 py-4 sm:py-6">
        <div className="w-full max-w-xl flex flex-col gap-3">
          <div className="gradient-border">
            <div className="flex flex-col gap-4 bg-white rounded-2xl p-4 sm:p-5">
              {/* Header */}
              <div className="flex flex-col gap-1">
                <h1 className="text-xl sm:text-md font-semibold text-gradient">
                  Manage App Data
                </h1>
                <p className="text-xs sm:text-sm text-dark-200 wrap-break-word">
                  Signed in as{" "}
                  <span className="font-semibold text-gray-800">
                    {auth.user?.username}
                  </span>
                </p>
              </div>

              {/* File list */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">
                    Stored files
                  </p>
                  <span className="text-xs font-medium text-dark-200 bg-gray-100 rounded-full px-2.5 py-0.5">
                    {files.length} {files.length === 1 ? "file" : "files"}
                  </span>
                </div>

                {files.length ? (
                  <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <img
                          src="/images/pdf.png"
                          alt="file"
                          className="size-5 shrink-0 object-contain"
                        />
                        <p className="text-xs sm:text-sm text-gray-700 break-all">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-xl py-6 text-center">
                    <p className="text-sm text-gray-500">No files found.</p>
                    <p className="text-xs text-gray-400">
                      Your storage is already clean.
                    </p>
                  </div>
                )}
              </div>

              {/* Danger zone */}
              <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-4">
                <p className="text-xs text-dark-200">
                  This permanently deletes all uploaded resumes, generated
                  images, and saved feedback. This action cannot be undone.
                </p>

                {wipeError && (
                  <p className="text-red-600 text-xs font-medium">
                    {wipeError}
                  </p>
                )}

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full rounded-full px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={openConfirm}
                  disabled={isWiping || files.length === 0}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  {isWiping ? "Wiping..." : "Wipe App Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !isWiping && setShowConfirm(false)}
          />
          <div className="relative z-10 w-full max-w-sm gradient-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-4 bg-white rounded-2xl p-6">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-1 text-center">
                <h2 className="text-lg font-semibold text-gray-900!">
                  Delete all data?
                </h2>
                <p className="text-sm text-dark-200">
                  This will permanently delete all {files.length}{" "}
                  {files.length === 1 ? "file" : "files"} and clear your saved
                  data. This cannot be undone.
                </p>
              </div>

              {wipeError && (
                <p className="text-red-600 text-xs text-center font-medium">
                  {wipeError}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  disabled={isWiping}
                  className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmWipe}
                  disabled={isWiping}
                  className="flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-white bg-linear-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWiping ? "Wiping..." : "Yes, delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default WipeApp;
