"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

import { createNoteAction } from "@/actions/notes";

import { User } from "@supabase/supabase-js";

type Props = {
	user: User | null;
};

function NewNoteButton({ user }: Props) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const handleClickNewNote = async () => {
		if (!user) router.push("/login");
		else {
			setLoading(true);
			const uuid = uuidv4();
			await createNoteAction(uuid);
			router.push(`/?noteId=${uuid}`);

			toast.success("New note created", {
				description: "You can start writing your new note now."
			});
			setLoading(false);
		}
	};

	return (
		<Button
			onClick={handleClickNewNote}
			variant="secondary"
			className="w-28"
			disabled={loading}>
			{loading ? <Loader2 className="animate-spin" /> : "+ New Note"}
		</Button>
	);
}

export default NewNoteButton;
