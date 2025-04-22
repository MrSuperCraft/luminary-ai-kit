"use client"

import type React from "react"

import { useState } from "react"
import { ImageIcon, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
    onImageUpload: (imageUrl: string) => void
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)

            // Create a preview
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)

            // Upload the file
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            const data = await response.json()
            onImageUpload(data.url)
        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Failed to upload image. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    const clearImage = () => {
        setPreview(null)
        onImageUpload("")
    }

    return (
        <div className="relative">
            {preview ? (
                <div className="relative w-full h-32 mb-2">
                    <Image src={preview || "/placeholder.svg"} alt="Uploaded image" fill className="object-contain rounded-md" />
                    <button
                        onClick={clearImage}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                        aria-label="Remove image"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="mb-2">
                    <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                    >
                        {isUploading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                        ) : (
                            <>
                                <ImageIcon className="h-5 w-5 mr-2 text-gray-500" />
                                <span className="text-sm text-gray-500">Upload an image</span>
                            </>
                        )}
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleUpload}
                            disabled={isUploading}
                        />
                    </label>
                </div>
            )}
        </div>
    )
}
