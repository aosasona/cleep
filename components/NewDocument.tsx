import { Drawer, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import CustomToaster from "./CustomToaster";
import { saveDocument } from "../utils/connection";
import toast from "react-hot-toast";
import CustomException from "../lib/error/CustomException";

interface NewDocumentProps {
	opened: boolean;
	setOpened: (open: boolean) => void;
	sessionID: string;
	signingKey: string;
}

export default function NewDocument({ sessionID, signingKey, opened, setOpened }: NewDocumentProps) {
	const [content, setContent] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			setLoading(true);

			if (!content) throw new CustomException("Content is required", 400);

			const response = await saveDocument(sessionID, signingKey, { text: content });
			if (!response.success) throw new CustomException(response.message, response.code);

			setContent("");
			setOpened(false);
		} catch (err: any) {
			toast.error(err?.response?.data?.message || err?.name === "CustomException" ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const pasteClipboardContent = async () => {
		try {
			const clipboardContent = await navigator.clipboard.readText();
			setContent(clipboardContent);
		} catch (err) {
			toast.error("Unable to paste clipboard content");
		}
	};

	return (
		<>
			<Drawer opened={opened} onClose={() => setOpened(false)} title="Add" padding="xl" size="xl">
				<form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
					<div className="flex flex-col gap-2">
						<label htmlFor="content" className="text-sm font-semibold">
							Content
						</label>
						<textarea id="content" onChange={(e) => setContent(e.target.value)} value={content} rows={10} className="bg-neutral-900 focus:outline-none rounded-md resize-y p-2.5" />
					</div>

					<div className="w-full flex gap-3">
						<button type="submit" className="w-full bg-rose-600 text-sm py-3.5 rounded-lg">
							Save
						</button>

						<button type="button" onClick={pasteClipboardContent} className="w-full bg-blue-600 bg-opacity-20 text-blue-600 hover:bg-opacity-10 text-sm py-3.5 px-2 rounded-lg transition-all">
							Paste from Clipboard
						</button>
					</div>
				</form>
			</Drawer>
			<LoadingOverlay visible={loading} overlayBlur={8} overlayOpacity={0.15} />
			<CustomToaster />
		</>
	);
}
