/** @format */
import { Layout, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { localDataNames } from '../constants/appInfos';
import { addAuth, authSeletor, AuthState } from '../redux/reducers/authReducer';

const { Content, Footer, Header } = Layout;

const Routers = ({ Component, pageProps }: any) => {
	const [isLoading, setIsLoading] = useState(false);

	const auth: AuthState = useSelector(authSeletor);
	const dispatch = useDispatch();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		// const res = localStorage.getItem(localDataNames.authData);
		// res && dispatch(addAuth(JSON.parse(res)));
	};

	return isLoading ? (
		<Spin />
	) : !auth.token ? (
		<Layout>
			<Content>
				<Component pageProps={pageProps} />
			</Content>
		</Layout>
	) : (
		<Layout>
			<Header />
			<Content>
				<Component pageProps={pageProps} />
			</Content>
			<Footer />
		</Layout>
	);
};

export default Routers;
