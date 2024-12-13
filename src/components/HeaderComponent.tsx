/** @format */

import { TransationSubProductModal } from '@/modals';
import { authSelector, removeAuth } from '@/redux/reducers/authReducer';
import { CartItemModel, cartSelector } from '@/redux/reducers/cartReducer';
import { VND } from '@/utils/handleCurrency';
import {
	Affix,
	Avatar,
	Badge,
	Button,
	Card,
	Divider,
	Drawer,
	Dropdown,
	List,
	Menu,
	MenuProps,
	Space,
	Typography,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineTransaction } from 'react-icons/ai';
import { BiCart, BiPowerOff } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoHeartOutline, IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import ButtonRemoveCartItem from './ButtonRemoveCartItem';
import CategoriesListCard from './CategoriesListCard';
import { FaUser } from 'react-icons/fa';

const HeaderComponent = () => {
	const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
	const [visibleModalTransationProduct, setVisibleModalTransationProduct] =
		useState(false);
	const [productSeleted, setProductSeleted] = useState<CartItemModel>();
	const [isVisibleMenuDrawe, setIsVisibleMenuDrawe] = useState(false);

	const auth = useSelector(authSelector);
	const dispatch = useDispatch();
	const router = useRouter();

	console.log(auth);
	const cart: CartItemModel[] = useSelector(cartSelector);
	const items: MenuProps['items'] = [
		{
			key: 'profile',
			label: <Link href={`/profile`}>Profile</Link>,
			icon: <FaUser size={18} />,
		},
		{
			label: 'SignOut',
			icon: <BiPowerOff size={22} />,
			key: 'signout',
			danger: true,
			onClick: () => {
				dispatch(removeAuth({}));
				localStorage.clear();
			},
		},
	];

	return (
		<Affix offsetTop={0}>
			<div className='container-fluid bg-white'>
				<div className='p-3'>
					<div className='row'>
						<div className='d-none d-sm-block d-md-none'>
							<Button
								type='text'
								icon={<GiHamburgerMenu size={22} />}
								onClick={() => setIsVisibleDrawer(true)}
							/>
						</div>
						<div className='col d-none d-md-block'>
							<img src='/images/logo.png' style={{ width: 100 }} alt='' />
						</div>
						<div className='col d-none d-md-block text-center'>
							<Menu
								style={{ border: 'none' }}
								mode='horizontal'
								items={[
									{
										label: <Link href={'/'}>Home</Link>,
										key: 'home',
									},
									{
										label: (
											<Dropdown
												placement='bottom'
												dropdownRender={() => (
													<CategoriesListCard type='card' />
												)}>
												<Typography.Text
													onClick={() => setIsVisibleMenuDrawe(true)}>
													Shop
												</Typography.Text>
											</Dropdown>
										),
										key: 'shop',
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
								<Dropdown
									dropdownRender={() => (
										<Card className='shadow' style={{ minWidth: 480 }}>
											<Typography.Paragraph>
												You have {cart.length} items in your cart
											</Typography.Paragraph>

											<List
												dataSource={cart}
												renderItem={(item) => (
													<List.Item
														key={item._id}
														extra={
															<div>
																<Button
																	onClick={() => {
																		setProductSeleted(item);
																		setVisibleModalTransationProduct(true);
																	}}
																	icon={
																		<AiOutlineTransaction
																			size={22}
																			className='text-muted'
																		/>
																	}
																/>
																<ButtonRemoveCartItem item={item} />
															</div>
														}>
														<List.Item.Meta
															avatar={
																<Avatar
																	src={item.image}
																	size={52}
																	shape='square'
																/>
															}
															title={
																<>
																	<Typography.Text
																		style={{
																			fontWeight: 300,
																			fontSize: '1rem',
																		}}>
																		{item.title}
																	</Typography.Text>
																	<Typography.Paragraph
																		style={{
																			fontWeight: 'bold',
																			fontSize: '1.2rem',
																			marginBottom: 12,
																		}}>
																		{item.count} x {VND.format(item.price)}
																	</Typography.Paragraph>
																</>
															}
															description={`Size: ${item.size}`}
														/>
													</List.Item>
												)}
											/>

											<Divider style={{ margin: '12px 0px' }} />
											<Typography.Title level={4}>
												Subtotal:{' '}
												{VND.format(
													cart.reduce((a, b) => a + b.count * b.price, 0)
												)}
											</Typography.Title>

											<div className='mt-4'>
												<Button
													className='mt-2'
													onClick={() => router.push(`/shop/checkout`)}
													type='primary'
													size='large'
													style={{ width: '100%' }}>
													Checkout
												</Button>
											</div>
										</Card>
									)}>
									<Badge count={cart.length}>
										<BiCart size={24} />
									</Badge>
								</Dropdown>
								<Divider type='vertical' />
								{auth.accesstoken && auth._id ? (
									<Dropdown overlayStyle={{ minWidth: 320 }} menu={{ items }}>
										<Avatar src={auth.photoURL} />
									</Dropdown>
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
				<Drawer
					open={isVisibleDrawer}
					onClick={() => setIsVisibleDrawer(false)}
					placement='left'>
					<CategoriesListCard type='menu' />
				</Drawer>

				{productSeleted && (
					<TransationSubProductModal
						visible={visibleModalTransationProduct}
						onClose={() => setVisibleModalTransationProduct(false)}
						productSelected={productSeleted}
					/>
				)}
			</div>
		</Affix>
	);
};

export default HeaderComponent;
