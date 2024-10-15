/** @format */

import handleAPI from '@/apis/handleApi';
import HeadComponent from '@/components/HeadComponent';
import { authSelector } from '@/redux/reducers/authReducer';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const HomePage = () => {
	const [promotions, setPromotions] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const auth = useSelector(authSelector);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		setIsLoading(true);
		try {
			await getPromotions();
			await getCategories();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getPromotions = async () => {
		const api = `/promotions`;

		const res = await handleAPI({ url: api });
		setPromotions(res.data.data);
	};

	const getCategories = async () => {
		const api = `/products/get-categories`;
		const res = await handleAPI({ url: api });
	};

	return (
		<>
			<HeadComponent title='fafafa' />
			<div className='container'>
				<div className='row'>
					<div className='col'>
						<Button onClick={getCategories}>Get categories</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;
