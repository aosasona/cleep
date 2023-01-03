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

					<button type="submit" className="bg-rose-600 text-sm py-3.5 rounded-lg">
						Save
					</button>
				</form>
			</Drawer>
			<LoadingOverlay visible={loading} overlayBlur={8} overlayOpacity={0.15} />
			<CustomToaster />
		</>
	);
}
