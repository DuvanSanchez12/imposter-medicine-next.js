/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { socket } from "@/app/lib/socket";
import { useRoom } from "@/app/hooks/useRoomSocket";

import GameView from "@/app/components/GameView";
import LobbyView from "@/app/components/LobbyView";

export default function RoomPage() {
  const { code } = useParams() as { code: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const name = searchParams.get("name") || (typeof window !== "undefined" ? sessionStorage.getItem("player_name") : null);
  const { players, logs, settings, gameState, countdown, currentTurn } = useRoom(code, name);

  if (!name) {
    router.push("/");
    return null;
  }
    const handleUpdateSettings = (newSetting: any) => {
    const updatedSettings = { ...settings, ...newSetting };
    socket.emit("update-settings", { 
        roomCode: code, 
        settings: updatedSettings 
    });
    };
    const isHost = players.find((p) => p.id === socket.id)?.role === "host";

  if (countdown !== null) {
    return (
      <div className="min-h-screen bg-black text-emerald-400 font-mono flex flex-col items-center justify-center">
        <div className="text-[10px] tracking-[0.5em] mb-4 animate-pulse uppercase">Iniciando Protocolo en</div>
        <div className="text-9xl font-black text-white italic">{countdown}</div>
      </div>
    );
  }

  if (gameState.started && gameState.data) {
    return (
      <GameView 
        data={gameState.data} 
        isHost={isHost} 
        currentTurnId={currentTurn}
        players={players}
        roomCode={code}
        onTerminate={() => socket.emit("stop-game", code)} 
      />
    );
  }

  return (
    <LobbyView 
      code={code}
      players={players}
      logs={logs}
      settings={settings}
      isHost={isHost}
      onUpdateSettings={handleUpdateSettings}
      onStart={() => socket.emit("start-game", code)}
    />
  );
}