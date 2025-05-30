import { prisma } from "@/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId") || "";

	const { id } = await prisma.note.create({
		data: {
			userId: userId,
			content: "",
			title: "Untitled"
		}
	});

	return NextResponse.json({ noteId: id });
}
