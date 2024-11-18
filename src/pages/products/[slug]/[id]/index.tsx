/** @format */

import handleAPI from '@/apis/handleApi';
import {
	CarouselImages,
	ProductItem,
	Reviews,
	TabbarComponent,
} from '@/components';
import HeadComponent from '@/components/HeadComponent';
import { appInfo } from '@/constants/appInfos';
import { ProductModel, SubProductModel } from '@/models/Products';
import { authSelector } from '@/redux/reducers/authReducer';
import {
	addProduct,
	cartSelector,
	changeCount,
} from '@/redux/reducers/cartReducer';
import { VND } from '@/utils/handleCurrency';
import {
	Breadcrumb,
	Button,
	Empty,
	message,
	Rate,
	Space,
	Tabs,
	Tag,
	Typography,
} from 'antd';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoAddSharp, IoHeartOutline } from 'react-icons/io5';
import { LuMinus } from 'react-icons/lu';
import { PiCableCar } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

const { Text, Paragraph, Title } = Typography;

const ProductDetail = ({ pageProps }: any) => {
	const {
		product,
		subProducts,
	}: {
		product: ProductModel;
		subProducts: SubProductModel[];
	} = pageProps.data.result.data;
	const relatedProducts = pageProps.data.itemCats.data;

	const [detail, setdetail] = useState<ProductModel>(product);
	const [subProductSelected, setSubProductSelected] =
		useState<SubProductModel>();
	const [count, setCount] = useState(1);
	const [instockQuantity, setInstockQuantity] = useState(
		subProductSelected?.qty
	);
	const [reviewDatas, setReviewDatas] = useState<{
		count: number;
		total: number;
	}>();

	const auth = useSelector(authSelector);
	const router = useRouter();
	const params = useParams();
	const id = params ? params.id : '';

	const cart: SubProductModel[] = useSelector(cartSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		if (subProducts.length > 0) {
			setSubProductSelected({
				...subProducts[0],
				imgURL:
					subProducts[0].images.length > 0 ? subProducts[0].images[0] : '',
			});
		}
	}, [subProducts]);

	useEffect(() => {
		setCount(1);
	}, [subProductSelected]);

	useEffect(() => {
		handleGetReviewData();
	}, [id]);

	useEffect(() => {
		const item = cart.find(
			(element) => element._id === subProductSelected?._id
		);
		if (subProductSelected) {
			if (item) {
				const qty = subProductSelected?.qty - item.count;
				setInstockQuantity(qty);
			} else {
				setInstockQuantity(subProductSelected?.qty);
			}
		}
	}, [cart, subProductSelected]);

	const handleCart = async () => {
		if (auth._id && auth.accesstoken) {
			if (subProductSelected) {
				const item = subProductSelected;
				const value = {
					createdBy: auth._id,
					count,
					subProductId: item._id,
					size: item.size,
					title: detail.title,
					color: item.color,
					price: item.discount ? item.discount : item.price,
					qty: item.qty,
					productId: item.productId,
					image: item.images[0] ?? '',
				};

				const index = cart.findIndex(
					(element: any) => element.subProductId === value.subProductId
				);

				try {
					if (index !== -1) {
						await handleAPI({
							url: `/carts/update?id=${cart[index]._id}`,
							data: { count: cart[index].count + count },
							method: 'put',
						});

						dispatch(changeCount({ id: cart[index]._id, val: count }));
					} else {
						const res = await handleAPI({
							url: '/carts/add-new',
							data: value,
							method: 'post',
						});
						dispatch(addProduct(res.data.data));
					}
				} catch (error) {
					console.log(error);
				}
			} else {
				message.error('Please choice a product!!!!');
			}
		} else {
			router.push(`/auth/login?productId=${detail._id}&slug=${detail.slug}`);
		}
	};

	const renderButtonGroup = () => {
		const item = cart.find(
			(element) => element._id === subProductSelected?._id
		);

		return (
			subProductSelected && (
				<>
					<div className='button-groups'>
						<Button
							onClick={() => setCount(count + 1)}
							disabled={
								count ===
								(item
									? (subProductSelected.qty = item.count)
									: subProductSelected.qty)
							}
							type='text'
							icon={<IoAddSharp size={22} />}
						/>
						<Text>{count}</Text>
						<Button
							onClick={() => setCount(count - 1)}
							disabled={count === 1}
							type='text'
							icon={<LuMinus size={22} />}
						/>
					</div>
					<Button
						disabled={item?.count === subProductSelected.qty}
						onClick={handleCart}
						size='large'
						type='primary'
						style={{ minWidth: 200 }}>
						Add to Cart
					</Button>
				</>
			)
		);
	};

	const handleGetReviewData = async () => {
		const api = `/reviews/get-start-count?id=${id}`;
		try {
			const res: any = await handleAPI({ url: api });
			setReviewDatas(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	return subProductSelected ? (
		<div>
			<HeadComponent
				title={detail.title}
				description={detail.description}
				url={`${appInfo.baseUrl}/products/${detail.slug}/${detail._id}`}
			/>
			<div className='container-fluid mt-3 mb-5'>
				<div className='container'>
					<Breadcrumb
						items={[
							{
								key: 'home',
								title: <Link href={'/'}>Home</Link>,
							},
							{
								key: 'shop',
								title: <Link href={'/shop'}>Shop</Link>,
							},
							{
								key: 'title',
								title: product.title,
							},
						]}
					/>

					<div className='row mt-3'>
						<div className='col-sm-12 col-md-6'>
							<div className='bg-light text-center p-4'>
								{!subProductSelected.imgURL &&
								subProductSelected.images.length == 0 ? (
									<PiCableCar size={48} className='text-muted' />
								) : (
									<img
										style={{ width: '80%' }}
										src={
											subProductSelected.imgURL
												? subProductSelected.imgURL
												: subProductSelected.images.length > 0
												? subProductSelected.images[0]
												: ''
										}
									/>
								)}
							</div>
							<CarouselImages
								items={subProducts}
								onClick={(val) => setSubProductSelected(val)}
							/>
						</div>

						<div className='col'>
							<div className='row'>
								<div className='col'>
									<Typography.Title className='m-0' level={2}>
										{detail.supplier}
									</Typography.Title>
									<Typography.Title
										className='mt-0'
										style={{ fontWeight: 300 }}
										level={4}>
										{detail.title}
									</Typography.Title>
								</div>
								<div>
									<Tag color={subProductSelected.qty > 0 ? 'success' : 'error'}>
										{subProductSelected.qty > 0
											? `In Stock (${instockQuantity})`
											: 'out Stock'}
									</Tag>
								</div>
							</div>
							{reviewDatas && (
								<Space>
									<Rate
										disabled
										allowHalf
										defaultValue={reviewDatas.count}
										count={5}
									/>
									<Text type='secondary'>({reviewDatas?.count})</Text>
									<Text type='secondary'>({reviewDatas.total}) reviews</Text>
								</Space>
							)}

							<div className='mt-3'>
								<Space>
									<Title
										className='mt-0 '
										style={{ fontWeight: 400, textDecoration: '' }}
										level={3}>
										{VND.format(
											subProductSelected.discount ?? subProductSelected.price
										)}
									</Title>
									{subProductSelected.discount && (
										<Title
											type='secondary'
											className='mt-0 '
											style={{
												fontWeight: 300,
												textDecoration: 'line-through',
											}}
											level={3}>
											{VND.format(subProductSelected.price)}
										</Title>
									)}
								</Space>
								<div className='mt-3'>
									<Paragraph style={{ textAlign: 'justify', fontSize: '1rem' }}>
										{detail.description}
									</Paragraph>
								</div>

								<div className='mt-3'>
									<Paragraph
										style={{
											fontWeight: 'bold',
											fontSize: '1.1rem',
											marginBottom: 8,
										}}>
										Colors
									</Paragraph>
									<Space>
										{subProducts.length > 0 &&
											subProducts.map((item, index) => (
												<a
													key={`${item.color}-${index}`}
													onClick={() => setSubProductSelected(item)}>
													<div
														className='color-item'
														style={{ background: item.color }}
													/>
												</a>
											))}
									</Space>
								</div>
								<div className='mt-3'>
									<Paragraph
										style={{
											fontWeight: 'bold',
											fontSize: '1.1rem',
											marginBottom: 8,
										}}>
										Sizes
									</Paragraph>
									<Space>
										{subProducts.length > 0 &&
											subProducts.map((item) => (
												<Button
													key={item.size}
													type={
														subProductSelected.size === item.size
															? 'primary'
															: 'default'
													}
													onClick={() => setSubProductSelected(item)}>
													{item.size}
												</Button>
											))}
									</Space>
								</div>
								<div className='mt-5'>
									<Space>
										{renderButtonGroup()}
										<Button size='large' icon={<IoHeartOutline size={22} />} />
									</Space>
								</div>
							</div>
						</div>
					</div>
					<div className='mt-4'>
						<Tabs
							items={[
								{
									key: '1',
									label: 'Description',
									children: (
										<>
											<p>
												Lorem ipsum dolor, sit amet consectetur adipisicing
												elit. Dolor temporibus esse nam est, velit quae tempora.
												Voluptatum laborum facere consequatur. Cum, et labore id
												aut nisi veniam. Et, dolor! Tempora?
											</p>
										</>
									),
								},
								{
									key: '2',
									label: 'Additional Infomations',
									children: (
										<>
											<p>Additional Infomations</p>
										</>
									),
								},
								{
									key: '3',
									label: 'Reviews',
									children: id ? (
										<Reviews productId={id as string} />
									) : (
										<Empty />
									),
								},
							]}
						/>
					</div>
					<div className='mt-4'>
						<TabbarComponent title='Related products' />
						<div className='row'>
							{relatedProducts.length > 0 &&
								relatedProducts.map((item: ProductModel) => (
									<ProductItem item={item} key={item._id} />
									// </div>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

export const getStaticProps = async (context: any) => {
	const res = await fetch(
		`${appInfo.baseUrl}/products/detail?id=${context.params.id}`
	);

	const resCats = await fetch(
		`${appInfo.baseUrl}/products/get-related-products?id=${context.params.id}`
	);
	const result = await res.json();
	const itemCats = await resCats.json();
	try {
		return {
			props: {
				data: { result, itemCats },
			},
		};
	} catch (error) {
		return {
			props: {
				data: [],
			},
		};
	}
};

export const getStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking',
	};
};

export default ProductDetail;
