/** @format */

import handleAPI from '@/apis/handleApi';
import { apiNames } from '@/constants/apiNames';
import { addAuth } from '@/redux/reducers/authReducer';
import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';

const Login = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	return (
		<div>
			<Link href={'/auth/signup'}>SignUP</Link>
		</div>
	);
};

export default Login;
