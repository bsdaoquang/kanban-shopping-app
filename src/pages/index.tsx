/** @format */

import { authSelector } from '@/redux/reducers/authReducer';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HomePage from './HomePage';
import { appInfo } from '@/constants/appInfos';
import Login from './auth/login';
import { PromotionModel } from '@/models/PromotionModel';
import { CategoyModel, ProductModel } from '@/models/Products';
import handleAPI from '@/apis/handleApi';
import { Empty, Skeleton } from 'antd';

const Home = (data: any) => {
	const pageProps = data.pageProps;

	const [values, setValues] = useState<any>();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getDatas();
	}, []);

	const getDatas = async () => {
		setIsLoading(true);
		try {
			// await getPromotions();
			await getCategories();
			// await getProducts();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChangeValues = (key: string, vals: any) => {
		const items = { ...values };
		items[key] = vals;
		setValues(items);
	};

	const getPromotions = async () => {
		const res = await handleAPI({ url: `/promotions?limit=5` });

		res &&
			res.data &&
			res.data.data &&
			handleChangeValues('promotions', res.data.data);
	};

	const getCategories = async () => {
		const res = await handleAPI({ url: `/products/get-categories` });
		res &&
			res.data &&
			res.data.data &&
			res.data.data.length > 0 &&
			handleChangeValues('categories', res.data.data);
	};

	const getProducts = async () => {
		const res = await handleAPI({ url: `/products/get-best-seller` });
		res &&
			res.data &&
			res.data.data &&
			handleChangeValues('bestSeller', res.data.data);
	};

	return isLoading ? (
		<Skeleton />
	) : values && values.categories ? (
		<HomePage {...values} />
	) : (
		<Empty />
	);
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
