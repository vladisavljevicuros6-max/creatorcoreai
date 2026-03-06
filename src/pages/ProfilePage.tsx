import { useState, useEffect } from "react";
import { User, Mail, Shield, LogOut, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data from a "real" account system
    const savedUser = localStorage.getItem("creatorcore_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("creatorcore_user");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
          <User className="w-8 h-8 text-zinc-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Not Signed In</h2>
        <p className="text-zinc-400 mt-2 max-w-xs">
          Please sign in to access your account and saved generations.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-zinc-400 mt-2">Manage your profile and platform preferences.</p>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
        >
          <div className="p-8 flex flex-col md:flex-row items-center gap-8 border-b border-zinc-800">
            <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center text-3xl font-bold text-white border-4 border-zinc-800 shadow-xl">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">{user.name}</h2>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 mt-2 text-zinc-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Pro Account
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-red-500/10 hover:text-red-500 text-zinc-400 rounded-lg transition-all border border-zinc-700"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Usage Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black p-4 rounded-xl border border-zinc-800">
                  <div className="text-2xl font-bold text-white">124</div>
                  <div className="text-xs text-zinc-500 mt-1">Ideas Generated</div>
                </div>
                <div className="bg-black p-4 rounded-xl border border-zinc-800">
                  <div className="text-2xl font-bold text-white">12</div>
                  <div className="text-xs text-zinc-500 mt-1">Scripts Written</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">API Configuration</h3>
              <div className="bg-black p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Gemini API Key</div>
                  <div className="text-xs text-zinc-500 mt-1">••••••••••••••••</div>
                </div>
                <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded border border-emerald-500/20">
                  ACTIVE
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
