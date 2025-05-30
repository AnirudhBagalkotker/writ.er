import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel
} from "@/components/ui/sidebar";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { Note } from "@prisma/client";
import Link from "next/link";
import SidebarNotes from "@/components/SidebarNotes";

export async function AppSidebar() {
	const user = await getUser();
	if (!user) return null;

	let notes: Note[] = [];

	if (user) {
		notes = await prisma.note.findMany({
			where: { userId: user.id },
			orderBy: { updatedAt: "desc" }
		});
	}

	return (
		<Sidebar>
			<SidebarContent className="custom-scrollbar">
				<SidebarGroup>
					<SidebarGroupLabel className="mt-2 mb-2 text-lg">
						{user ? (
							`Your Notes`
						) : (
							<p>
								<Link href="/login" className="underline">
									Login
								</Link>{" "}
								to add notes.
							</p>
						)}
					</SidebarGroupLabel>
					{user && <SidebarNotes notes={notes} />}
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
