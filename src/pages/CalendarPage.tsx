import { useState, useEffect } from "react";
import { GenerationBatch, Idea } from "../types";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Video } from "lucide-react";

export function CalendarPage() {
  const [scheduledIdeas, setScheduledIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("creatorcore_batches");
    if (saved) {
      try {
        const batches: GenerationBatch[] = JSON.parse(saved);
        const ideas = batches.flatMap(b => b.ideas).filter(i => i.scheduledDate);
        ideas.sort((a, b) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime());
        setScheduledIdeas(ideas);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-indigo-500" />
            Content Calendar
          </h1>
          <p className="text-zinc-400 mt-2">Manage your scheduled posts and publishing timeline.</p>
        </header>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          {scheduledIdeas.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              No ideas scheduled yet. Go to Generate to schedule some!
            </div>
          ) : (
            <div className="divide-y divide-zinc-800">
              {scheduledIdeas.map((idea) => (
                <div key={idea.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:bg-zinc-800/50 transition-colors">
                  <div className="flex-shrink-0 w-32 text-center">
                    <div className="text-2xl font-bold text-indigo-400">
                      {format(parseISO(idea.scheduledDate!), "MMM d")}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium mt-1">
                      {format(parseISO(idea.scheduledDate!), "EEEE")}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] uppercase tracking-wider rounded font-medium border border-zinc-700">
                        {idea.platform}
                      </span>
                      {idea.script && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-medium border border-emerald-500/20">
                          <Video className="w-3 h-3" /> Script Ready
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-zinc-200 truncate">{idea.title}</h3>
                    <p className="text-sm text-zinc-400 truncate mt-1">{idea.hook}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
