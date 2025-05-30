"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

import {
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

import { SearchIcon } from "lucide-react";

import SelectNoteButton from "@/components/SelectNoteButton";
import DeleteNoteButton from "@/components/DeleteNoteButton";

import { Note } from "@prisma/client";

type Props = {
	notes: Note[];
};

function SidebarNotes({ notes }: Props) {
	const router = useRouter();

	const [searchText, setSearchText] = useState("");
	const [localNotes, setLocalNotes] = useState<Note[]>(notes);

	useEffect(() => {
		setLocalNotes(notes);
	}, [notes, searchText]);

	const fuse = useMemo(() => {
		return new Fuse(localNotes, {
			keys: ["title", "content"],
			threshold: 0.25,
			includeScore: true,
			ignoreLocation: true
		});
	}, [localNotes]);

	const filteredNotes = searchText
		? fuse.search(searchText).map((result) => result.item)
		: localNotes;

	const deleteNoteLocally = (noteId: string) => {
		setLocalNotes((prevNotes) =>
			prevNotes.filter((note) => note.id !== noteId)
		);
		router.replace(
			localNotes.length > 0 ? `/?noteId=${localNotes[0]?.id}` : "/"
		);
	};

	return (
		<SidebarGroupContent>
			<div className="relative mt-2 mb-2 flex items-center">
				<SearchIcon className="absolute left-2 size-4" />
				<Input
					className="bg-muted pl-8"
					placeholder="Search your notes..."
					type="text"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</div>

			<SidebarMenu className="mt-6 gap-2">
				{filteredNotes.length > 0 ? (
					filteredNotes.map((note) => (
						<SidebarMenuItem
							key={note.id}
							className="group/item flex flex-row items-center justify-between gap-2">
							<SelectNoteButton note={note} />
							<DeleteNoteButton
								noteId={note.id}
								deleteNoteLocally={deleteNoteLocally}
							/>
						</SidebarMenuItem>
					))
				) : (
					<SidebarMenuItem className="text-muted-foreground">
						No notes found
					</SidebarMenuItem>
				)}
			</SidebarMenu>
		</SidebarGroupContent>
	);
}

export default SidebarNotes;
