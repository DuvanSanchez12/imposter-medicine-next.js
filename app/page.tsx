/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { socket } from "@/app/lib/socket"; // Asegúrate que esta ruta sea correcta
import { useRouter } from "next/navigation"; // Correcto para App Router

export default function Home() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Escuchamos la respuesta del servidor para movernos a la sala
    socket.on("room-created", ({ roomCode }) => {
      router.push(`/room/${roomCode}?name=${encodeURIComponent(name)}`);
    });

    socket.on("room-joined", ({ roomCode }) => {
      router.push(`/room/${roomCode}?name=${encodeURIComponent(name)}`);
    });

    socket.on("error-message", (msg) => {
      setError(msg);
    });

    return () => {
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("error-message");
    };
  }, [name, router]);

  const handleCreate = () => {
    if (name.trim()) {
      socket.emit("create-room", { name });
    } else {
      setError("Debes ingresar un nombre de especialista.");
    }
  };

  const handleJoin = () => {
    if (name.trim() && roomCode.trim()) {
      socket.emit("join-room", { name, roomCode: roomCode.toUpperCase() });
    } else {
      setError("Falta nombre o código de sala.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-emerald-400 font-mono p-4">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-8 rounded-xl border-t-4 border-emerald-500 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">EL IMPOSTOR MÉDICO</h1>
          <p className="text-xs text-emerald-700 uppercase tracking-widest">HAY UN INFILTRADO EN EL CUERPO MÉDICO</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-emerald-600 ml-1">IDENTIFICACIÓN DEL PERSONAL</label>
            <input 
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-600"
              placeholder="Ej: Dr. House..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleCreate} 
              className="bg-emerald-700 p-3 rounded hover:bg-emerald-600 text-white font-bold transition-all border border-emerald-500/30 active:scale-95"
            >
              CREAR SALA
            </button>
            <div className="flex flex-col gap-2">
              <input 
                className="w-full bg-slate-800 border border-slate-700 p-3 rounded outline-none uppercase placeholder:text-slate-600 focus:border-emerald-500 transition-colors"
                placeholder="CÓDIGO"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
              />
              <button 
                onClick={handleJoin} 
                className="bg-slate-700 p-3 rounded hover:bg-slate-600 text-white font-bold transition-all border border-slate-500/30 active:scale-95"
              >
                UNIRSE
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900 p-2 rounded text-center">
            <p className="text-red-500 text-xs">{error}</p>
          </div>
        )}

        <footer className="text-center pt-4">
          <p className="text-[10px] text-emerald-900 uppercase">Sistema de salas médicas</p>
        </footer>
      </div>
    </main>
  );
}