import Meta from "./Meta";

interface Props {
	children: React.ReactNode;
	title: string | undefined;
}

export default function Layout({ children, title }: Props) {
	return (
		<>
			<Meta title={title} desc="Your real-time online clipboard" />
			<main>{children}</main>
		</>
	);
}
