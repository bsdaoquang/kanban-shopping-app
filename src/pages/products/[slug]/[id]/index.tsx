/** @format */

import { CarouselImages } from '@/components';
import HeadComponent from '@/components/HeadComponent';
import { appInfo } from '@/constants/appInfos';
import { ProductModel, SubProductModel } from '@/models/Products';
import { VND } from '@/utils/handleCurrency';
import {
	Breadcrumb,
	Button,
	Checkbox,
	Rate,
	Space,
	Tag,
	Typography,
} from 'antd';
import Link from 'next/link';
import { useState } from 'react';

const { Text, Paragraph, Title } = Typography;

const ProductDetail = ({ pageProps }: any) => {
	const {
		product,
		subProducts,
	}: {
		product: ProductModel;
		subProducts: SubProductModel[];
	} = pageProps.data.data;

	const [detail, setdetail] = useState<ProductModel>(product);
	const [subProductSelected, setSubProductSelected] = useState<SubProductModel>(
		subProducts[0] ?? []
	);

	return (
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

					{/* @daoquang-live */}

					<div className='row mt-3'>
						<div className='col-sm-12 col-md-6'>
							<div className='bg-light text-center p-4'>
								<img
									src={subProductSelected.imgURL ?? ''}
									style={{ width: '80%' }}
									alt=''
								/>
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
										{subProductSelected.qty > 0 ? 'in Stock' : 'out Stock'}
									</Tag>
								</div>
							</div>
							<Space>
								<Rate count={5} />
								<Text type='secondary'>(5.0)</Text>
								<Text type='secondary'>(1.230)</Text>
							</Space>

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
											subProducts.map((item) => (
												<a onClick={() => setSubProductSelected(item)}>
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
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const getStaticProps = async (context: any) => {
	const res = await fetch(
		`${appInfo.baseUrl}/products/detail?id=${context.params.id}`
	);
	const result = await res.json();
	try {
		return {
			props: {
				data: result,
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
