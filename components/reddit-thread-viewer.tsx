"use client";

import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

import { RedditComment as RedditCommentComponent } from "@/components/reddit-comment";
import { type RedditComment } from "@/components/reddit-comment";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RedditThreadViewerProps {
  threadId: string;
  autoRefresh: boolean;
  refreshInterval: number;
}

interface RedditThread {
  title: string;
  subreddit: string;
  author: string;
  selftext: string;
  created_utc: number;
  num_comments: number;
}

export function RedditThreadViewer({
  threadId,
  autoRefresh,
  refreshInterval,
}: RedditThreadViewerProps) {
  const [thread, setThread] = useState<RedditThread | null>(null);
  const [comments, setComments] = useState<RedditComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchThreadData = useCallback(async () => {
    if (!threadId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.reddit.com/comments/${threadId}.json`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch thread: ${response.status}`);
      }

      const data = await response.json();

      // First item in the array contains thread info
      if (data[0]?.data?.children?.[0]?.data) {
        setThread(data[0].data.children[0].data);
      }

      // Second item contains comments
      if (data[1]?.data?.children) {
        const fetchedComments = data[1].data.children
          .filter((child: { kind: string }) => child.kind === "t1")
          .map((child: { data: RedditComment }) => child.data);

        setComments(fetchedComments);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch thread data",
      );
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  // Initial fetch
  useEffect(() => {
    if (threadId) {
      fetchThreadData();
    } else {
      setThread(null);
      setComments([]);
    }
  }, [threadId, fetchThreadData]);

  // Set up auto-refresh
  useEffect(() => {
    if (!autoRefresh || !threadId) return;

    const interval = setInterval(() => {
      fetchThreadData();
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, threadId, fetchThreadData]);

  if (!threadId) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Thread Selected</h3>
          <p className="mt-2 text-muted-foreground">
            Enter a Reddit thread URL above and click &quot;Load&quot; to view
            comments
          </p>
        </div>
      </div>
    );
  }

  if (loading && !comments.length) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2">Loading thread...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4">
        {thread && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <h2 className="break-words text-xl font-bold">{thread.title}</h2>
            <div className="mt-1 flex flex-wrap items-center text-sm text-muted-foreground">
              <span>r/{thread.subreddit}</span>
              <span className="mx-1">•</span>
              <span>Posted by u/{thread.author}</span>
              <span className="mx-1">•</span>
              <span>{formatDistanceToNow(thread.created_utc * 1000)} ago</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Comments ({thread?.num_comments || comments.length})
                </h3>
                {loading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Refreshing...
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <RedditCommentComponent comment={comment} key={comment.id} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No comments found</p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
