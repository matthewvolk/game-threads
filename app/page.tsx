"use client"

import { useState } from "react"
import { RefreshCcw } from "lucide-react"
import { RedditThreadViewer } from "@/components/reddit-thread-viewer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function Home() {
  const [leftUrl, setLeftUrl] = useState("")
  const [rightUrl, setRightUrl] = useState("")
  const [leftThreadId, setLeftThreadId] = useState("")
  const [rightThreadId, setRightThreadId] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30) // seconds

  // Extract thread ID from Reddit URL
  const extractThreadId = (url: string) => {
    try {
      const urlObj = new URL(url)
      if (!urlObj.hostname.includes("reddit.com")) return ""

      // Extract the thread ID from the URL path
      const pathParts = urlObj.pathname.split("/")
      const commentsIndex = pathParts.indexOf("comments")

      if (commentsIndex !== -1 && pathParts.length > commentsIndex + 1) {
        return pathParts[commentsIndex + 1]
      }
      return ""
    } catch (e) {
      return ""
    }
  }

  const handleLeftSubmit = () => {
    const threadId = extractThreadId(leftUrl)
    setLeftThreadId(threadId)
  }

  const handleRightSubmit = () => {
    const threadId = extractThreadId(rightUrl)
    setRightThreadId(threadId)
  }

  return (
    <main className="flex flex-col h-screen">
      <header className="border-b p-4 shrink-0">
        <h1 className="text-2xl font-bold">Reddit Game Thread Comparison</h1>
        <p className="text-muted-foreground">Compare comments from two different Reddit threads side by side</p>
      </header>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 border-r flex flex-col min-h-0">
          <div className="p-4 border-b shrink-0">
            <div className="space-y-2">
              <Label htmlFor="left-url">Left Thread URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="left-url"
                  placeholder="https://www.reddit.com/r/Padres/comments/..."
                  value={leftUrl}
                  onChange={(e) => setLeftUrl(e.target.value)}
                />
                <Button onClick={handleLeftSubmit}>Load</Button>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <RedditThreadViewer threadId={leftThreadId} autoRefresh={autoRefresh} refreshInterval={refreshInterval} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex flex-col min-h-0">
          <div className="p-4 border-b shrink-0">
            <div className="space-y-2">
              <Label htmlFor="right-url">Right Thread URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="right-url"
                  placeholder="https://www.reddit.com/r/CHICubs/comments/..."
                  value={rightUrl}
                  onChange={(e) => setRightUrl(e.target.value)}
                />
                <Button onClick={handleRightSubmit}>Load</Button>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <RedditThreadViewer threadId={rightThreadId} autoRefresh={autoRefresh} refreshInterval={refreshInterval} />
          </div>
        </div>
      </div>

      {/* Footer Controls - Always visible */}
      <footer className="border-t p-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <Label htmlFor="auto-refresh">Auto-refresh</Label>
            </div>
            {autoRefresh && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="refresh-interval">Every</Label>
                <Input
                  id="refresh-interval"
                  type="number"
                  min="5"
                  max="300"
                  className="w-20"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                />
                <span>seconds</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (leftThreadId) handleLeftSubmit()
                if (rightThreadId) handleRightSubmit()
              }}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Now
            </Button>
          </div>
        </div>
      </footer>
    </main>
  )
}

