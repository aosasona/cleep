import { Toaster } from "react-hot-toast";

export default function CustomToaster() {
	return <Toaster position="top-right" toastOptions={{ className: "text-xs" }} />;
}
