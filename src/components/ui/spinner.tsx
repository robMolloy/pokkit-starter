import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div
            className={cn("flex items-center justify-center", className)}
            {...props}
        >
            <div
                className={cn(
                    "animate-spin rounded-full border-2 border-current border-t-transparent text-primary",
                    sizeClasses[size]
                )}
            />
        </div>
    );
} 