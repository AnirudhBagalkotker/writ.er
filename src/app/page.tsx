import AskAIButton from "@/components/AskAIButton";
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";

type Props = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function HomePage({ searchParams }: Props) {
	const user = await getUser();

	const noteIdParam = (await searchParams).noteId;
	const noteId = Array.isArray(noteIdParam)
		? noteIdParam[0]
		: noteIdParam || "";

	const note = await prisma.note.findUnique({
		where: {
			id: noteId,
			userId: user?.id
		}
	});

	// console.log(note?.title);

	return (
		<div className="flex h-full flex-col items-center gap-4">
			<div className="flex w-full items-center justify-center gap-2">
				<div className="flex w-full max-w-2xl flex-col items-center justify-center gap-4">
					<h1 className="text-4xl font-bold">Welcome to Writ.er</h1>
					<p className="text-muted-foreground text-center text-lg">
						Use the power of AI to organize your thoughts and ideas.
					</p>
				</div>
			</div>
			<div className="flex w-full justify-end gap-2">
				<NewNoteButton user={user} />
				<AskAIButton user={user} />
			</div>

			<NoteTextInput
				noteId={noteId}
				startingNoteText={note?.content || ""}
			/>
		</div>
	);
}

export default HomePage;
