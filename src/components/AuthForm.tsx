"use client";

import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import Link from "next/link";

import { toast } from "sonner";
import { toastVariants } from "@/components/ui/toastVariants";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

import { loginUserAction, registerUserAction } from "@/actions/user";

type Props = { type: "login" | "register" };

function AuthForm({ type }: Props) {
	const isLogin = type === "login";
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleSubmit = async (formData: FormData) => {
		//  Allow the form to be submitted and show loading state without blocking the UI
		startTransition(async () => {
			const email = formData.get("email") as string;
			const password = formData.get("password") as string;

			let errMsg;
			let title;
			let desc;

			if (isLogin) {
				title = "Logged In";
				desc = "You have successfully logged in.";
				errMsg = (await loginUserAction(email, password)).errMsg;
			} else {
				title = "Registered";
				desc = "Check your email for confirmation link.";
				errMsg = (await registerUserAction(email, password)).errMsg;
			}

			if (errMsg) {
				toast.error("Error", {
					className: toastVariants({ variant: "error" }),
					description: errMsg,
					action: {
						label: "Try again",
						onClick: () => {
							startTransition(() => {
								handleSubmit(formData);
							});
						}
					}
				});
			} else {
				toast.success(`${title}`, {
					className: toastVariants({ variant: "success" }),
					description: desc
				});
				router.replace("/");
			}
		});
	};

	return (
		<form action={handleSubmit}>
			<CardContent className="grid w-full items-center gap-4">
				<div className="flex flex-col gap-1 space-y-1.5">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="Enter your email"
						required
						disabled={isPending}
					/>
				</div>
				<div className="flex flex-col gap-1 space-y-1.5">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder="Enter your password"
						required
					/>
				</div>
			</CardContent>
			<CardFooter className="mt-6 flex flex-col gap-6">
				<Button className="w-full">
					{isPending ? (
						<Loader2 className="animate-spin" />
					) : isLogin ? (
						"Login"
					) : (
						"Register"
					)}
				</Button>
				<p className="text-xs">
					{isLogin
						? "Don't have an account yet? "
						: "Already have an account? "}
					<Link
						href={isLogin ? "/register" : "/login"}
						className={`text-blue-500 underline ${
							isPending ? "pointer-events-none opacity-50" : ""
						}`}>
						{isLogin ? "Register" : "Login"}
					</Link>
				</p>
			</CardFooter>
		</form>
	);
}

export default AuthForm;
