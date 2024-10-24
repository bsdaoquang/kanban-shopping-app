/** @format */

import { ProductItem, Section, TabbarComponent } from '@/components';
import HeadComponent from '@/components/HeadComponent';
import { appInfo } from '@/constants/appInfos';
import { CategoyModel, ProductModel } from '@/models/Products';
import { PromotionModel } from '@/models/PromotionModel';
import { Button, Carousel, Space, Typography } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

const { Title } = Typography;

const HomePage = (data: any) => {
	const pageProps = data.pageProps;
	const {
		promotions,
		categories,
		bestSellers,
	}: {
		promotions: PromotionModel[];
		categories: CategoyModel[];
		bestSellers: ProductModel[];
	} = pageProps;

	const [numOfColumn, setNumOfColumn] = useState(4);
	const [catsArrays, setCatsArrays] = useState<
		{
			key: string;
			values: CategoyModel[];
		}[]
	>([]);

	const catSlideRef = useRef<CarouselRef>(null);
	const router = useRouter();

	const cats =
		categories.length > 0
			? categories.filter((element) => !element.parentId)
			: [];

	useEffect(() => {
		window.addEventListener('resize', (event) => {
			const width = window.innerWidth;
			const index = width <= 480 ? 2 : width <= 768 ? 3 : 4;

			setNumOfColumn(index);
		});

		return () => window.removeEventListener('resize', () => {});
	}, []);

	useEffect(() => {
		const items: any[] = [];
		const numOfDatas = Math.ceil(cats.length / numOfColumn);

		for (let index = 0; index < numOfDatas; index++) {
			const values = cats.splice(0, numOfColumn);

			items.push({
				key: `array${index}`,
				values,
			});
		}

		setCatsArrays(items);
	}, [numOfColumn]);

	return (
		<>
			<HeadComponent title='Home' />
			<div
				className='container-fluid d-none d-md-block'
				style={{ backgroundColor: '#f3f3f3' }}>
				<div className='container'>
					{promotions && promotions.length > 0 && (
						<Carousel
							style={{
								width: '100%',
								height: 500,
							}}>
							{promotions.map((item) => (
								<div key={item._id}>
									<img
										src={item.imageURL}
										style={{
											width: '100%',
											height: 'auto',
											objectFit: 'cover',
											maxHeight: 500,
										}}
										alt=''
									/>
									<div
										style={{
											position: 'absolute',
											top: '50%',
											left: 20,
										}}>
										<Title className='m-0'>{item.title}</Title>
										<Title
											level={3}
											className='m-0'
											style={{ fontWeight: 300 }}>
											UP TO {item.value} {item.type === 'percent' ? '%' : ''}
										</Title>

										<div className='mt-4'>
											<Button
												iconPosition='end'
												size='large'
												icon={<BsArrowRight size={18} />}
												type='primary'>
												Shop now
											</Button>
										</div>
									</div>
								</div>
							))}
						</Carousel>
					)}
				</div>
			</div>
			<div className='container'>
				<Section>
					<TabbarComponent
						title='Shop by Categories'
						right={
							<Space>
								<Button
									size='large'
									type='default'
									icon={<BsArrowLeft size={18} />}
									onClick={() => catSlideRef.current?.prev()}
								/>
								<Button
									size='large'
									type='default'
									icon={<BsArrowRight size={18} />}
									onClick={() => catSlideRef.current?.next()}
								/>
							</Space>
						}
					/>
					<Carousel speed={1500} ref={catSlideRef} autoplay>
						{catsArrays.map((array) => (
							<div>
								<div className='row'>
									{array.values.map((item) => (
										<div className='col'>
											{
												<div>
													<img
														style={{
															width: '100%',

															borderRadius: 12,
														}}
														alt={item.title}
														src={
															item.image ??
															`https://imgcdn.stablediffusionweb.com/2024/4/25/0af7fb7a-9192-47cf-8f7b-7273a51b3e44.jpg`
														}
													/>
													<div
														className='text-center'
														style={{
															position: 'absolute',
															bottom: 10,
															right: 0,
															left: 0,
														}}>
														<Button
															onClick={() =>
																router.push(`/filter-product?catId=${item._id}`)
															}
															style={{ width: '80%' }}
															size='large'>
															{item.title}
														</Button>
													</div>
												</div>
											}
										</div>
									))}
								</div>
							</div>
						))}
					</Carousel>
				</Section>
				<Section>
					<TabbarComponent title='Our Bestseller' />
					<div className='row'>
						{bestSellers.map((item) => (
							<ProductItem item={item} key={item._id} />
						))}
					</div>
				</Section>
			</div>
		</>
	);
};

export const getStaticProps = async () => {
	try {
		const res = await fetch(`${appInfo.baseUrl}/promotions?limit=5`);
		const result = await res.json();

		const resCats = await fetch(`${appInfo.baseUrl}/products/get-categories`);
		const resultCats = await resCats.json();

		const resBestSeller = await fetch(
			`${appInfo.baseUrl}/products/get-best-seller`
		);
		const resultsSeller = await resBestSeller.json();

		return {
			props: {
				promotions: result.data,
				categories: resultCats.data,
				bestSellers: resultsSeller.data,
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

export default HomePage;
