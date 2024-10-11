/** @format */

import { authSelector, removeAuth } from '@/redux/reducers/authReducer';
import { Button, Menu, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BiCart, BiPowerOff } from 'react-icons/bi';
import { IoHeartOutline, IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

const HeaderComponent = () => {
	const auth = useSelector(authSelector);
	const dispatch = useDispatch();
	const router = useRouter();

	return (
		<div className='p-3'>
			<div className='row'>
				<div className='col'>
					<img src='/images/logo.png' style={{ width: 100 }} alt='' />
				</div>
				<div className='col text-center'>
					<Menu
						style={{ border: 'none' }}
						mode='horizontal'
						items={[
							{
								label: <Link href={'/'}>Home</Link>,
								key: 'home',
							},
							{
								label: <Link href={'/shop'}>Shop</Link>,
								key: 'shop',
								children: [
									{
										key: 'cate',
										label: 'test',
									},
								],
							},
							{
								label: <Link href={'/story'}>Out story</Link>,
								key: 'story',
							},
							{
								label: <Link href={'/blog'}>Blog</Link>,
								key: 'blog',
							},
							{
								label: <Link href={'/contact'}>Contact Us</Link>,
								key: 'contact',
							},
						]}
					/>
				</div>
				<div className='col text-right'>
					<Space>
						<Button icon={<IoSearch size={24} />} type='text' />
						<Button icon={<IoHeartOutline size={24} />} type='text' />
						<Button icon={<BiCart size={24} />} type='text' />

						{auth.accesstoken && auth._id ? (
							<Button
								onClick={() => {
									dispatch(removeAuth({}));
									localStorage.clear();
								}}
								danger
								type='text'
								icon={<BiPowerOff size={23} />}
							/>
						) : (
							<Button
								type='primary'
								onClick={() => router.push('/auth/login')}
								href={`/auth/login`}>
								Login
							</Button>
						)}
					</Space>
				</div>
			</div>
		</div>
	);
};

export default HeaderComponent;
