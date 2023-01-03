import { Flex, Modal, Text, Box } from "@mantine/core";
import QRCode from "react-qr-code";

interface ConnectionDetailsModalProps {
	opened: boolean;
	setOpened: (opened: boolean) => void;
	connectionUrl: string;
}

export default function ConnectionDetailsModal({ opened, setOpened, connectionUrl }: ConnectionDetailsModalProps) {
	return (
		<Modal opened={opened} onClose={() => setOpened(false)} title="Connect">
			<Flex direction="column" align="center" gap={30}>
				<QRCode value={connectionUrl} />
				<Text size="sm" color="dark.5" align="center">
					Scan this QR code with your phone to connect or copy the link below if you are unable to scan it. You will need your signing key to connect.
				</Text>
				<Box py={16} className="bg-rose-600 bg-opacity-20 rounded-lg">
					<Text size="sm" align="center" color="brand.6">
						{connectionUrl}
					</Text>
				</Box>
			</Flex>
		</Modal>
	);
}
