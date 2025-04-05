"use client";

import { RefreshCcw } from "lucide-react";
import { useState } from "react";

import { RedditThreadViewer } from "@/components/reddit-thread-viewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Home() {
  const [leftUrl, setLeftUrl] = useState("");
  const [rightUrl, setRightUrl] = useState("");
  const [leftThreadId, setLeftThreadId] = useState("");
  const [rightThreadId, setRightThreadId] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  // Extract thread ID from Reddit URL
  const extractThreadId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (!urlObj.hostname.includes("reddit.com")) return "";

      // Extract the thread ID from the URL path
      const pathParts = urlObj.pathname.split("/");
      const commentsIndex = pathParts.indexOf("comments");

      if (commentsIndex !== -1 && pathParts.length > commentsIndex + 1) {
        return pathParts[commentsIndex + 1];
      }
      return "";
    } catch {
      return "";
    }
  };

  const handleLeftSubmit = () => {
    const threadId = extractThreadId(leftUrl);
    setLeftThreadId(threadId);
  };

  const handleRightSubmit = () => {
    const threadId = extractThreadId(rightUrl);
    setRightThreadId(threadId);
  };

  return (
    <main className="flex h-screen flex-col">
      <header className="shrink-0 border-b p-4">
        <h1 className="text-2xl font-bold">Reddit Game Thread Comparison</h1>
        <p className="text-muted-foreground">
          Compare comments from two different Reddit threads side by side
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Left Panel */}
        <div className="flex min-h-0 w-full flex-col border-r md:w-1/2">
          <div className="shrink-0 border-b p-4">
            <div className="space-y-2">
              <Label htmlFor="left-url">Left Thread URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="left-url"
                  onChange={(e) => setLeftUrl(e.target.value)}
                  placeholder="https://www.reddit.com/r/Padres/comments/..."
                  value={leftUrl}
                />
                <Button onClick={handleLeftSubmit}>Load</Button>
              </div>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            <RedditThreadViewer
              autoRefresh={autoRefresh}
              refreshInterval={refreshInterval}
              threadId={leftThreadId}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex min-h-0 w-full flex-col md:w-1/2">
          <div className="shrink-0 border-b p-4">
            <div className="space-y-2">
              <Label htmlFor="right-url">Right Thread URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="right-url"
                  onChange={(e) => setRightUrl(e.target.value)}
                  placeholder="https://www.reddit.com/r/CHICubs/comments/..."
                  value={rightUrl}
                />
                <Button onClick={handleRightSubmit}>Load</Button>
              </div>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            <RedditThreadViewer
              autoRefresh={autoRefresh}
              refreshInterval={refreshInterval}
              threadId={rightThreadId}
            />
          </div>
        </div>
      </div>

      {/* Footer Controls - Always visible */}
      <footer className="shrink-0 border-t p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={autoRefresh}
                id="auto-refresh"
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh">Auto-refresh</Label>
            </div>
            {autoRefresh && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="refresh-interval">Every</Label>
                <Input
                  className="w-20"
                  id="refresh-interval"
                  max="300"
                  min="5"
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  type="number"
                  value={refreshInterval}
                />
                <span>seconds</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Button
              onClick={() => {
                if (leftThreadId) handleLeftSubmit();
                if (rightThreadId) handleRightSubmit();
              }}
              size="sm"
              variant="outline"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Now
            </Button>
          </div>
        </div>
      </footer>
    </main>
  );
}
