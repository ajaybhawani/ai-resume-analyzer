import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selected = acceptedFiles[0] || null;
      setFile(selected);
      onFileSelect?.(selected);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 20 * 1024 * 1024,
  });

  return (
    <div className="gradient-border w-full">
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/images/pdf.png" alt="PDF" className="size-10" />
              <div>
                <p className="text-sm text-gray-700 font-medium truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                className="text-sm cursor-pointer p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  onFileSelect?.(null);
                }}
              >
                <img src="/icons/cross.svg" alt="remove" className="size-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center mb-2">
                <img
                  src="/icons/info.svg"
                  alt="upload"
                  className="size-8 sm:size-10"
                />
              </div>
              <p className="text-base sm:text-lg text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-base sm:text-lg text-gray-500">PDF (max 20 MB)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
