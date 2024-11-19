import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
/* import { Bruno_Ace_SC, Noto_Serif } from 'next/font/google'; */

import { Root } from '@/components';
import { Providers } from '@/lib/Providers';

import '@telegram-apps/telegram-ui/dist/styles.css';
import 'normalize.css/normalize.css';
import '../assets/globals.css';

/* const noto = Noto_Serif({ 
	subsets: ["latin"],
	variable: '--font-noto',
	display: "swap",
	adjustFontFallback: false,
});
const bruno = Bruno_Ace_SC({
	weight: '400',
	subsets: ['latin'],
	variable: '--font-bruno',
	display: "swap",
	adjustFontFallback: false,
}); */

export const metadata: Metadata = {
	title: 'Portfolio',
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
		<body /* className={`${noto.variable} ${bruno.variable}`} */>
			<Providers>
				<Root>
					<Container>
						{children}
					</Container>
				</Root>
			</Providers>
		</body>
		</html>
	);
}

const Container = ({ children }: PropsWithChildren) => {
	return (
		<main className="container">
			{children}
		</main>
	)
}