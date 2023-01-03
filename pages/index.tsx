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
					<Button component={Link} href="/new" variant="filled" size="md" radius="md" bg="brand" className="bg-rose-600 text-xs">
						Get Started
					</Button>
				</Flex>

				<div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 mx-auto mt-16">
					<div className="px-3 lg:px-0">
						<h2 className="text-base lg:text-lg font-semibold lg:font-bold opacity-50 mb-2">How it works</h2>
						<ul className="text-lg lg:text-2xl font-bold leading-loose lg:leading-[2] list-disc list-outside px-4">
							<li>Create a session</li>
							<li>Scan the QR code to join session</li>
							<li>Copy and paste text in real-time across devices</li>
						</ul>
					</div>

					<div className="border-[6px] border-rose-600 rounded-3xl overflow-hidden px-3 py-4">
						<img src="/screen.gif" alt="home" className="w-full max-w-[300px] aspect-[8.5/19] object-cover" />
					</div>
				</div>

				<footer className="text-center lg:text-left text-sm py-10 mt-14">
					Built by{" "}
					<a href="https://twitter.com/trulyao" target="_blank" rel="noreferrer" className="text-rose-600 hover:underline">
						Ayodeji
					</a>
				</footer>
			</Container>
		</Layout>
	);
}
