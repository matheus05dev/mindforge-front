import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-950 p-4 relative overflow-hidden transition-colors duration-500">
      {/* Elementos decorativos de fundo - Orbes de luz de ALTA intensidade e contraste */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Orbes Primários (Cores do MindForge) */}
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-blue-600/30 dark:bg-blue-900/50 blur-[130px] rounded-full animate-pulse transition-all duration-1000" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[70%] h-[70%] bg-violet-600/30 dark:bg-violet-900/50 blur-[130px] rounded-full animate-pulse transition-all duration-1000" style={{ animationDelay: '1s' }} />
        
        {/* Destaque Central para destacar o Card no Light Mode */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-100/30 dark:bg-transparent blur-[150px] rounded-full" />
        
        {/* Orbes secundários para preencher o "vazio" */}
        <div className="absolute top-1/4 right-0 w-[40%] h-[40%] bg-blue-400/25 dark:bg-blue-800/20 blur-[110px] rounded-full animate-bounce" style={{ animationDuration: '15s' }} />
        <div className="absolute bottom-1/4 left-0 w-[40%] h-[40%] bg-violet-400/25 dark:bg-violet-800/20 blur-[110px] rounded-full animate-bounce" style={{ animationDuration: '18s', animationDelay: '3s' }} />
        
        {/* Glow sutil atrás do card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 dark:bg-primary/20 blur-[80px] rounded-full" />
      </div>
      
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-700 relative z-10">
        {children}
      </div>
    </div>
  );
}
