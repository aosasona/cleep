import { Box, Button, Container, Drawer, Flex, Grid, LoadingOverlay, Modal, Text } from "@mantine/core";
import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import { destroySession, fetchSessionDocuments, getSessionData, hasExistingSession } from "../utils/connection";
import { useRouter } from "next/router";
import { BASE_URL, SITE_URL } from "../constants/url";
import { io } from "socket.io-client";
import { BsPlus } from "react-icons/bs";
import QRCode from "react-qr-code";
import { DocumentType } from "../types/document";
import { toast } from "react-hot-toast";
import CustomToaster from "../components/CustomToaster";
import ConnectionDetailsModal from "../components/ConnectionDetailsModal";
import DetailsDrawer from "../components/DetailsDrawer";
import NewDocument from "../components/NewDocument";

export default function ClipboardPage() {
	const router = useRouter();

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

			if (!sessionData.signingKey) router.replace("/connect?sessionID=" + sessionData.sessionID);

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
			query: {
				session_id: sessionID,
				signing_key: signingKey,
			},
		});

		socket.connect();

		socket.on("connect", async () => {
			setLoading(false);

			if (!initialFetch) {
				const { data } = await fetchSessionDocuments(sessionID, signingKey);
				setData(data);
				setInitialFetch(true);
			}
		});
	}, [rendered, signingKey, sessionID]);

	const destroy = () => {
		destroySession();
		router.replace("/new");
	};

	const connectionUrl = `${SITE_URL}/connect?sessionID=${sessionID}`;

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
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-medium">Clipboard</h1>
					<Button variant="filled" size="sm" radius="md" className="bg-rose-600 text-xs" onClick={destroy}>
						Destroy session
					</Button>
				</div>

				<button onClick={() => setOpened(true)} className="w-full text-blue-600 bg-blue-600 bg-opacity-25 hover:bg-opacity-10 flex items-center py-6 px-4 mt-8 rounded-lg transition-all">
					<BsPlus size={28} />
					<p>Connect a new device</p>
				</button>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl-grid-cols-4 gap-4 mt-6">
					{data.map((doc) => (
						<div key={doc.id} className="bg-neutral-900 bg-opacity-60 rounded-lg p-4 hover:border border-rose-600 transition-all cursor-pointer" onClick={() => setFocusedItem(doc)}>
							{doc.type === "text" ? <p className="text-neutral-400 text-sm text-ellipsis">{doc.content?.length > 150 ? doc.content.substring(0, 150) + "..." : doc.content}</p> : <img src={doc.content} alt={doc.id} className="aspect-video max-w-full rounded-sm" />}
						</div>
					))}
				</div>

				<button className="bg-rose-600 absolute bottom-6 right-4 p-3 rounded-full" onClick={() => setShowAddModal(true)}>
					<BsPlus size={36} />
				</button>
			</Container>

			<NewDocument opened={showAddModal} setOpened={setShowAddModal} sessionID={sessionID} signingKey={signingKey} />
			<DetailsDrawer focusedItem={focusedItem} setFocusedItem={setFocusedItem} handleCopy={handleCopy} />
			<ConnectionDetailsModal opened={opened} setOpened={setOpened} connectionUrl={connectionUrl} />
			<CustomToaster />
			<LoadingOverlay visible={loading} overlayBlur={8} overlayOpacity={0.15} />
		</Layout>
	);
}
