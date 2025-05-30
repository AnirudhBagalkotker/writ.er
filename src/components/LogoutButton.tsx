"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { toastVariants } from "@/components/ui/toastVariants";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

import { logoutUserAction } from "@/actions/user";

function LogoutButton() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const handleLogout = async () => {
		setLoading(true);
		try {
			const errMsg = (await logoutUserAction()).errMsg;
			if (errMsg) throw new Error(errMsg);

			toast.success("Logged out", {
				className: toastVariants({ variant: "success" }),
				description: "You have been successfully logged out"
			});

			router.push("/");
		} catch (error) {
			console.error("Logout failed:", error);
			toast.error("Logout failed", {
				className: toastVariants({ variant: "error" }),
				description: "An error occurred while logging out.",
				action: {
					label: "Try again",
					onClick: () => handleLogout()
				}
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button
			variant="outline"
			onClick={handleLogout}
			disabled={loading}
			className="w-24">
			{loading ? <Loader2 className="animate-spin" /> : "Log Out"}
		</Button>
	);
}

export default LogoutButton;
