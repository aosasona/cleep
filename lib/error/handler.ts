import { NextApiResponse } from "next";
import CustomException from "./CustomException";

export default function handleError(error: unknown, res: NextApiResponse<any>) {
	if (error instanceof CustomException) {
		return res.status(error.status).json({ status: "error", message: error.message, data: null });
	}
	return res.status(500).json({ status: "error", message: "Internal Server Error", data: null });
}
