/** @format */

import { addAuth } from '@/redux/reducers/authReducer';
import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';

const Login = () => {
	const dispatch = useDispatch();

	return (
		<div>
			{/* <Button
				onClick={() =>
					dispatch(
						addAuth({
							token: 'token',
						})
					)
				}>
				Login
			</Button> */}
		</div>
	);
};

export default Login;
