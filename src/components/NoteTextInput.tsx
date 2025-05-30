"use client";

import { ChangeEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { debounceTimeout } from "@/lib/constants";

import { Textarea } from "@/components/ui/textarea";

import { useNote } from "@/hooks/useNote";
import { updateNoteAction } from "@/actions/notes";

type Props = {
	noteId: string;
	startingNoteText: string;
};

let updateTimeout: NodeJS.Timeout;

function NoteTextInput({ noteId, startingNoteText }: Props) {
	const noteIdParam = useSearchParams().get("noteId") || "";
	const { noteText, setNoteText } = useNote();

	useEffect(() => {
		if (noteIdParam === noteId) setNoteText(startingNoteText);
		else setNoteText("");
	}, [startingNoteText, noteIdParam, noteId, setNoteText]);

	const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const text = e.target.value;

		setNoteText(text);

		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(() => {
			updateNoteAction(noteId, text);
		}, debounceTimeout);
	};

	return (
		<Textarea
			value={noteText}
			onChange={handleUpdateNote}
			placeholder="Type your note here..."
			className="custom-scrollbar placeholder:text-muted-foreground mb-4 h-full resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
		/>
	);
}

export default NoteTextInput;
