/** @format */
import HeaderComponent from '@/components/HeaderComponent';
import { authSelector } from '@/redux/reducers/authReducer';
import { Layout, Spin } from 'antd';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const { Content, Footer, Header } = Layout;

const Routers = ({ Component, pageProps }: any) => {
	const [isLoading, setIsLoading] = useState(false);

	const path = usePathname();

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		// const res = localStorage.getItem(localDataNames.authData);
		// res && dispatch(addAuth(JSON.parse(res)));
	};

	const renderContent = (
		<Content>
			<Component pageProps={pageProps} />
		</Content>
	);

	return isLoading ? (
		<Spin />
	) : path && path.includes('auth') ? (
		<Layout className='bg-white'>{renderContent}</Layout>
	) : (
		<Layout className='bg-white'>
			<HeaderComponent />
			{renderContent}
			<Footer />
		</Layout>
	);
};

export default Routers;
