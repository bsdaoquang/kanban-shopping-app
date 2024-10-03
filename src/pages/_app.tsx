/** @format */

import store from '@/redux/store';
import Routers from '@/routers/Routers';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<Routers Component={Component} pageProps={pageProps} />
		</Provider>
	);
}
