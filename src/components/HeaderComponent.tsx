/** @format */

import handleAPI from '@/apis/handleApi';
import { authSelector, removeAuth } from '@/redux/reducers/authReducer';
import {
	CartItemModel,
	cartSelector,
	removeProduct,
} from '@/redux/reducers/cartReducer';
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
	Modal,
	Space,
	Typography,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BiCart, BiPowerOff } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoHeartOutline, IoSearch, IoTrash } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

const HeaderComponent = () => {
	const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);

	const auth = useSelector(authSelector);
	const dispatch = useDispatch();
	const router = useRouter();

	const cart: CartItemModel[] = useSelector(cartSelector);

	useEffect(() => {
		cart.length > 0 && handleUpdateCardToDatabase(cart);
	}, [cart]);

	const handleUpdateCardToDatabase = async (data: CartItemModel[]) => {
		data.forEach(async (item) => {
			const api = `/carts/add-new${item._id ? `?id=${item._id}` : ''}`;

			const value = {
				createdBy: item.createdBy,
				count: item.count,
				subProductId: item.subProductId,
				size: item.size,
				color: item.color,
				price: item.price,
				qty: item.qty,
				productId: item.productId,
				image: item.image,
			};

			try {
				const res = await handleAPI({ url: api, data: value, method: 'post' });
			} catch (error) {
				console.log(error);
			}
		});
	};

	const handleRemoveCartItem = async (item: any) => {
		const api = `/carts/remove?id=${item._id}`;

		try {
			await handleAPI({ url: api, data: undefined, method: 'delete' });

			dispatch(removeProduct(item));
		} catch (error) {
			console.log(error);
		}
	};

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
															<Button
																onClick={() =>
																	Modal.confirm({
																		title: 'Confirm',
																		content:
																			'Are you sure you want to remove this item?',
																		onOk: async () => {
																			await handleRemoveCartItem(item);
																		},
																	})
																}
																icon={<IoTrash size={22} />}
																danger
																type='text'
															/>
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
																		fafafa
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
													onClick={() => {}}
													type='primary'
													ghost
													size='large'
													style={{ width: '100%' }}>
													View Cart
												</Button>
												<Button
													className='mt-2'
													onClick={() => {}}
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
				<Drawer
					open={isVisibleDrawer}
					onClick={() => setIsVisibleDrawer(false)}
					placement='left'>
					Helo
				</Drawer>
			</div>
		</Affix>
	);
};

export default HeaderComponent;
