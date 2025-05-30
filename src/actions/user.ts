"use server";

import { createClient } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";

export const loginUserAction = async (email: string, password: string) => {
	try {
		const { auth } = await createClient();
		const { error } = await auth.signInWithPassword({ email, password });

		if (error) throw error;

		return { errMsg: null };
	} catch (error) {
		return handleError(error);
	}
};

export const registerUserAction = async (email: string, password: string) => {
	try {
		const { auth } = await createClient();
		const { data, error } = await auth.signUp({ email, password });

		if (error) throw error;

		const userId = data.user?.id;
		if (!userId)
			throw new Error("User registration failed. Please try again.");

		// Add User to the prisma database
		await prisma.user.create({ data: { id: userId, email } });

		return { errMsg: null };
	} catch (error) {
		return handleError(error);
	}
};

export const logoutUserAction = async () => {
	try {
		const { auth } = await createClient();
		const { error } = await auth.signOut();

		if (error) throw error;

		return { errMsg: null };
	} catch (error) {
		return handleError(error);
	}
};
