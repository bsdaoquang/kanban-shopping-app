/** @format */

import { ProductItem, Section, TabbarComponent } from '@/components';
import HeadComponent from '@/components/HeadComponent';
import { CategoyModel, ProductModel } from '@/models/Products';
import { PromotionModel } from '@/models/PromotionModel';
import { Button, Carousel, Divider, Space, Typography } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

const { Title } = Typography;

interface Props {
	promotions: PromotionModel[];
	categories: CategoyModel[];
	bestSellers: ProductModel[];
}

const HomePage = (props: Props) => {
	// const { promotions, categories, bestSellers } = props;
	const { promotions, categories, bestSellers } = props;

	const [numOfColumn, setNumOfColumn] = useState<number>();
	const [catsArrays, setCatsArrays] = useState<
		{
			key: string;
			values: CategoyModel[];
		}[]
	>([]);

	const catSlideRef = useRef<CarouselRef>(null);
	const router = useRouter();

	const cats =
		categories && categories.length > 0
			? categories.filter((element) => !element.parentId)
			: [];

	useEffect(() => {
		setNumOfColumn(4);
		window.addEventListener('resize', (event) => {
			const width = window.innerWidth;
			const index = width <= 480 ? 2 : width <= 768 ? 3 : 4;

			setNumOfColumn(index);
		});

		return () => window.removeEventListener('resize', () => {});
	}, []);

	useEffect(() => {
		if (numOfColumn) {
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
		}
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
							{promotions &&
								promotions.map((item) => (
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
											<Space>
												<Title
													level={3}
													className='m-0'
													style={{ fontWeight: 300 }}>
													UP TO {item.value}{' '}
													{item.type === 'percent' ? '%' : ''}
												</Title>
												<Divider type='vertical' />
												<Title
													copyable
													level={4}
													className='m-0'
													style={{ fontWeight: 300 }}>
													{item.code}
												</Title>
											</Space>

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
						{catsArrays &&
							catsArrays.map((array) => (
								<div key={`array${Math.floor(Math.random() * 10000)}`}>
									<div className='row'>
										{array.values.map((item, index) => (
											<div className='col-3' key={`index${index}`}>
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
																	router.push(
																		`/filter-product?catId=${item._id}`
																	)
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
						{bestSellers &&
							bestSellers.map((item) => (
								<ProductItem item={item} key={item._id} />
							))}
					</div>
				</Section>
			</div>
		</>
	);
};

export default HomePage;
