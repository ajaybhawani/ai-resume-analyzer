import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    loadFiles();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto p-4 sm:p-6">
      <p className="text-sm sm:text-base break-words">
        Authenticated as: {auth.user?.username}
      </p>
      <div className="font-semibold">Existing files:</div>
      <div className="flex flex-col gap-2 sm:gap-4">
        {files.map((file) => (
          <div key={file.id} className="flex flex-row gap-4">
            <p className="break-all">{file.name}</p>
          </div>
        ))}
      </div>
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer w-full sm:w-auto"
          onClick={() => handleDelete()}
        >
          Wipe App Data
        </button>
      </div>
    </div>
  );
};

export default WipeApp;
