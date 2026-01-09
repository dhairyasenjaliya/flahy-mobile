"use client";

import { AssistantCloud, AssistantRuntimeProvider, Thread } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";

// Note: You might want to create a full UI with ThreadList if needed, 
// but for the mobile WebView, a single focused Thread is often better.

export default function ChatPage() {
  const cloud = new AssistantCloud({
    baseUrl: process.env.NEXT_PUBLIC_ASSISTANT_BASE_URL!,
    anonymous: true, // For production with users, replace with auth token logic
  });

  const runtime = useChatRuntime({
    api: "/api/chat", // You'll need to implement this route or point to your AI backend
    cloud,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="h-screen w-full bg-white">
        <Thread />
      </div>
    </AssistantRuntimeProvider>
  );
}
