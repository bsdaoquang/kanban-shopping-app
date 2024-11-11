/** @format */

import handleAPI from '@/apis/handleApi';
import HeaderComponent from '@/components/HeaderComponent';
import { localDataNames } from '@/constants/appInfos';
import { addAuth, authSelector } from '@/redux/reducers/authReducer';
import { syncProducts } from '@/redux/reducers/cartReducer';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const { Content, Footer, Header } = Layout;

import { Layout, Spin } from 'antd';

const Routers = ({ Component, pageProps }: any) => {
	const [isLoading, setIsLoading] = useState(false);

	const path = usePathname();
	const dispatch = useDispatch();
	const auth = useSelector(authSelector);

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		getDatabaseDatas();
	}, [auth]);

	const getData = async () => {
		const res = localStorage.getItem(localDataNames.authData);
		res && dispatch(addAuth(JSON.parse(res)));
	};

	const getDatabaseDatas = async () => {
		setIsLoading(true);
		try {
			if (auth._id) {
				await getCardInDatabase();
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getCardInDatabase = async () => {
		const api = `/carts`;
		try {
			const res = await handleAPI({ url: api });

			if (res.data && res.data.data.length > 0) {
				dispatch(syncProducts(res.data.data));
			}
		} catch (error) {}
	};

	const renderContent = (
		<Content>
			<Component pageProps={pageProps} />
		</Content>
	);

	return isLoading ? (
		<Spin />
	) : !auth || !auth.accesstoken ? (
		<Layout className='bg-white'>{renderContent}</Layout>
	) : (
		<Layout className='bg-white'>
			<HeaderComponent />
			<div>{renderContent}</div>
		</Layout>
	);
};

export default Routers;

// login rule 2
// /** @format */

// const Routers = ({ Component, pageProps }: any) => {

// };

// export default Routers;
