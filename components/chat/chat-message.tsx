"use client";

import type { ChatMessage } from "@/lib/types";
import { User, Sparkles, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "rounded-md p-2 shrink-0",
          isUser ? "bg-muted" : "bg-primary/10"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary" />
        )}
      </div>

      <div
        className={cn("flex flex-col gap-1 max-w-[80%]", isUser && "items-end")}
      >
        <div
          className={cn(
            "rounded-lg px-4 py-3 text-sm overflow-hidden w-full",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {isUser ? (
            <div>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {message.attachments.map((attachment, index) => (
                    <div key={index} className="space-y-1">
                      {attachment.type.startsWith("image/") && attachment.url ? (
                         <div className="relative h-32 w-48 rounded-md overflow-hidden border border-black/10 bg-black/5">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="object-cover w-full h-full"
                           />
                         </div>
                      ) : (
                        <div
                          className="text-xs bg-black/20 rounded px-2 py-1 mb-1 inline-block"
                        >
                          📎 {attachment.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="whitespace-pre-line">{message.content}</div>
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {!isUser && (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ThumbsUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ThumbsDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
