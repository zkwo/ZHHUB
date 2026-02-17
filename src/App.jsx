import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Data dari screenshot kamu
const SUPABASE_URL = "https://vaclisxkdltzjzgfxhcm.supabase.co";
const SUPABASE_KEY = "sb_publishable_ydSqM_lfbpr9ZmQtE608wQ_zvkf3XoM"; // Pastikan copy full key-nya ya
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function App() {
  const [script, setScript] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawMode, setRawMode] = useState(false);
  const [rawContent, setRawContent] = useState("");

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/raw/")) {
      const scriptId = path.split("/")[2];
      fetchRawScript(scriptId);
    }
  }, []);

  async function fetchRawScript(scriptId) {
    const { data, error } = await supabase.from("scripts").select("content").eq("id", scriptId).single();
    if (data) {
      setRawMode(true);
      setRawContent(data.content);
    } else {
      document.body.innerText = "Script not found or 404";
    }
  }

  async function handleCreate() {
    if (!script) return alert("Paste script dulu!");
    setLoading(true);
    const randomId = Math.random().toString(36).substring(2, 10);
    
    const { error } = await supabase.from("scripts").insert([{ id: randomId, content: script }]);
    
    if (!error) {
      setId(randomId);
    } else {
      alert("Error: Pastikan tabel 'scripts' sudah dibuat di Supabase!");
      console.error(error);
    }
    setLoading(false);
  }

  if (rawMode) {
    return (
      <pre style={{ margin: 0, padding: '20px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#000', color: '#fff' }}>
        {rawContent}
      </pre>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-400 flex flex-col items-center justify-center p-5 font-sans">
      {/* Glow Background Effect */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full"></div>
      </div>

      <h1 className="text-5xl font-black tracking-tighter text-white mb-2 italic">ZHENSHUB</h1>
      <p className="text-[10px] tracking-[0.3em] text-zinc-600 mb-10 uppercase font-bold">Simple • Secure • Permanent</p>

      <div className="w-full max-w-xl bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="-- paste your script here..."
          className="w-full h-72 bg-black/40 border border-white/5 rounded-2xl p-5 text-sm text-zinc-300 focus:outline-none focus:border-white/20 transition-all resize-none font-mono mb-6"
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="btn-cling w-full py-4 bg-white text-black font-black rounded-2xl uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] relative overflow-hidden"
        >
          {loading ? "PROCESSING..." : "CREATE LINK"}
        </button>

        {id && (
          <div className="mt-10 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
              <p className="text-[9px] text-zinc-500 mb-2 font-bold tracking-widest">RAW URL</p>
              <p className="text-sm text-white break-all font-mono">{window.location.origin}/raw/{id}</p>
            </div>
            
            <div className="p-5 bg-black/40 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
              <p className="text-[9px] text-zinc-500 mb-2 font-bold tracking-widest">LOADSTRING</p>
              <p className="text-[10px] text-zinc-400 break-all font-mono leading-relaxed">
                loadstring(game:HttpGet("{window.location.origin}/raw/{id}"))()
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-12 text-[9px] text-zinc-700 tracking-[0.4em] font-bold">
        ZHHUB.VERCEL.APP • 2026
      </footer>

      <style>{`
        .btn-cling::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.6), transparent);
          transform: rotate(45deg);
          transition: 0.6s;
        }
        .btn-cling:hover::after {
          left: 120%;
        }
      `}</style>
    </div>
  );
}
