"use client";

import {
  CheckCircle2,
  Download,
  File,
  LoaderCircle,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { DragEvent, useRef, useState } from "react";
import { GetQrlyBanner } from "@/components/GetQrlyBanner";
import type { Tool } from "@/lib/tools";

type ConverterTool = Pick<
  Tool,
  | "slug"
  | "accept"
  | "acceptLabel"
  | "multiple"
  | "minimumFiles"
  | "buttonLabel"
  | "available"
>;

type ConversionResult = {
  fileId: string;
  fileName: string;
  downloadUrl: string;
  expiresInSeconds: number;
  quota: Quota;
};

type Quota = {
  limit: number;
  remaining: number;
  resetAt: string;
};

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiBaseUrl =
  configuredApiUrl === undefined
    ? process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:4000"
    : configuredApiUrl.replace(/\/$/, "");

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function Converter({ tool }: { tool: ConverterTool }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");
  const [quota, setQuota] = useState<Quota | null>(null);

  async function refreshQuota() {
    try {
      const response = await fetch(`${apiBaseUrl}/api/convert/quota`, {
        cache: "no-store",
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data.quota) setQuota(data.quota);
    } catch {
      // Quota is also returned with conversion responses.
    }
  }

  function selectFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;
    setError("");
    setResult(null);
    setFiles(
      tool.multiple
        ? Array.from(selectedFiles).slice(0, 20)
        : Array.from(selectedFiles).slice(0, 1),
    );
    void refreshQuota();
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFiles(event.dataTransfer.files);
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
    setResult(null);
  }

  async function convert() {
    const minimumFiles = tool.minimumFiles || 1;
    if (files.length < minimumFiles) {
      setError(
        minimumFiles > 1
          ? `Please select at least ${minimumFiles} files.`
          : "Please select a file.",
      );
      return;
    }

    if (!tool.available) {
      setError("This converter is being prepared and will be available soon.");
      return;
    }

    const tooLarge = files.find((file) => file.size > 25 * 1024 * 1024);
    if (tooLarge) {
      setError(`${tooLarge.name} is larger than the 25MB limit.`);
      return;
    }

    setIsConverting(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append(tool.multiple ? "files" : "file", file);
      }

      const response = await fetch(`${apiBaseUrl}/api/convert/${tool.slug}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.quota) setQuota(data.quota);
      if (!response.ok) {
        setError(data.error || "Conversion failed.");
        return;
      }
      setResult(data);
    } catch (conversionError) {
      setError(
        conversionError instanceof Error
          ? conversionError.message
          : "Conversion failed. Please try again.",
      );
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <div className="converter-card">
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={tool.accept}
        multiple={tool.multiple}
        onChange={(event) => selectFiles(event.target.files)}
      />

      <div
        className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <span className="upload-icon">
          <UploadCloud size={34} />
        </span>
        <h2>Drop your {tool.multiple ? "files" : "file"} here</h2>
        <p>or click to browse from your device</p>
        <span className="file-rule">
          {tool.acceptLabel} · Maximum 25MB per file
        </span>
      </div>

      {files.length > 0 && (
        <div className="selected-files" aria-live="polite">
          {files.map((file, index) => (
            <div className="selected-file" key={`${file.name}-${file.lastModified}`}>
              <span className="selected-file-icon">
                <File size={19} />
              </span>
              <span className="selected-file-info">
                <strong>{file.name}</strong>
                <small>{formatFileSize(file.size)}</small>
              </span>
              <button
                type="button"
                className="icon-button"
                onClick={() => removeFile(index)}
                aria-label={`Remove ${file.name}`}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {quota && files.length > 0 && (
        <div
          className={`quota-message ${quota.remaining === 0 ? "is-empty" : ""}`}
          aria-live="polite"
        >
          {quota.remaining === 0
            ? "You reached today’s free conversion limit. Please try again tomorrow."
            : `You have ${quota.remaining} free conversion${quota.remaining === 1 ? "" : "s"} left today.`}
        </div>
      )}

      {result ? (
        <>
          <div className="result-box">
            <CheckCircle2 size={27} />
            <div>
              <strong>Your file is ready</strong>
              <span>Download it before it is deleted in one hour.</span>
            </div>
            <a
              href={`${apiBaseUrl}${result.downloadUrl}`}
              className="button button-success"
            >
              <Download size={18} />
              Download
            </a>
          </div>
          <GetQrlyBanner compact />
        </>
      ) : (
        <button
          className="button button-primary convert-button"
          type="button"
          disabled={
            files.length === 0 || isConverting || quota?.remaining === 0
          }
          onClick={convert}
        >
          {isConverting ? (
            <>
              <LoaderCircle className="spin" size={20} />
              Converting…
            </>
          ) : (
            tool.buttonLabel
          )}
        </button>
      )}

      <p className="privacy-note">
        Files are encrypted in transit and automatically deleted after one hour.
      </p>
    </div>
  );
}
