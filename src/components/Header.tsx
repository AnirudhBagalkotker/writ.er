import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import ModeToggle from "@/components/DarkMode";
import LogoutButton from "@/components/LogoutButton";

import { getUser } from "@/auth/server";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function Header() {
	const user = await getUser();
	return (
		<header className="bg-popover dark:bg-popover-dark relative flex h-14 w-full items-center justify-between px-2 sm:px-4">
			<SidebarTrigger className="absolute top-3 left-1" />
			<Link href="/" className="ml-10 flex items-center gap-1">
				<Image
					src="/logo.png"
					alt="Writ.er"
					width={24}
					height={24}
					className="cursor-pointer"
					priority={true}
				/>

				<h1 className="flex flex-col pl-2 text-2xl font-bold">
					Writ.er
				</h1>
			</Link>
			<div className="flex gap-4">
				{user ? (
					<>
						<LogoutButton />
					</>
				) : (
					<>
						<Button asChild className="hidden sm:inline-flex">
							<Link href="/register">Sign Up</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/login">Login</Link>
						</Button>
					</>
				)}
				<ModeToggle />
			</div>
		</header>
	);
}

export default Header;
