/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { socket } from "@/app/lib/socket";

export const useRoom = (code: string, name: string | null) => {
  const [players, setPlayers] = useState<any[]>([]);
  // CORRECCIÓN: Añadido setLogs
  const [logs, setLogs] = useState<{ msg: string; id: number }[]>([]);
  const [settings, setSettings] = useState({ maxPlayers: 4, timePerPerson: 60 });
  const [gameState, setGameState] = useState<{ started: boolean; data: any }>({
    started: false,
    data: null,
  });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);
  const hasJoined = useRef(false);

  useEffect(() => {
    if (!name || !code) return;
    if (!socket.connected) socket.connect();

    socket.on("room-joined", (data) => {
      setPlayers(data.currentPlayers);
      setSettings(data.settings);
    });

    socket.on("update-players", setPlayers);

    socket.on("settings-updated", (newSettings) => {
      setSettings(newSettings);
    });

    // --- NUEVO: Escuchar mensajes del sistema (Logs) ---
    socket.on("system-message", (data) => {
      setLogs((prev) => [
        { msg: data.text, id: Date.now() },
        ...prev.slice(0, 4), // Mantenemos solo los últimos 5 mensajes
      ]);
    });

    socket.on("game-started", (data) => {
      setGameState({ started: false, data });
      setCountdown(5);
    });

    socket.on("next-turn", (playerId: string) => {
      setCurrentTurn(playerId);
    });

    socket.on("game-ended", () => {
      setGameState({ started: false, data: null });
      setCountdown(null);
      setCurrentTurn(null);
    });

    if (!hasJoined.current) {
      socket.emit("join-room", { name, roomCode: code });
      hasJoined.current = true;
    }

    return () => {
      socket.off("room-joined");
      socket.off("update-players");
      socket.off("settings-updated");
      socket.off("system-message"); // Limpiar listener
      socket.off("game-started");
      socket.off("next-turn");
      socket.off("game-ended");
    };
  }, [code, name]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    setGameState((prev) => ({ ...prev, started: true }));
    setCountdown(null);
  }, [countdown]);

  return { players, logs, settings, gameState, countdown, currentTurn };
};