/* eslint-disable @typescript-eslint/no-explicit-any */

interface LobbyProps {
  code: string;
  players: any[];
  logs: any[];
  settings: {
    maxPlayers: number;
    timePerPerson: number;
  };
  isHost: boolean;
  onUpdateSettings: (s: any) => void;
  onStart: () => void;
}

export default function LobbyView({ code, players, logs, settings, isHost, onUpdateSettings, onStart }: LobbyProps) {
  
  // Manejador para el slider de capacidad
  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSettings({ maxPlayers: parseInt(e.target.value, 10) });
  };

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl border-b border-emerald-900 pb-4 mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xs text-emerald-600 uppercase tracking-widest font-black italic">Impostor con medicina</h1>
          <h1 className="text-[9px] text-white/40 uppercase tracking-[0.3em]">Hecho por Duvan</h1>
          <p className="text-2xl font-bold mt-1 uppercase">Unidad: {code}</p>
        </div>
        <div className="text-[10px] bg-emerald-950 px-3 py-1 border border-emerald-500/50 rounded text-emerald-300 uppercase font-black">
          {players.length} / {settings.maxPlayers} DOCTORES
        </div>
      </header>

      {/* FEED DE ACTIVIDAD */}
      <div className="w-full max-w-4xl mb-6 bg-emerald-950/10 border border-emerald-900/30 p-2 rounded">
        <div className="flex gap-2 mb-1 text-emerald-900 uppercase font-black text-[8px]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-800 animate-pulse" />
          Live Network Status
        </div>
        <div className="space-y-1">
          {logs.length > 0 ? (
            logs.map((log) => (
              <p key={log.id} className="text-[10px] text-emerald-700">
                {`> ${log.msg}`}
              </p>
            ))
          ) : (
            <p className="text-[10px] text-emerald-900 opacity-50 italic">{`> Sincronizando datos de red...`}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* EQUIPO MÉDICO */}
        <div className="bg-slate-900/40 border border-emerald-900 p-6 rounded-lg shadow-2xl">
          <h2 className="text-emerald-500 border-b border-emerald-900 mb-4 pb-2 uppercase text-xs tracking-[0.2em] font-black">Equipo Médico</h2>
          <ul className="space-y-3">
            {players.map((p, index) => (
              <li key={`${p.id}-${index}`} className="flex items-center justify-between bg-slate-800/20 p-3 rounded border border-emerald-900/20">
                <span className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${p.role === "host" ? "bg-yellow-400 shadow-[0_0_8px_#facc15]" : "bg-emerald-500"}`} />
                  <span className="text-sm uppercase font-bold">DR. {p.name}</span>
                </span>
                <span className="text-[9px] text-emerald-900 font-black italic">{p.role === "host" ? "CHIEF" : "STAFF"}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AJUSTES */}
        <div className="bg-slate-900/40 border border-emerald-900 p-6 rounded-lg shadow-2xl">
          <h2 className="text-emerald-500 border-b border-emerald-900 mb-4 pb-2 uppercase text-xs tracking-[0.2em] font-black">Ajustes</h2>
          <div className="space-y-8 mt-4">
            <div>
              <div className="flex justify-between mb-2 text-[10px] uppercase font-black">
                <span className="text-emerald-800">Capacidad</span>
                <span className="text-emerald-400">{settings.maxPlayers} Médicos</span>
              </div>
              <input
                type="range" min="3" max="12"
                disabled={!isHost}
                value={settings.maxPlayers}
                onChange={handleCapacityChange}
                className="w-full accent-emerald-500 cursor-pointer disabled:opacity-20"
              />
            </div>

            {isHost ? (
              <button
                onClick={onStart}
                disabled={players.length < 3}
                className="w-full bg-emerald-600 hover:bg-emerald-400 text-black font-black py-4 rounded transition-all uppercase text-xs tracking-[0.2em] disabled:bg-slate-800 disabled:text-slate-600"
              >
                {players.length < 3 ? `Esperando Personal (${players.length}/3)` : "Iniciar Intervención"}
              </button>
            ) : (
              <div className="text-center py-4 border border-emerald-900/30 rounded-lg">
                <p className="text-[10px] text-emerald-900 animate-pulse font-black uppercase tracking-widest">
                  Esperando Orden del Jefe
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}