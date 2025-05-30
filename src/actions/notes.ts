"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

export const updateNoteAction = async (noteId: string, content: string) => {
	try {
		if (!noteId || !content) throw new Error("Note is required");

		const user = await getUser();
		if (!user) throw new Error("User not authenticated");

		const note = await prisma.note.findUnique({
			where: { id: noteId, userId: user.id }
		});

		const title =
			note?.title && note?.title !== "Untitled"
				? note?.title
				: content.split("\n")[0].trim() || "Untitled";

		if (!note) throw new Error("Note not found");

		const updatedNote = await prisma.note.update({
			where: { id: noteId },
			data: { content, title }
		});

		if (!updatedNote) throw new Error("Failed to update note");

		return { errMsg: null };
	} catch (error) {
		return handleError(error);
	}
};

export const createNoteAction = async (noteId: string) => {
	try {
		if (!noteId) throw new Error("Note is required");

		const user = await getUser();
		if (!user) throw new Error("Login to create a note");

		const note = await prisma.note.create({
			data: {
				id: noteId,
				userId: user.id,
				content: "",
				title: "Untitled"
			}
		});

		if (!note) throw new Error("Failed to create note");

		return { errMsg: null };
	} catch (error) {
		return handleError(error);
	}
};

export const deleteNoteAction = async (noteId: string) => {
	try {
		if (!noteId) throw new Error("Note is required");

		const user = await getUser();
		if (!user) throw new Error("Login to delete a note");

		const note = await prisma.note.findUnique({
			where: { id: noteId, userId: user.id }
		});

		if (!note) throw new Error("Note not found");

		const deletedNote = await prisma.note.delete({
			where: { id: noteId }
		});

		if (!deletedNote) throw new Error("Failed to delete note");

		return { errMsg: null };
	} catch (error) {
		return handleError(error);
	}
};

export const askAIAction = async (questions: string[], responses: string[]) => {
	try {
		if (!questions.length) throw new Error("No questions provided");

		const user = await getUser();
		if (!user) throw new Error("Login to use Writ.AI");

		const notes = await prisma.note.findMany({
			where: { userId: user.id },
			orderBy: { updatedAt: "desc" },
			select: {
				title: true,
				content: true,
				createdAt: true,
				updatedAt: true
			}
		});

		if (notes.length == 0) return "You don't have any notes yet.";

		const formattedNotes = notes
			.map((note) =>
				`
			Title: ${note.title}
			Content: ${note.content}
			Created At: ${note.createdAt}
			Updated At: ${note.updatedAt}
			`.trim()
			)
			.join("\n");

		const messages = [
			{
				role: "system",
				content: `
        You are a helpful assistant that answers questions about a user's notes. 
        Assume all questions are related to the user's notes. 
		Make sure that your responses are not too verbose and you speak succinctly.
		Your responses MUST be in **valid HTML fragments**, not full HTML documents.
		Do NOT include <html>, <head>, <body>, or <!DOCTYPE>.
		Only use clean, semantic content tags such as:
		<p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> efficiently to make response look good.
        Here are the user's notes:
        ${formattedNotes}
		`.trim()
			}
		];

		for (let i = 0; i < questions.length; i++) {
			messages.push({ role: "user", content: questions[i] });
			if (responses.length > i)
				messages.push({ role: "assistant", content: responses[i] });
		}

		const response = await fetch(
			"https://openrouter.ai/api/v1/chat/completions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model: "meta-llama/llama-4-scout:free",
					messages: messages
				})
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			console.error("API error:", response.status, errorData);
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();
		return result.choices[0].message.content || "A problem has occurred";
	} catch (error) {
		return handleError(error);
	}
};
