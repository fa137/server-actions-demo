import { IComment, getAllComments } from "./_actions";
import { CommentSection } from "./components/Comments";
import { DeleteAll } from "./components/Delete";

export default async function Page() {
	async function getComments() {
		"use server";
		return new Promise(async (resolve) => {
			const comments = await getAllComments();
			setTimeout(() => {
				resolve(comments);
			}, 200); // Simulate a .2s delay
		});
	}
	const comments = (await getComments()) as IComment[];
	return (
		<div className="p-5">
			<CommentSection comments={comments} />
			<DeleteAll />
		</div>
	);
}
