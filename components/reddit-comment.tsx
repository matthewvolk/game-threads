"use client";

import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, MessageSquare, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface CommentProps {
  comment: {
    id: string;
    author: string;
    body: string;
    created_utc: number;
    score: number;
    replies?: {
      data: {
        children: Array<{
          kind: string;
          data: any;
        }>;
      };
    };
  };
  depth?: number;
}

export function RedditComment({ comment, depth = 0 }: CommentProps) {
  const [expanded, setExpanded] = useState(true);
  const [showReplies, setShowReplies] = useState(true);

  const hasReplies =
    comment.replies &&
    comment.replies.data &&
    comment.replies.data.children &&
    comment.replies.data.children.length > 0;

  const replies = hasReplies
    ? comment.replies.data.children
        .filter((child) => child.kind === "t1")
        .map((child) => child.data)
    : [];

  const replyCount = replies.length;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  // Format the comment body (basic markdown-like formatting)
  const formatCommentBody = (body: string) => {
    return body.replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>");
  };

  if (!expanded) {
    return (
      <div
        className="cursor-pointer rounded-sm border-l-2 border-muted px-2 py-1 hover:bg-muted/50"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-center text-sm text-muted-foreground">
          <ChevronUp className="mr-1 h-3 w-3" />
          <span className="font-medium">{comment.author}</span>
          <span className="mx-1">•</span>
          <span>{comment.score} points</span>
          {replyCount > 0 && (
            <>
              <span className="mx-1">•</span>
              <MessageSquare className="mr-1 h-3 w-3" />
              <span>{replyCount}</span>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={depth > 0 ? "pl-4" : ""}>
      <Card className={depth > 0 ? "border-l-2" : ""}>
        <CardContent className="p-3">
          <div className="flex items-start space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {getInitials(comment.author)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 break-words">
              <div className="flex items-center text-sm">
                <span className="font-medium">{comment.author}</span>
                <span className="mx-1 text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {formatDistanceToNow(comment.created_utc * 1000)} ago
                </span>
              </div>
              <div
                className="text-sm"
                dangerouslySetInnerHTML={{
                  __html: formatCommentBody(comment.body),
                }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-2 pt-0">
          <div className="flex items-center text-sm text-muted-foreground">
            <ThumbsUp className="mr-1 h-3 w-3" />
            <span>{comment.score} points</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="h-7 px-2 text-xs"
              onClick={() => setExpanded(false)}
              size="sm"
              variant="ghost"
            >
              <ChevronDown className="mr-1 h-3 w-3" />
              Collapse
            </Button>

            {replyCount > 0 && (
              <Button
                className="h-7 px-2 text-xs"
                onClick={() => setShowReplies(!showReplies)}
                size="sm"
                variant="ghost"
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="mr-1 h-3 w-3" />
                    Hide Replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 h-3 w-3" />
                    Show {replyCount} {replyCount === 1 ? "Reply" : "Replies"}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {showReplies && replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {replies.map((reply) => (
            <RedditComment comment={reply} depth={depth + 1} key={reply.id} />
          ))}
        </div>
      )}
    </div>
  );
}
