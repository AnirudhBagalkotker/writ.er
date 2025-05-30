"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";
import { toastVariants } from "@/components/ui/toastVariants";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useTransition } from "react";
import { deleteNoteAction } from "@/actions/notes";

type Props = {
	noteId: string;
	deleteNoteLocally: (noteId: string) => void;
};

function DeleteNoteButton({ noteId, deleteNoteLocally }: Props) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const noteIdParam = useSearchParams().get("noteId") || "";

	const handleDeleteNote = async () => {
		startTransition(async () => {
			const errMsg = (await deleteNoteAction(noteId)).errMsg;

			if (errMsg) {
				toast.error("Error", {
					className: toastVariants({ variant: "error" }),
					description: errMsg,
					action: {
						label: "Try again",
						onClick: () => {
							startTransition(() => {
								handleDeleteNote();
							});
						}
					}
				});
			} else {
				toast.success(`Note deleted`, {
					className: toastVariants({ variant: "success" }),
					description: `Your note has been deleted successfully.`
				});
				deleteNoteLocally(noteId);
				if (noteId === noteIdParam) router.replace("/");
			}
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					className="absolute top-1/2 right-3 size-7 -translate-y-11/20 cursor-pointer p-0 opacity-0 group-hover/item:opacity-100">
					<Trash2 className="size-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete this note?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete your note from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="w-24">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDeleteNote}
						className="text-destructive-foreground w-24 bg-red-600 hover:bg-red-700">
						{isPending ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							"Delete"
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default DeleteNoteButton;
