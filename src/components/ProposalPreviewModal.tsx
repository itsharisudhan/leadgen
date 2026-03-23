"use client";

import { X, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { SearchResult } from "@/lib/types";

interface Props {
  result: SearchResult;
  onClose: () => void;
}

export function ProposalPreviewModal({ result, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const missingWeb = !result.hasWebsite;
  const missingSocial = !result.hasSocialMedia;

  const demoCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Website Concept for ${result.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white font-sans">
    <nav class="p-6 border-b border-slate-800 flex justify-between items-center">
        <div class="text-xl font-bold">${result.name}</div>
        <div class="hidden md:flex gap-6 text-sm text-slate-400">
            <a href="#">Home</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
        </div>
    </nav>
    <main class="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 class="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Elevating ${result.name}
        </h1>
        <p class="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            Providing premium services in ${result.formattedAddress.split(",")[0] || "your area"}. 
            Now with a modern digital experience.
        </p>
        <div class="mt-10 flex gap-4 justify-center">
            <button class="px-8 py-3 bg-indigo-600 rounded-full font-medium hover:bg-indigo-500 transition">
                Book a Consultation
            </button>
            <button class="px-8 py-3 border border-slate-700 rounded-full font-medium hover:bg-slate-900 transition">
                View Portfolio
            </button>
        </div>
    </main>
</body>
</html>`;

  const copyCode = () => {
    navigator.clipboard.writeText(demoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-lg font-semibold">Cold Proposal Preview</h2>
            <p className="text-xs text-slate-400">Personalized pitch for {result.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <h3 className="text-sm font-medium text-indigo-400 mb-2">Analysis Findings</h3>
              <ul className="text-xs space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  {missingWeb ? <Check size={14} className="text-emerald-400" /> : <X size={14} className="text-rose-400" />}
                  No professional website detected
                </li>
                <li className="flex items-center gap-2">
                  {missingSocial ? <Check size={14} className="text-emerald-400" /> : <X size={14} className="text-rose-400" />}
                  Weak social media presence
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Landing Page Mockup Code</h3>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 overflow-auto max-h-[300px]">
                {demoCode}
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Live Preview
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Interactive</span>
            </h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden h-[400px] bg-white">
              <iframe
                title="Proposal Preview"
                srcDoc={demoCode}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition">
            Close
          </button>
          <button className="px-4 py-2 text-sm bg-indigo-600 rounded-lg hover:bg-indigo-500 transition flex items-center gap-2">
            Send Cold Email <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
