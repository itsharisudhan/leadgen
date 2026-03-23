"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Lead } from "@/lib/types";

const templates = ["Website Pitch", "Social Media Pitch", "Full Digital Presence"];

export default function NewProposalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadIdFromUrl = searchParams.get("leadId");
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadId, setLeadId] = useState("");
  const [template, setTemplate] = useState(templates[0]);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        const list = data.leads ?? [];
        setLeads(list);
        const firstId = leadIdFromUrl || list[0]?.id || "";
        setLeadId(firstId);
      });
  }, [leadIdFromUrl]);

  useEffect(() => {
    const selected = leads.find((l) => l.id === leadId);
    if (!selected) return;
    setContent(
      `Hi ${selected.name} team,\n\nI noticed your business can gain more local visibility with a stronger digital presence.\n\nI can help you with ${template.toLowerCase()} tailored for ${selected.name}.\n\nWould you like a quick 15-minute call this week?\n\nThanks,\nYour Name`,
    );
  }, [leadId, template, leads]);

  async function create() {
    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id: leadId, template, content }),
    });
    if (res.ok) router.push("/dashboard/proposals");
  }

  async function exportPdf() {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = pageWidth / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, canvas.height * ratio);
    pdf.save("proposal.pdf");
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Create Proposal</h1>
        <select value={leadId} onChange={(e) => setLeadId(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700">
          {leads.map((lead) => (
            <option key={lead.id} value={lead.id}>
              {lead.name}
            </option>
          ))}
        </select>
        <select value={template} onChange={(e) => setTemplate(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900 border border-slate-700">
          {templates.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="w-full p-3 rounded bg-slate-900 border border-slate-700" />
        <div className="flex gap-2">
          <button onClick={create} className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500">
            Save Proposal
          </button>
          <button onClick={exportPdf} className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700">
            Export PDF
          </button>
        </div>
      </div>

      <div ref={previewRef} className="rounded-xl border border-slate-800 p-6 bg-white text-black whitespace-pre-wrap">
        {content || "Proposal preview"}
      </div>
    </div>
  );
}
