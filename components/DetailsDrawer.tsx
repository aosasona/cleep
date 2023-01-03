import React from "react";
import { DocumentType } from "../types/document";
import { Drawer } from "@mantine/core";

interface DetailsDrawerProps {
	focusedItem: DocumentType | null;
	setFocusedItem: (focusedItem: DocumentType | null) => void;
	handleCopy: (content: string) => void;
}

export default function DetailsDrawer({ focusedItem, setFocusedItem, handleCopy }: DetailsDrawerProps) {
	return (
		<Drawer opened={!!focusedItem} onClose={() => setFocusedItem(null)} title="Content" padding="xl" size="xl">
			{focusedItem?.type === "text" && (
				<React.Fragment>
					<button onClick={() => handleCopy(focusedItem!.content)} className="text-sm font-medium text-rose-600 bg-rose-600 hover:bg-opacity-10 bg-opacity-20 rounded-md px-3 py-1.5 transition-all">
						Copy
					</button>
					<p className="mt-4">{focusedItem!.content}</p>
				</React.Fragment>
			)}

			{focusedItem?.type === "file" && (
				<div className="flex justify-center items-center">
					<img src={focusedItem!.content} alt={focusedItem!.id} className="max-w-full max-h-full rounded-md" />
				</div>
			)}
		</Drawer>
	);
}
