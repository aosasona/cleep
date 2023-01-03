import {
	Container,
	LoadingOverlay,
	Image,
	Flex,
	Text,
	Box,
	Input,
	Button,
} from "@mantine/core";
import Layout from "../components/Layout";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { createSession, hasExistingSession } from "../utils/connection";
import CustomException from "../lib/error/CustomException";
import CustomToaster from "../components/CustomToaster";

export default function NewPage() {
	const router = useRouter();
	const [signingKey, setSigningKey] = useState<string>("");
	const [showKey, setShowKey] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	if (typeof window !== "undefined") {
		if (hasExistingSession()) {
			router.replace("/clipboard");
		}
	}

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			setLoading(true);

			if (signingKey.length < 6) {
				toast.error("Signing key must be at least 8 characters long");
				setLoading(false);
				return;
			}

			const response = await createSession(signingKey);
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

	return (
		<Layout title="New Cleep Session">
			<Container mt={55}>
				<Flex direction="column" align="center">
					<Image src="/logo.png" alt="Cleep logo" width={70} radius="lg" />
					<Box className="w-full sm:w-2/3 md:w-2/4 xl:w-1/3" mt={30}>
						<form className="w-full" onSubmit={handleFormSubmit}>
							<Text size="sm" color="dark.3" align="center" mb={25}>
								Enter a signing key or password, this is used to restrict access
								to your session.
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
									className="w-full placeholder-neutral-700 rounded-lg mb-4"
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
								bg="brand"
								className="bg-rose-600 text-sm w-full"
							>
								Create Session
							</Button>
						</form>
					</Box>
				</Flex>
			</Container>
			<LoadingOverlay visible={loading} overlayBlur={8} overlayOpacity={0.15} />
			<CustomToaster />
		</Layout>
	);
}
