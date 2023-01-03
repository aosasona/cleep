import { Drawer } from "@mantine/core";
import { useState } from "react";

interface NewDocumentProps {
	opened: boolean;
	setOpened: (open: boolean) => void;
	sessionID: string;
	signingKey: string;
}

export default function NewDocument({ sessionID, signingKey, opened, setOpened }: NewDocumentProps) {
	const [content, setContent] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const handleFormSubmit = async () => {};

	return (
		<Drawer opened={opened} onClose={() => setOpened(false)} title="Add" padding="xl" size="xl">
			<form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
				<div className="flex flex-col gap-2">
					<label htmlFor="content" className="text-sm font-semibold">
						Content
					</label>
					<textarea id="content" rows={10} className="border border-gray-300 rounded-md p-2" />
				</div>

				<button type="submit" className="bg-rose-600 text-sm py-3.5 rounded-lg">
					Save
				</button>
			</form>
		</Drawer>
	);
}
