import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { GeneratePage } from "./pages/GeneratePage";
import { CalendarPage } from "./pages/CalendarPage";
import { ProfilePage } from "./pages/ProfilePage";
import { GDPRBanner } from "./components/GDPRBanner";
import React, { useState, useEffect } from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export default function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("creatorcore_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = { name: "Uros Vladisavljevic", email: "vladisavljevicuros6@gmail.com" };
    localStorage.setItem("creatorcore_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <ShieldCheck className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome to CreatorCore</h1>
            <p className="text-zinc-400">Sign in to start generating viral content ideas.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-zinc-400">Email Address</label>
              <input 
                type="email" 
                required
                defaultValue="vladisavljevicuros6@gmail.com"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-zinc-400">Password</label>
              <input 
                type="password" 
                required
                defaultValue="password123"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>
          <p className="text-xs text-zinc-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<GeneratePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <GDPRBanner />
        </main>
      </div>
    </BrowserRouter>
  );
}
