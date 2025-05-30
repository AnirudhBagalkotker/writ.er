"use client";

import Link from "next/link";

import { Note } from "@prisma/client";
import { useSearchParams } from "next/navigation";
// import { useNote } from "@/hooks/useNote";
// import { useEffect, useState } from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";

type Props = { note: Note };

function SelectNoteButton({ note }: Props) {
	const noteId = useSearchParams().get("noteId") || "";
	const isSelected = noteId === note.id;

	// const [localNoteTitle, setLocalNoteTitle] = useState(note.title);
	// const { noteTitle, setNoteTitle } = useNote();
	// const [globalNoteTitle, setGlobalNoteTitle] = useState(false);

	// useEffect(() => {
	// 	if (noteId === note.id) setGlobalNoteTitle(true);
	// 	else setGlobalNoteTitle(false);
	// }, [noteId, note.id]);

	// useEffect(() => {
	// 	if (globalNoteTitle) setLocalNoteTitle(noteTitle);
	// }, [noteTitle, globalNoteTitle]);

	// const blankNoteTitle = "Untitled";
	// let selectedNoteTitle = localNoteTitle || blankNoteTitle;

	// if (globalNoteTitle) selectedNoteTitle = noteTitle || blankNoteTitle;

	// console.log(
	// 	"SelectNoteButton noteTitle:",
	// 	noteTitle,
	// 	"globalNoteTitle:",
	// 	globalNoteTitle,
	// 	"localNoteTitle:",
	// 	localNoteTitle,
	// 	"selectedNoteTitle:",
	// 	selectedNoteTitle,
	// 	"note Title:",
	// 	note.title
	// );

	return (
		<SidebarMenuButton
			asChild
			className={`items-start gap-0 pr-12 ${isSelected ? "bg-sidebar-accent/50" : ""}`}>
			<Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col">
				<p className="w-full truncate overflow-hidden text-ellipsis whitespace-nowrap">
					{note.title}
				</p>
			</Link>
		</SidebarMenuButton>
	);
}

export default SelectNoteButton;
