/** @format */

import { authSeletor } from '@/redux/reducers/authReducer';
import { Button } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import Login from './auth/Login';

const HomePage = () => {
	const auth = useSelector(authSeletor);

	return auth.token ? <HomePage /> : <Login />;
};

export default HomePage;
