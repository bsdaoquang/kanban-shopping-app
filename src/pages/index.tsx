/** @format */

import handleAPI from '@/apis/handleApi';
import ButtonComponent from '@/components/ButtonComponent';
import { authSelector } from '@/redux/reducers/authReducer';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const HomePage = () => {
	const auth = useSelector(authSelector);

	useEffect(() => {
		getCategories();
	}, []);

	const getCategories = async () => {
		const api = `/products/get-categories`;

		try {
			const res = await handleAPI({ url: api });
			console.log(res.data);
		} catch (error) {
			console.log(error);
		}
	};
	// JSX
	return (
		<div className='row'>
			<div className='col'>
				<Button onClick={getCategories}>Get categories</Button>
			</div>
		</div>
	);
};

export default HomePage;
