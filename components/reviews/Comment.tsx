"use client";

import { useState } from "react";
import { Button } from "../ui/button";

function Comment({ comment }: { comment: string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const isCommentLong = comment.length > 130;
    const displayComment =
        isCommentLong && !isExpanded ? `${comment.slice(0, 130)}...` : comment;

    return (
        <div>
            <p className="text-sm">{displayComment}</p>
            {isCommentLong && (
                <Button
                    variant="link"
                    className="pl-0 text-muted-foreground capitalize"
                    onClick={toggleExpanded}
                >
                    {isExpanded ? "show less" : "show more"}
                </Button>
            )}
        </div>
    );
}

export default Comment;
