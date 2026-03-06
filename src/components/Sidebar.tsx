import { NavLink } from "react-router";
import { LayoutDashboard, Calendar, User } from "lucide-react";
import { cn } from "../lib/utils";

export function Sidebar() {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Generate" },
    { to: "/calendar", icon: Calendar, label: "Calendar" },
    { to: "/profile", icon: User, label: "Account" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-black border-r border-zinc-800 h-screen sticky top-0 flex-col">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden">
            <img 
              src="/logo.png" 
              alt="CreatorCore Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-black"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>';
              }}
            />
          </div>
          <h1 className="font-bold text-xl text-white tracking-tight">CreatorCore</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">
          Powered by Gemini 3.1 Pro
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 px-6 py-3 flex justify-around items-center z-50">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 text-[10px] font-medium transition-colors",
                isActive ? "text-white" : "text-zinc-500"
              )
            }
          >
            <link.icon className="w-6 h-6" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
