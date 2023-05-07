"use client";
import { deleteAll } from "../_actions";

export function DeleteAll(): JSX.Element {
	async function handleClick() {
		await deleteAll();
	}
	return (
		<button
			onClick={() => handleClick()}
			className="absolute bottom-5 right-5 text-red-300 border-red-300 border-2 px-2 py-1 rounded hover:border-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
		>
			Delete All
		</button>
	);
}
