/** @format */

import { Layout } from 'antd';
import Link from 'next/link';
import React from 'react';

const HeaderComponent = () => {
	return (
		<Layout.Header>
			<Link href={`/auth/login`}>Login</Link>
		</Layout.Header>
	);
};

export default HeaderComponent;
