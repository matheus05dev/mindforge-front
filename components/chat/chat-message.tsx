"use client";

import type { ChatMessage } from "@/lib/types";
import { User, Sparkles, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  // Simple markdown rendering
  const renderContent = (content: string) => {
    return content
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-base font-semibold mt-3 mb-1">$1</h3>'
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>'
      )
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="bg-background/50 rounded-md p-3 my-2 overflow-x-auto font-mono text-xs"><code>$2</code></pre>'
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-background/50 px-1 py-0.5 rounded text-xs font-mono">$1</code>'
      )
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /^- \[ \] (.*$)/gim,
        '<div class="flex items-center gap-2 my-1"><input type="checkbox" disabled class="rounded" /><span>$1</span></div>'
      )
      .replace(
        /^- \[x\] (.*$)/gim,
        '<div class="flex items-center gap-2 my-1"><input type="checkbox" checked disabled class="rounded" /><span class="line-through text-muted-foreground">$1</span></div>'
      )
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc my-0.5">$1</li>')
      .replace(
        /^\d+\. (.*$)/gim,
        '<li class="ml-4 list-decimal my-0.5">$1</li>'
      )
      .replace(/\n/g, "<br />");
  };

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
            "rounded-lg px-4 py-3 text-sm",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {isUser ? (
            <div>
              {message.attachments && message.attachments.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs opacity-80 mb-1">Anexos:</p>
                  {message.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="text-xs bg-black/10 rounded px-2 py-1 mb-1"
                    >
                      📎 {attachment.name}
                    </div>
                  ))}
                </div>
              )}
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: message.content.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          ) : (
            <div
              className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
              dangerouslySetInnerHTML={{
                __html: renderContent(message.content),
              }}
            />
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
