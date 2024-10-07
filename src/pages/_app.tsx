/** @format */

// import store from '@/redux/store';
import store from '@/redux/store';
import Routers from '@/routers/Routers';
import '@/styles/globals.css';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: '#131118',
					},
					components: {},
				}}>
				<Routers Component={Component} pageProps={pageProps} />
			</ConfigProvider>
		</Provider>
	);
}
