export interface DocumentType {
	id: string;
	content: string;
	type: "text" | "file";
	created_at: string;
	updated_at: string;
}
