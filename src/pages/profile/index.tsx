/** @format */

import { authSelector } from '@/redux/reducers/authReducer';
import { Tabs, TabsProps, Typography } from 'antd';
import { TabsPosition } from 'antd/es/tabs';
import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import ProsionalInfomation from '../../components/PersionalInfomations';

const ProfilePage = () => {
	const [tabPosition, setTabPosition] = useState<TabsPosition>('left');

	const auth = useSelector(authSelector);

	useEffect(() => {
		const WIDTH = window ? window.innerWidth : undefined;

		if (WIDTH) {
			setTabPosition(WIDTH < 768 ? 'top' : 'left');
		}
	}, []);

	const profileTabs: TabsProps['items'] = [
		{
			key: 'edit',
			label: 'Persional Infomations',
			icon: <FaUser size={14} className='text-muted' />,
			children: <ProsionalInfomation />,
		},
	];

	return (
		<div className='container mt-4 mb-4'>
			<Typography.Title level={2} type='secondary'>
				My Profile
			</Typography.Title>
			<div className='mt-4'>
				<Tabs items={profileTabs} tabPosition={tabPosition} />
			</div>
		</div>
	);
};

export default ProfilePage;
