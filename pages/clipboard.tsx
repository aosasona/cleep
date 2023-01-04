import {
	Box,
	Button,
	Container,
	Drawer,
	Flex,
	Grid,
	LoadingOverlay,
	Modal,
	Text,
} from "@mantine/core";
import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import {
	destroySession,
	fetchSessionDocuments,
	getSessionData,
	hasExistingSession,
} from "../utils/connection";
import { useRouter } from "next/router";
import { BASE_URL, SITE_URL } from "../constants/url";
import { io } from "socket.io-client";
import { BsPlus, BsX } from "react-icons/bs";
import QRCode from "react-qr-code";
import { DocumentType } from "../types/document";
import { toast } from "react-hot-toast";
import CustomToaster from "../components/CustomToaster";
import ConnectionDetailsModal from "../components/ConnectionDetailsModal";
import DetailsDrawer from "../components/DetailsDrawer";
import NewDocument from "../components/NewDocument";

export default function ClipboardPage() {
	const router = useRouter();

	const [reconnectCount, setReconnectCount] = useState<number>(0);
	const [connected, setConnected] = useState<boolean>(false);
	const [showAddModal, setShowAddModal] = useState<boolean>(false);
	const [opened, setOpened] = useState<boolean>(false);
	const [rendered, setRendered] = useState<boolean>(false);
	const [initialFetch, setInitialFetch] = useState<boolean>(false);
	const [focusedItem, setFocusedItem] = useState<DocumentType | null>(null);
	const [signingKey, setSigningKey] = useState<string>("");
	const [sessionID, setSessionID] = useState<string>("");
	const [data, setData] = useState<DocumentType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	if (typeof window !== "undefined") {
		if (!hasExistingSession()) router.replace("/new");

		if (!rendered) {
			const sessionData = getSessionData();

			if (!sessionData.signingKey)
				router.replace("/connect?sessionID=" + sessionData.sessionID);

			setSessionID(sessionData.sessionID);
			setSigningKey(sessionData.signingKey);
			setRendered(true);
		}
	}

	useEffect(() => {
		if (!(sessionID && signingKey)) return;

		const socket = io(`${BASE_URL}`, {
			autoConnect: true,
			transports: ["websocket", "polling"],
			reconnectionAttempts: 3,
			query: {
				session_id: sessionID,
				signing_key: signingKey,
			},
		});

		socket.connect();

		socket.on("connect", async () => {
			setLoading(false);
			setConnected(true);

			if (!initialFetch) {
				try {
					const { data } = await fetchSessionDocuments(sessionID, signingKey);
					setData(data);
					setInitialFetch(true);
				} catch (err) {
					toast.error("Failed to fetch session documents");
				}
			}
		});

		socket.on("new_cleep", (incomingData: DocumentType) => {
			const containsData = data.find((item) => item.id == incomingData.id);
			if (!containsData) {
				handleNewCleep(incomingData);
			}
		});

		socket.on("connect_error", (err) => {
			setConnected(false);
			setReconnectCount((prev) => prev + 1);

			if (reconnectCount >= 3) {
				toast.error("Failed to connect to server");
				setReconnectCount(0);
			}
		});

		socket.on("disconnected", () => {
			setConnected(false);
		})

		socket.on("reconnect", () => {
			setConnected(true);
			toast.success("Reconnected to server");
		});

		return () => {
			socket.disconnect();
		};
	}, [rendered, signingKey, sessionID]);

	const destroy = () => {
		destroySession();
		router.replace("/new");
	};

	const connectionUrl = `${SITE_URL}/connect?sessionID=${sessionID}`;

	const handleNewCleep = (data: DocumentType) => {
		setData((prev) => [data, ...prev]);
	};

	const handleCopy = (text: string) => {
		try {
			navigator.clipboard.writeText(text);
			toast.success("Copied to clipboard");
		} catch (err) {
			toast.error("Failed to copy to clipboard");
		}
	};

	return (
		<Layout title="Cleep">
			<Container pt={25} className="relative min-h-screen">
				<div className="fixed top-0 left-0 w-screen bg-black bg-opacity-50 backdrop-blur-lg flex justify-between items-center py-5 px-5">
					<h1 className="text-3xl font-medium">Cleep</h1>
					<Button
						variant="filled"
						size="sm"
						radius="md"
						className="bg-rose-600 text-xs p-2"
						onClick={destroy}
					>
						<BsX size={20} />
					</Button>
				</div>

				<button
					onClick={() => setOpened(true)}
					className="w-full text-blue-600 text-sm bg-blue-600 bg-opacity-25 hover:bg-opacity-10 flex items-center p-4 mt-[8vh] rounded-lg transition-all"
				>
					<BsPlus size={28} />
					<p>Connect a new device</p>
				</button>

				<div className="fixed bottom-6 left-4 w-max flex items-center gap-2 text-xs bg-neutral-900 bg-opacity-80 backdrop-blur-lg text-neutral-400 rounded-lg px-3 py-2 mt-4">
					<div className="w-3 h-3 rounded-full" style={{ backgroundColor: connected ? "green" : "red"  }} />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl-grid-cols-4 gap-4 mt-6">
					{data.map((doc, index) => (
						<div
							key={index}
							className="w-full bg-neutral-900 bg-opacity-60 rounded-lg p-4 hover:border border-rose-600 transition-all cursor-pointer whitespace-pre-wrap"
							onClick={() => setFocusedItem(doc)}
						>
							{doc.type === "text" ? (
								<p className="text-neutral-400 text-sm text-ellipsis">
									{doc.content?.length > 150
										? doc.content.substring(0, 150) + "..."
										: doc.content
									}
								</p>
							) : (
								<img
									src={doc.content}
									alt={doc.id}
									className="aspect-video max-w-full rounded-sm"
								/>
							)}
						</div>
					))}
				</div>

				<button
					className="bg-rose-600 fixed bottom-6 right-4 p-3 rounded-full"
					onClick={() => setShowAddModal(true)}
				>
					<BsPlus size={36} />
				</button>
			</Container>

			<NewDocument
				opened={showAddModal}
				setOpened={setShowAddModal}
				sessionID={sessionID}
				signingKey={signingKey}
			/>
			<DetailsDrawer
				focusedItem={focusedItem}
				setFocusedItem={setFocusedItem}
				handleCopy={handleCopy}
			/>
			<ConnectionDetailsModal
				opened={opened}
				setOpened={setOpened}
				connectionUrl={connectionUrl}
				handleCopy={handleCopy}
			/>
			<CustomToaster />
			<LoadingOverlay visible={loading} overlayBlur={8} overlayOpacity={0.15} />
		</Layout>
	);
}
