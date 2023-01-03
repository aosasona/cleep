import {
	Container,
	Input,
	Image,
	Box,
	Text,
	Button,
	Flex,
	LoadingOverlay,
} from "@mantine/core";
import Layout from "../components/Layout";
import CustomToaster from "../components/CustomToaster";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import {
	destroySession,
	hasExistingSession,
	hasExistingSigningKey,
	saveSigningKey,
} from "../utils/connection";
import CustomException from "../lib/error/CustomException";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ConnectPage() {
	const router = useRouter();
	const [signingKey, setSigningKey] = useState<string>("");
	const [showKey, setShowKey] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	if (typeof window !== "undefined") {
		if (hasExistingSession() && hasExistingSigningKey()) {
			router.replace("/clipboard");
		}
	}

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			setLoading(true);

			const sessionID = router.query.sessionID as string;

			if (signingKey.length < 6) {
				toast.error("Signing key must be at least 8 characters long");
				setLoading(false);
				return;
			}

			const response = await saveSigningKey(sessionID, signingKey);

			if (!response.success)
				throw new CustomException(response.message, response.code);
		} catch (err: any) {
			toast.error(
				err?.name?.toLowerCase() == "customexception"
					? err.message
					: "An error occurred"
			);
		} finally {
			setLoading(false);
		}
	};

	const destroy = () => {
		destroySession();
		router.replace("/new");
	};

	return (
		<Layout title="Join Cleep Session">
			<Container mt={55}>
				<Flex direction="column" align="center">
					<Image src="/logo.png" alt="Cleep logo" width={70} radius="lg" />
					<Box className="w-full sm:w-2/3 md:w-2/4 xl:w-1/3" mt={30}>
						<form className="w-full" onSubmit={handleFormSubmit}>
							<Text size="sm" color="dark.3" align="center" mb={25}>
								Enter the signing key to join this session
							</Text>

							<Flex align="center" gap={6}>
								<Input
									type={showKey ? "text" : "password"}
									value={signingKey}
									bg="dark.8"
									px={14}
									py={8}
									variant="unstyled"
									onChange={(e) => setSigningKey(e.currentTarget.value)}
									className="w-full placeholder-neutral-800 text-white rounded-lg"
								/>
								<Button
									onClick={() => setShowKey(!showKey)}
									className="hover:bg-transparent"
								>
									{showKey ? <FiEyeOff /> : <FiEye />}
								</Button>
							</Flex>

							<Button
								type="submit"
								variant="filled"
								size="lg"
								radius="md"
								mt={25}
								className="bg-rose-600 text-sm w-full"
							>
								Join
							</Button>
						</form>

						<div className="flex justify-center mt-6">
							<button onClick={destroy} className="text-xs text-rose-600 p-2">
								Clear Session
							</button>
						</div>
					</Box>
				</Flex>
			</Container>
			<LoadingOverlay visible={loading} overlayBlur={8} overlayOpacity={0.15} />
			<CustomToaster />
		</Layout>
	);
}
