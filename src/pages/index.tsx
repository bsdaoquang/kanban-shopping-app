/** @format */

import { authSelector } from '@/redux/reducers/authReducer';
import React from 'react';
import { useSelector } from 'react-redux';
import HomePage from './HomePage';
import Login from './auth/login';
import { appInfo } from '@/constants/appInfos';

const Home = (data: any) => {
	const pageProps = data.pageProps;

	const auth = useSelector(authSelector);

	return auth.accesstoken ? <HomePage {...pageProps} /> : <Login />;
};

export default Home;

export const getStaticProps = async () => {
	try {
		const res = await fetch(`${appInfo.baseUrl}/promotions?limit=5`);
		const result = await res.json();

		const resCats = await fetch(`${appInfo.baseUrl}/products/get-categories`);
		const resultCats = await resCats.json();

		const resBestSeller = await fetch(
			`${appInfo.baseUrl}/products/get-best-seller`
		);
		const resultsSeller = await resBestSeller.json();

		return {
			props: {
				promotions: result.data,
				categories: resultCats.data,
				bestSellers: resultsSeller.data,
			},
		};
	} catch (error) {
		return {
			props: {
				data: [],
			},
		};
	}
};

// export default HomePage;
