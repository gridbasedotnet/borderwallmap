"use client";

import { useState, useRef } from "react";
import { Upload, Mail, CheckCircle, AlertTriangle, Film } from "lucide-react";

const MAX_FILE_SIZE_GB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_GB * 1024 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function SubmitVideoForm() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE_GB} GB.`);
      setFile(null);
      return;
    }

    setError(null);
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !email) return;

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("email", email);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      setSuccess(true);
      setFile(null);
      setEmail("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <CheckCircle size={48} className="text-canyon-500 mx-auto mb-4" />
        <h3 className="text-white text-xl font-semibold mb-2">
          Video submitted!
        </h3>
        <p className="text-taupe-400 text-sm max-w-md mx-auto mb-6">
          Thank you for your contribution. Our team will review your footage and
          reach out at the email you provided if your video is selected or
          if we have any questions.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-3 min-h-[44px] bg-canyon-600 hover:bg-canyon-500 active:bg-canyon-500 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Submit Another Video
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label
          htmlFor="submit-email"
          className="block text-sm font-medium text-taupe-300 mb-1.5"
        >
          Email address <span className="text-canyon-500">*</span>
        </label>
        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe-500"
          />
          <input
            id="submit-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-10 pr-4 py-3 bg-taupe-950 border border-taupe-800 rounded-lg text-white placeholder:text-taupe-600 focus:outline-none focus:border-canyon-600 focus:ring-1 focus:ring-canyon-600 transition-colors text-base sm:text-sm"
          />
        </div>
        <p className="mt-1 text-xs text-taupe-500">
          We&apos;ll use this to notify you if your video is selected or if we
          have questions.
        </p>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-taupe-300 mb-1.5">
          Video file <span className="text-canyon-500">*</span>
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-taupe-800 hover:border-taupe-600 rounded-lg p-6 text-center cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <Film size={24} className="text-canyon-500" />
              <div className="text-left">
                <p className="text-white text-sm font-medium">{file.name}</p>
                <p className="text-taupe-500 text-xs">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
          ) : (
            <>
              <Upload size={32} className="text-taupe-500 mx-auto mb-2" />
              <p className="text-taupe-300 text-sm">
                Click to select a video file
              </p>
              <p className="text-taupe-600 text-xs mt-1">
                MOV, MP4, or other video formats up to {MAX_FILE_SIZE_GB} GB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-canyon-900/30 border border-canyon-800/50 rounded-lg">
          <AlertTriangle size={16} className="text-canyon-400 mt-0.5 shrink-0" />
          <p className="text-canyon-300 text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!file || !email || uploading}
        className="w-full py-3.5 min-h-[48px] bg-canyon-600 hover:bg-canyon-500 active:bg-canyon-500 disabled:bg-taupe-800 disabled:text-taupe-500 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Uploading{progress > 0 ? ` (${progress}%)` : "..."}
          </>
        ) : (
          <>
            <Upload size={16} />
            Submit Video
          </>
        )}
      </button>
    </form>
  );
}
