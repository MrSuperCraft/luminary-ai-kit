"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4 max-w-md">
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <p className="text-sm text-gray-500 mb-4">{error.message}</p>
            <p className="text-sm text-gray-500 mb-4">{error.digest}</p>
            <Button onClick={reset} variant="outline" className="">
                Try again
            </Button>
        </div>
    )
}
