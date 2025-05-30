import { cva } from "class-variance-authority";

export const toastVariants = cva("border rounded-md shadow-sm px-4 py-2 text-sm", {
	variants: {
		variant: {
			default: "bg-white text-black border-gray-200",
			success: "bg-green-100 text-green-800 border-green-400",
			error: "bg-red-100 text-red-800 border-red-400",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});