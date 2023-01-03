import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import "../styles/globals.css";

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	return (
		<>
			<Head>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					fontFamily: "Poppins, Open Sans, sans serif",
					colorScheme: "dark",
					primaryShade: { light: 6, dark: 8 },
					colors: {
						dark: ["#fafafa", "#f4f4f5", "#e5e5e5", "#d4d4d4", "#a3a3a3", "#737373", "#525252", "#000000", "#262626", "#000000"],
						brand: ["#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337"],
					},
					primaryColor: "brand",
				}}
			>
				<Component {...pageProps} />
			</MantineProvider>
		</>
	);
}
