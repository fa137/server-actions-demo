"use server";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const initialComments: IComment[] = [
	{
		text: ":)",
		id: 0,
	},
	{
		text: "This is being handled by a Server Action",
		id: 1,
	},
	{
		text: "And 🧪 useOptimistic hook to display the new comment before they are saved to the db",
		id: 2,
	},
];
export interface IComment {
	id: number;
	text: string;
	saving?: boolean;
}

export async function getAllComments(): Promise<IComment[]> {
	const comments: IComment[] = await prisma.comment.findMany();
	if (!comments || comments.length === 0) {
		// run these promises in sequence, not in parallel

		const newComments: IComment[] = await Promise.all(
			initialComments.sort().map(async (comment) => {
				return await prisma.comment.create({
					data: {
						text: comment.text,
					},
				});
			})
		);
		return newComments;
	} else {
		return comments;
	}
}

export async function postComment(text: string): Promise<IComment> {
	return new Promise((resolve) => {
		setTimeout(async () => {
			const res = await prisma.comment.create({
				data: {
					text,
				},
			});
			resolve(res);
			revalidatePath(`/`);
		}, 3000); // Simulate a 3s delay
	});
}

export async function deleteAll(): Promise<void> {
	await prisma.comment.deleteMany();
	// reseed the database with initial comments (hack, cuz im lazy)
	await getAllComments();
	revalidatePath(`/`);
}
