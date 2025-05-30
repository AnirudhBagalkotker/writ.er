import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import { ThemeProvider } from "@/provider/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

import Header from "@/components/Header";
import NoteProvider from "@/provider/NoteProvider";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
	fallback: ["system-ui", "sans-serif"]
});

export const metadata: Metadata = {
	title: "Writ.er | The Next Generation AI Note-taking App",
	description:
		"Writ.er is a next generation AI note-taking app that helps you take notes faster and more efficiently."
};

export default function RootLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={`${inter.variable}`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange>
					<NoteProvider>
						<SidebarProvider>
							<AppSidebar />
							<div className="flex min-h-screen w-full flex-col">
								<Header />
								<main className="flex flex-1 flex-col px-4 pt-12 xl:px-8">
									{children}
								</main>
							</div>
						</SidebarProvider>
					</NoteProvider>

					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
