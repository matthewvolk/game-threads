"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { ChevronDown, ChevronUp, MessageSquare, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface CommentProps {
  comment: {
    id: string
    author: string
    body: string
    created_utc: number
    score: number
    replies?: {
      data: {
        children: Array<{
          kind: string
          data: any
        }>
      }
    }
  }
  depth?: number
}

export function RedditComment({ comment, depth = 0 }: CommentProps) {
  const [expanded, setExpanded] = useState(true)
  const [showReplies, setShowReplies] = useState(true)

  const hasReplies =
    comment.replies && comment.replies.data && comment.replies.data.children && comment.replies.data.children.length > 0

  const replies = hasReplies
    ? comment.replies.data.children.filter((child) => child.kind === "t1").map((child) => child.data)
    : []

  const replyCount = replies.length

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase()
  }

  // Format the comment body (basic markdown-like formatting)
  const formatCommentBody = (body: string) => {
    return body.replace(/\n\n/g, "<br/><br/>").replace(/\n/g, "<br/>")
  }

  if (!expanded) {
    return (
      <div
        className="py-1 px-2 border-l-2 border-muted cursor-pointer hover:bg-muted/50 rounded-sm"
        onClick={() => setExpanded(true)}
      >
        <div className="flex items-center text-sm text-muted-foreground">
          <ChevronUp className="h-3 w-3 mr-1" />
          <span className="font-medium">{comment.author}</span>
          <span className="mx-1">•</span>
          <span>{comment.score} points</span>
          {replyCount > 0 && (
            <>
              <span className="mx-1">•</span>
              <MessageSquare className="h-3 w-3 mr-1" />
              <span>{replyCount}</span>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={depth > 0 ? "pl-4" : ""}>
      <Card className={depth > 0 ? "border-l-2" : ""}>
        <CardContent className="p-3">
          <div className="flex items-start space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{getInitials(comment.author)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1 break-words">
              <div className="flex items-center text-sm">
                <span className="font-medium">{comment.author}</span>
                <span className="mx-1 text-muted-foreground">•</span>
                <span className="text-muted-foreground">{formatDistanceToNow(comment.created_utc * 1000)} ago</span>
              </div>
              <div className="text-sm" dangerouslySetInnerHTML={{ __html: formatCommentBody(comment.body) }} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-2 pt-0 flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <ThumbsUp className="h-3 w-3 mr-1" />
            <span>{comment.score} points</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setExpanded(false)}>
              <ChevronDown className="h-3 w-3 mr-1" />
              Collapse
            </Button>

            {replyCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Hide Replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
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
            <RedditComment key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

