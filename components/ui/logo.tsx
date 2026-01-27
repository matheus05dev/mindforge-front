"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  width?: number
  height?: number
  showText?: boolean
  collapsed?: boolean
}

export function Logo({
  className,
  width = 50,
  height = 50,
  showText = true,
  collapsed = false,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex items-center justify-center shrink-0" style={{ width, height }}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Base da Bigorna */}
          <path 
            d="M20 75C20 72 25 70 35 70H65C75 70 80 72 80 75V80H20V75Z" 
            fill="currentColor"
            className="text-zinc-800 dark:text-zinc-200"
          />
          <path 
            d="M35 70L30 55H70L65 70H35Z" 
            fill="currentColor"
            className="text-zinc-700 dark:text-zinc-300"
          />
          
          {/* Parte superior (Mente/Cérebro) */}
          <path 
            d="M30 55C30 45 35 40 50 40C65 40 70 45 70 55H30Z" 
            fill="currentColor"
            className="text-primary"
          />
          
          {/* Estrutura do Cérebro (Linhas) */}
          <path 
            d="M50 15C32 15 22 28 22 45C22 48 23 51 25 53" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinecap="round"
            className="text-primary"
          />
          <path 
            d="M50 15C68 15 78 28 78 45C78 48 77 51 75 53" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinecap="round"
            className="text-primary"
          />
          <path 
            d="M50 15V40" 
            stroke="currentColor" 
            strokeWidth="5" 
            strokeLinecap="round"
            className="text-primary/70"
          />
          
          {/* Detalhes de brilho */}
          <circle cx="40" cy="30" r="3" fill="white" fillOpacity="0.4" />
          <circle cx="60" cy="30" r="3" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
      
      {showText && !collapsed && (
        <span className="text-2xl font-bold tracking-tight text-foreground transition-all duration-300">
          Mind<span className="text-primary">Forge</span>
        </span>
      )}
    </div>
  )
}
