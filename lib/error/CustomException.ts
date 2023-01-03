export default class CustomException extends Error {
	constructor(message: string, public status: number) {
		super(message);
		this.status = status;
		this.name = "CustomException";
	}
}
