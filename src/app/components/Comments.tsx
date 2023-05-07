"use client";
import {
	useEffect,
	experimental_useOptimistic as useOptimistic,
	useRef,
} from "react";
import { IComment, postComment } from "../_actions";
import { Saving } from "./Saving";

export function CommentSection({ comments }: { comments: IComment[] }) {
	const [optimisticComments, addOptimisticComment] = useOptimistic<
		IComment[],
		string
	>(comments, (state, newComment) => [
		...state,
		{ text: newComment, id: 0, saving: true },
	]);
	const formRef = useRef<HTMLFormElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef?.current?.focus();
	}, [inputRef.current]);

	return (
		<div>
			<ol>
				{optimisticComments.map((comment: IComment) => (
					<li
						key={comment.text + comment.id}
						className="my-3 border-b border-b-neutral-200 pb-2 flex justify-between last:border-b-0"
					>
						{comment.text}
						{comment.saving && <Saving />}
					</li>
				))}
			</ol>
			<form
				action={async (formData: FormData) => {
					const comment = formData.get("comment") as string;
					if (comment) {
						formRef.current?.reset();
						inputRef?.current?.focus();
						addOptimisticComment(comment);
						await postComment(comment);
					}
				}}
				ref={formRef}
			>
				<input
					type="text"
					name="comment"
					className="text-lg border-2 border-gray-300 p-3 px-5 rounded mt-5 w-full"
					ref={inputRef}
				/>
			</form>
		</div>
	);
}
