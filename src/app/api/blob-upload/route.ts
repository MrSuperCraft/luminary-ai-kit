import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const blob = await put(file.name, file, {
        access: "public", // or 'private' if you're handling auth
        addRandomSuffix: true
    });

    return NextResponse.json(blob); // { url, pathname, contentType, ... }
}
