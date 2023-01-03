import { Box, Button, Container, Flex, Image, Text } from "@mantine/core";
import Layout from "../components/Layout";
import Link from "next/link";

export default function IndexPage() {
	return (
		<Layout title="Cleep">
			<Container>
				<Flex direction="column" align="center" gap={{ base: 35, lg: 60 }} mt={75}>
					<Image src="/logo.png" alt="Cleep logo" width={65} radius="lg" />
					<Text className="text-4xl lg:text-7xl text-center font-semibold">Your real-time online clipboard</Text>
					<Button component={Link} href="/new" variant="filled" size="lg" radius="md" bg="brand" className="bg-rose-600 text-sm">
						Create Session
					</Button>
				</Flex>
			</Container>
		</Layout>
	);
}
