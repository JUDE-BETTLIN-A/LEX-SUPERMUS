"use client";

import { useState } from "react";

type ResumeDownloadFormat = "pdf" | "docx";

export default function ResumeDownloadControl({
  onDownload,
}: {
  onDownload: (format: ResumeDownloadFormat) => void | Promise<void>;
}) {
  const [format, setFormat] = useState<ResumeDownloadFormat>("pdf");
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      await onDownload(format);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="resume-download-control">
      <label className="sr-only" htmlFor="resume-download-format">Resume file format</label>
      <select
        id="resume-download-format"
        value={format}
        onChange={(event) =>
          setFormat(event.currentTarget.value === "docx" ? "docx" : "pdf")
        }
        disabled={downloading}
      >
        <option value="pdf">PDF (.pdf)</option>
        <option value="docx">Word (.docx)</option>
      </select>
      <button type="button" className="primary" onClick={handleDownload} disabled={downloading}>
        {downloading ? "Preparing…" : `Download ${format === "pdf" ? "PDF" : "Word"}`}
      </button>
    </div>
  );
}
