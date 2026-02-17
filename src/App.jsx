import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Database Configuration
const SUPABASE_URL = "https://vaclisxkdltzjzgfxhcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_ydSqM_lfbpr9ZmQtE608wQ_zvkf3XoM"; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  // --- CONFIGURATION AREA ---
  const CONFIG = {
    logoUrl: "https://i.ibb.co/example/logo.png", 
    supportUrl: "https://support.com",             
    siteName: "ZHENSHUB",
    adminPassword: "ZH@#_&-()*'?;:~`÷$°£℅©2026" // PASSWORD ADMIN KAMU
  };

  const [script, setScript] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("home"); // home, raw, admin
  const [rawContent, setRawContent] = useState("");
  
  // Admin States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState("");
  const [allScripts, setAllScripts] = useState([]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/raw/")) {
      const scriptId = path.split("/")[2];
      fetchRawScript(scriptId);
    } else if (path === "/admin") {
      setView("admin");
    }
  }, []);

  async function fetchRawScript(scriptId) {
    const { data } = await supabase.from("scripts").select("content").eq("id", scriptId).single();
    if (data) {
      setRawContent(data.content);
      setView("raw");
    }
  }

  async function handleCreate() {
    if (!script) return alert("Paste script first!");
    setLoading(true);
    const randomId = Math.random().toString(36).substring(2, 10);
    const { error } = await supabase.from("scripts").insert([{ id: randomId, content: script }]);
    if (!error) setId(randomId);
    else alert("Database Error!");
    setLoading(false);
  }

  // --- ADMIN LOGIC ---
  async function fetchAllScripts() {
    setLoading(true);
    const { data, error } = await supabase.from("scripts").select("*").order("created_at", { ascending: false });
    if (!error) setAllScripts(data);
    setLoading(false);
  }

  function handleAdminLogin() {
    if (adminPassInput === CONFIG.adminPassword) {
      setIsAdminLoggedIn(true);
      fetchAllScripts();
    } else {
      alert("Wrong Password!");
    }
  }

  async function deleteScript(targetId) {
    if (confirm(`Hapus permanen link ${targetId}?`)) {
      const { error } = await supabase.from("scripts").delete().eq("id", targetId);
      if (!error) {
        setAllScripts(allScripts.filter(s => s.id !== targetId));
      } else {
        alert("Gagal menghapus!");
      }
    }
  }

  // --- UI: ADMIN PANEL ---
  if (view === "admin") {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-300 flex flex-col items-center p-6 font-sans">
        {!isAdminLoggedIn ? (
          <div className="mt-20 w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl text-center">
            <h1 className="text-2xl font-black text-white mb-6 italic tracking-tighter">ADMIN ACCESS</h1>
            <input 
              type="password"
              placeholder="Enter Session Password..."
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-center mb-6 focus:outline-none focus:border-white/30 transition-all"
              value={adminPassInput}
              onChange={(e) => setAdminPassInput(e.target.value)}
            />
            <button 
              onClick={handleAdminLogin}
              className="btn-cling w-full py-4 bg-white text-black font-bold rounded-xl tracking-widest uppercase text-xs"
            >
              LOGIN TO PANEL
            </button>
          </div>
        ) : (
          <div className="w-full max-w-4xl animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">{CONFIG.siteName} ADMIN</h1>
                <p className="text-[10px] text-zinc-600 tracking-[0.3em] font-bold">MANAGE ALL PERMANENT LINKS</p>
              </div>
              <button onClick={() => window.location.href = "/"} className="text-[10px] bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10">EXIT</button>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md">
              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white/5 sticky top-0 backdrop-blur-xl">
                    <tr>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">ID Link</th>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Preview Content</th>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allScripts.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="p-5 font-mono text-xs text-white">{s.id}</td>
                        <td className="p-5">
                          <p className="text-[10px] text-zinc-500 truncate max-w-[200px] font-mono">{s.content}</p>
                        </td>
                        <td className="p-5 text-right">
                          <button 
                            onClick={() => deleteScript(s.id)}
                            className="bg-red-500/10 text-red-500 text-[9px] font-bold px-4 py-2 rounded-lg border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {allScripts.length === 0 && <div className="p-20 text-center text-zinc-600 uppercase tracking-widest text-xs">No data found</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- UI: FAKE ACCESS DENIED ---
  if (view === "raw") {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-400 flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
        <pre className="absolute opacity-0 pointer-events-none select-none overflow-hidden h-0 w-0">{rawContent}</pre>
        <div className="relative z-10 w-full max-w-md text-center">
            <div className="bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="mb-8 relative inline-block">
                    <div className="w-20 h-20 border-2 border-red-500/20 rounded-2xl flex items-center justify-center bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <svg className="w-10 h-10 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m0 0v2m0-2h2m-2 0h-2m7-7a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">Access Denied</h2>
                <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                    <span className="text-[10px] text-red-500 font-bold tracking-[0.2em] uppercase">Error 403 • Restricted</span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed mb-8">This resource is encrypted and requires proper authorization.</p>
                <a href={CONFIG.supportUrl} className="btn-cling block w-full py-4 bg-white text-black text-center font-black rounded-2xl tracking-[0.2em] text-xs shadow-[0_10px_20px_rgba(255,255,255,0.05)]">GET SUPPORT</a>
            </div>
            <p className="mt-10 text-[9px] text-zinc-700 tracking-[0.5em] font-bold uppercase italic">hidden by {CONFIG.siteName}</p>
        </div>
      </div>
    );
  }

  // --- UI: HOME PAGE ---
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 flex flex-col items-center justify-center p-6 font-sans">
      <h1 className="text-6xl font-black italic text-white mb-2 tracking-tighter">{CONFIG.siteName}</h1>
      <p className="text-[10px] tracking-[0.5em] text-zinc-700 mb-12 font-bold uppercase italic underline decoration-zinc-800 underline-offset-8">Advanced Script Vault</p>

      <div className="w-full max-w-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="-- paste your script here..."
          className="w-full h-80 bg-black/40 border border-white/5 rounded-3xl p-6 text-sm text-zinc-300 focus:outline-none focus:border-white/20 transition-all resize-none font-mono mb-8"
        />

        <button onClick={handleCreate} disabled={loading} className="btn-cling w-full py-5 bg-white text-black font-black rounded-2xl tracking-[0.3em] transition-all relative overflow-hidden active:scale-[0.98] shadow-[0_20px_40px_rgba(255,255,255,0.05)] text-sm">
          {loading ? "SAVING..." : "CREATE PERMANENT LINK"}
        </button>

        {id && (
          <div className="mt-10 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
              <p className="text-[9px] text-zinc-600 mb-2 font-bold tracking-widest uppercase">Raw Endpoint</p>
              <p className="text-sm text-zinc-300 break-all font-mono">{window.location.origin}/raw/{id}</p>
            </div>
            <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
              <p className="text-[9px] text-zinc-600 mb-2 font-bold tracking-widest uppercase">Loadstring Executor</p>
              <p className="text-[10px] text-zinc-500 break-all leading-relaxed font-mono italic">
                loadstring(game:HttpGet("{window.location.origin}/raw/{id}"))()
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 text-[9px] text-zinc-800 tracking-[0.4em] font-bold flex flex-col items-center gap-2">
        <span>{CONFIG.siteName} SYSTEM V2.6</span>
        <div className="h-[1px] w-12 bg-zinc-900"></div>
        <span>PROTECTED BY ZHHUB CLOUD</span>
      </footer>

      <style>{`
        .btn-cling::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.5), transparent);
          transform: rotate(45deg);
          transition: 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-cling:hover::after { left: 120%; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
