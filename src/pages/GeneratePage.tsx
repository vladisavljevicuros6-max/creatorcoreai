import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { generateIdeas, generateScript } from "../services/gemini";
import { Idea, GenerationBatch, GenerationRequest } from "../types";
import { v4 as uuidv4 } from "uuid";
import { Loader2, Video, Image as ImageIcon, CalendarPlus, Check, Copy } from "lucide-react";
import { cn } from "../lib/utils";

export function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState<GenerationBatch[]>([]);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);
  const [scriptLoading, setScriptLoading] = useState<string | null>(null);

  const [req, setReq] = useState<GenerationRequest>({
    platform: "YouTube",
    channel: "",
    description: "",
    template: "viral",
  });

  useEffect(() => {
    const saved = localStorage.getItem("creatorcore_batches");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBatches(parsed);
        if (parsed.length > 0) setActiveBatchId(parsed[0].id);
      } catch (e) {
        console.error("Failed to parse batches", e);
      }
    }
  }, []);

  const saveBatches = (newBatches: GenerationBatch[]) => {
    setBatches(newBatches);
    localStorage.setItem("creatorcore_batches", JSON.stringify(newBatches));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const ideas = await generateIdeas(req);
      const newBatch: GenerationBatch = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        request: req,
        ideas,
      };
      const updatedBatches = [newBatch, ...batches];
      saveBatches(updatedBatches);
      setActiveBatchId(newBatch.id);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "An error occurred during generation. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScript = async (batchId: string, ideaId: string) => {
    const batch = batches.find((b) => b.id === batchId);
    const idea = batch?.ideas.find((i) => i.id === ideaId);
    if (!batch || !idea) return;

    setScriptLoading(ideaId);
    try {
      const script = await generateScript(idea);
      const updatedBatches = batches.map((b) => {
        if (b.id !== batchId) return b;
        return {
          ...b,
          ideas: b.ideas.map((i) => (i.id === ideaId ? { ...i, script } : i)),
        };
      });
      saveBatches(updatedBatches);
    } catch (err: any) {
      alert(`Failed to generate script: ${err.message}`);
    } finally {
      setScriptLoading(null);
    }
  };

  const handleGenerateThumbnail = async (batchId: string, ideaId: string) => {
    const batch = batches.find((b) => b.id === batchId);
    const idea = batch?.ideas.find((i) => i.id === ideaId);
    if (!batch || !idea) return;

    const prompt = `Create a highly engaging, clickbait-style YouTube thumbnail for a video titled: "${idea.title}". The video is about: "${idea.explanation}". Make it vibrant, high contrast, and visually striking.`;

    try {
      await navigator.clipboard.writeText(prompt);
      alert("Thumbnail prompt copied to clipboard! Redirecting to Gemini to generate it...");
      window.open("https://gemini.google.com/", "_blank");
    } catch (err: any) {
      alert(`Failed to copy prompt: ${err.message}`);
    }
  };

  const handleSchedule = (batchId: string, ideaId: string) => {
    const date = prompt("Enter date to schedule (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
    if (!date) return;
    
    const updatedBatches = batches.map((b) => {
      if (b.id !== batchId) return b;
      return {
        ...b,
        ideas: b.ideas.map((i) => (i.id === ideaId ? { ...i, scheduledDate: date } : i)),
      };
    });
    saveBatches(updatedBatches);
    alert("Scheduled! Check the Calendar tab.");
  };

  const activeBatch = batches.find((b) => b.id === activeBatchId);

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Idea Generator</h1>
            <p className="text-zinc-400 mt-1 text-sm md:text-base">Leverage Gemini 3.1 Pro to generate hyper-personalized content ideas.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Platform</label>
                <select
                  value={req.platform}
                  onChange={(e) => setReq({ ...req, platform: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="Twitter/X">Twitter/X</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Twitch">Twitch</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Channel/Brand Name</label>
                <input
                  type="text"
                  required
                  value={req.channel}
                  onChange={(e) => setReq({ ...req, channel: e.target.value })}
                  placeholder="e.g., @TechGuru"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Niche & Description</label>
                <textarea
                  required
                  rows={4}
                  value={req.description}
                  onChange={(e) => setReq({ ...req, description: e.target.value })}
                  placeholder="e.g., Fitness for busy professionals, focusing on 15-minute home workouts."
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Style</label>
                <select
                  value={req.template}
                  onChange={(e) => setReq({ ...req, template: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="viral">Viral-Focused (High Energy)</option>
                  <option value="educational">Educational (Deep Dive)</option>
                  <option value="entertainment">Entertainment (Story-driven)</option>
                  <option value="balanced">Balanced</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : "Generate Ideas"}
              </button>
              {error && <p className="text-red-400 text-xs mt-2 bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}
            </form>

            {/* History List */}
            {batches.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl">
                <h3 className="text-sm font-semibold text-zinc-300 mb-3 px-2">Recent Generations</h3>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {batches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setActiveBatchId(b.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        activeBatchId === b.id ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                      )}
                    >
                      <div className="font-medium truncate">{b.request.channel || "Untitled"}</div>
                      <div className="text-xs opacity-70 truncate">{b.request.platform} • {new Date(b.createdAt).toLocaleDateString()}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8 space-y-6">
            {loading && !activeBatch && (
              <div className="h-64 flex items-center justify-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                <div className="flex flex-col items-center gap-3 text-zinc-400">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="text-sm">Analyzing niche and generating ideas...</p>
                </div>
              </div>
            )}

            {activeBatch && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-zinc-200">
                    Results for {activeBatch.request.channel}
                  </h2>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full border border-zinc-700">
                    {activeBatch.request.platform}
                  </span>
                </div>

                <div className="grid gap-6">
                  {activeBatch.ideas.map((idea, idx) => (
                    <div key={idea.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-semibold text-white leading-tight">
                            <span className="text-indigo-400 mr-2">{idx + 1}.</span>
                            {idea.title}
                          </h3>
                          <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-500/20 whitespace-nowrap">
                            🔥 {idea.viralityScore}/100
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <span className="text-zinc-500 font-medium uppercase tracking-wider text-xs">Hook</span>
                            <p className="text-zinc-300">{idea.hook}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-500 font-medium uppercase tracking-wider text-xs">Why it works</span>
                            <p className="text-zinc-300">{idea.explanation}</p>
                          </div>
                        </div>

                        <div className="space-y-1 text-sm">
                          <span className="text-zinc-500 font-medium uppercase tracking-wider text-xs">Production Tips</span>
                          <p className="text-zinc-300">{idea.productionTips}</p>
                        </div>

                        <div className="space-y-1 text-sm">
                          <span className="text-zinc-500 font-medium uppercase tracking-wider text-xs">SEO & Tags</span>
                          <div className="bg-black p-3 rounded-lg border border-zinc-800">
                            <p className="text-zinc-300"><span className="text-zinc-500">Title:</span> {idea.seoTitle}</p>
                            <p className="text-zinc-300 mt-1"><span className="text-zinc-500">Desc:</span> {idea.seoDescription}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {idea.hashtags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded text-xs border border-zinc-700">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Generated Assets */}
                        {idea.script && (
                          <div className="mt-4 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                            <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                              <Video className="w-4 h-4" /> Generated Script
                            </h4>
                            <div className="text-sm text-zinc-300 whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar">
                              {idea.script}
                            </div>
                          </div>
                        )}

                        {idea.thumbnailUrl && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                              <ImageIcon className="w-4 h-4" /> Generated Thumbnail
                            </h4>
                            <img src={idea.thumbnailUrl} alt="Thumbnail" className="w-full max-w-md rounded-xl border border-zinc-800 shadow-lg" />
                          </div>
                        )}
                      </div>

                      {/* Actions Footer */}
                      <div className="bg-black px-6 py-3 border-t border-zinc-800 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleGenerateScript(activeBatch.id, idea.id)}
                          disabled={scriptLoading === idea.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm rounded-lg transition-colors border border-zinc-700 disabled:opacity-50"
                        >
                          {scriptLoading === idea.id ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                          ) : (
                            <><Video className="w-4 h-4 text-indigo-400" /> {idea.script ? "Regenerate Script" : "Write Script"}</>
                          )}
                        </button>
                        <button
                          onClick={() => handleGenerateThumbnail(activeBatch.id, idea.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm rounded-lg transition-colors border border-zinc-700"
                        >
                          <ImageIcon className="w-4 h-4 text-emerald-400" />
                          {idea.thumbnailUrl ? "Regenerate Thumbnail" : "Gen Thumbnail"}
                        </button>
                        <button
                          onClick={() => handleSchedule(activeBatch.id, idea.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm rounded-lg transition-colors border border-zinc-700 ml-auto"
                        >
                          {idea.scheduledDate ? (
                            <><Check className="w-4 h-4 text-emerald-500" /> Scheduled: {idea.scheduledDate}</>
                          ) : (
                            <><CalendarPlus className="w-4 h-4 text-zinc-400" /> Schedule</>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {!loading && !activeBatch && (
              <div className="h-64 flex items-center justify-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 bg-zinc-900/10">
                Fill out the form to generate ideas.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
