/* eslint-disable @typescript-eslint/no-explicit-any */
import { socket } from "@/app/lib/socket";

interface GameViewProps {
  data: { role: string; word: string };
  isHost: boolean;
  currentTurnId: string | null;
  players: any[];
  roomCode: string;
  onTerminate: () => void;
}

export default function GameView({ data, isHost, currentTurnId, players, roomCode, onTerminate }: GameViewProps) {
  const isImpostor = data.role === "impostor";
  const myId = socket.id;
  const isMyTurn = currentTurnId === myId;
  
  const currentPlayerName = players.find(p => p.id === currentTurnId)?.name || "Esperando...";

  const handleNextTurn = () => {
    socket.emit("advance-turn", roomCode);
  };

  return (
    <div className="min-h-screen bg-black text-emerald-400 font-mono p-4 flex flex-col items-center justify-center">
      {/* INDICADOR DE TURNO SUPERIOR */}
      <div className="mb-6 w-full max-w-md bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-xl text-center">
        <p className="text-[10px] uppercase tracking-widest text-emerald-700 mb-1">Estado de la Red</p>
        <p className={`text-xl font-black uppercase ${isMyTurn ? 'text-white animate-pulse' : 'text-emerald-500'}`}>
          {isMyTurn ? "🚨 TU TURNO: INTERVIENE" : `TURNO DE: DR. ${currentPlayerName}`}
        </p>
      </div>

      <div className={`w-full max-w-md border ${isImpostor ? 'border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.15)]' : 'border-emerald-900 shadow-[0_0_50px_rgba(16,185,129,0.1)]'} bg-slate-900/50 p-8 rounded-2xl text-center relative overflow-hidden`}>
        <h2 className="text-xs uppercase tracking-[0.4em] text-emerald-700 mb-6 font-black italic">Expediente Asignado</h2>

        <div className={`text-4xl font-black mb-8 tracking-tighter ${isImpostor ? "text-red-600 animate-pulse" : "text-emerald-400"}`}>
          {isImpostor ? "IMPOSTOR" : "DOCTOR"}
        </div>

        {/* RECUADRO DE PALABRA/PISTA */}
        <div className={`${isImpostor ? 'bg-red-950/20 border-red-900/50' : 'bg-emerald-950/20 border-emerald-900/50'} border py-8 rounded-xl mb-8`}>
          <p className={`text-[9px] uppercase mb-2 font-black ${isImpostor ? 'text-red-800' : 'text-emerald-800'}`}>
            {isImpostor ? "Pista de Infiltración" : "Palabra Secreta"}
          </p>
          <p className="text-3xl font-bold uppercase tracking-[0.15em] text-white px-2">
            {data.word}
          </p>
        </div>

        {/* BOTÓN DE AVANZAR TURNO */}
        {isMyTurn ? (
          <button 
            onClick={handleNextTurn}
            className={`w-full ${isImpostor ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-500 hover:bg-white'} text-black font-black py-4 rounded-lg uppercase text-sm tracking-tighter transition-colors mb-4 shadow-lg`}
          >
            Finalizar mi intervención →
          </button>
        ) : (
          <div className={`py-4 mb-4 border rounded-lg text-[10px] uppercase font-bold ${isImpostor ? 'border-red-900/30 text-red-900' : 'border-emerald-900/30 text-emerald-900'}`}>
            {isImpostor ? "Escucha atentamente para no ser descubierto..." : "Escucha al colega para detectar al intruso..."}
          </div>
        )}

        {isHost && (
          <button onClick={onTerminate} className="w-full border border-red-900/50 text-red-900 hover:text-red-500 py-3 rounded-lg text-[10px] font-black uppercase transition-all">
            Cerrar Sesión (Finalizar)
          </button>
        )}
      </div>
    </div>
  );
}