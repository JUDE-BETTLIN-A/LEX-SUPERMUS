import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { jsPDF } from "jspdf";

export type ResumeTemplateId =
  | "classic"
  | "modern"
  | "compact"
  | "minimal"
  | "executive"
  | "litigation"
  | "corporate"
  | "academic";

export type ResumeSection = {
  heading: string;
  entries: string[];
  bullets?: boolean;
};

export type ResumeDocumentData = {
  fullName: string;
  headline: string;
  contactInfo: string[];
  sections: ResumeSection[];
};

export const RESUME_TEMPLATES: {
  id: ResumeTemplateId;
  name: string;
  description: string;
}[] = [
  { id: "classic", name: "Classic ATS", description: "Traditional and formal with clear section headings." },
  { id: "modern", name: "Modern ATS", description: "Clean navy styling with a confident visual hierarchy." },
  { id: "compact", name: "Compact ATS", description: "Tighter spacing for a concise, information-rich resume." },
  { id: "minimal", name: "Minimal", description: "Simple typography and generous whitespace." },
  { id: "executive", name: "Executive", description: "Polished format for experienced professionals." },
  { id: "litigation", name: "Litigation", description: "Emphasizes court practice, drafting, and advocacy." },
  { id: "corporate", name: "Corporate Legal", description: "Highlights contracts, compliance, and advisory work." },
  { id: "academic", name: "Academic & Research", description: "Prioritizes research, publications, and education." },
];

const TEMPLATE_COLORS: Record<ResumeTemplateId, string> = {
  classic: "172337",
  modern: "315D83",
  compact: "293747",
  minimal: "3D4852",
  executive: "253B53",
  litigation: "70422E",
  corporate: "17665F",
  academic: "58477D",
};

function getSafeFileName(name: string): string {
  const safeName = name.trim().replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-|-$/g, "");
  return safeName || "professional";
}

function createPdf(data: ResumeDocumentData, template: ResumeTemplateId): jsPDF {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const compact = template === "compact";
  const margin = compact ? 38 : 48;
  const contentWidth = pageWidth - margin * 2;
  const accent = TEMPLATE_COLORS[template];
  let y = margin;

  const setFont = (bold: boolean, size: number, color = "#222222") => {
    const family = template === "classic" || template === "academic" ? "times" : "helvetica";
    pdf.setFont(family, bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(color);
  };

  const writeWrappedText = (
    text: string,
    size: number,
    bold = false,
    indent = 0,
    color = "#222222"
  ) => {
    setFont(bold, size, color);
    const lines = pdf.splitTextToSize(text, contentWidth - indent) as string[];
    const lineHeight = size * (compact ? 1.2 : 1.35);
    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin + indent, y);
      y += lineHeight;
    });
  };

  writeWrappedText(data.fullName, compact ? 20 : 24, true, 0, `#${accent}`);
  if (data.headline) writeWrappedText(data.headline, 12, true, 0, `#${accent}`);
  if (data.contactInfo.length) {
    writeWrappedText(data.contactInfo.join(" | "), 9, false, 0, "#555555");
  }
  y += 6;

  data.sections.forEach((section) => {
    if (!section.entries.length) return;
    if (y + 28 > pageHeight - margin) {
      pdf.addPage();
      y = margin;
    }
    y += compact ? 7 : 11;
    writeWrappedText(section.heading.toUpperCase(), compact ? 10 : 11, true, 0, `#${accent}`);
    pdf.setDrawColor(`#${accent}`);
    pdf.setLineWidth(0.6);
    pdf.line(margin, y - 3, pageWidth - margin, y - 3);

    section.entries.forEach((entry) => {
      entry.split(/\r?\n/).filter(Boolean).forEach((line) => {
        const text = section.bullets ? `- ${line}` : line;
        writeWrappedText(text, compact ? 9 : 10, false, section.bullets ? 8 : 0);
      });
    });
  });

  pdf.setProperties({ title: `${data.fullName} - Resume`, subject: "Professional resume" });
  return pdf;
}

export function downloadResumePdf(data: ResumeDocumentData, template: ResumeTemplateId): void {
  createPdf(data, template).save(`${getSafeFileName(data.fullName)}-resume.pdf`);
}

export async function downloadResumeDocx(
  data: ResumeDocumentData,
  template: ResumeTemplateId
): Promise<void> {
  const accent = TEMPLATE_COLORS[template];
  const paragraphs: Paragraph[] = [
    new Paragraph({
      text: data.fullName,
      heading: HeadingLevel.TITLE,
      spacing: { after: 80 },
      run: { color: accent, bold: true },
    }),
  ];

  if (data.headline) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.headline, bold: true, color: accent })],
        spacing: { after: 80 },
      })
    );
  }
  if (data.contactInfo.length) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: data.contactInfo.join(" | "), size: 18, color: "555555" })],
        spacing: { after: 200 },
      })
    );
  }

  data.sections.forEach((section) => {
    if (!section.entries.length) return;
    paragraphs.push(
      new Paragraph({
        text: section.heading.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 180, after: 70 },
        run: { color: accent, bold: true },
      })
    );
    section.entries.forEach((entry) => {
      entry.split(/\r?\n/).filter(Boolean).forEach((line) => {
        paragraphs.push(
          new Paragraph({
            text: line,
            bullet: section.bullets ? { level: 0 } : undefined,
            spacing: { after: 70 },
          })
        );
      });
    });
  });

  const document = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 850, right: 900, bottom: 850, left: 900 },
          },
        },
        children: paragraphs,
      },
    ],
  });
  const blob = await Packer.toBlob(document);
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");
  link.href = url;
  link.download = `${getSafeFileName(data.fullName)}-resume.docx`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
