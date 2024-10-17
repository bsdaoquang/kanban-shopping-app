/** @format */

import { Section, TabbarComponent } from '@/components';
import HeadComponent from '@/components/HeadComponent';
import { appInfo } from '@/constants/appInfos';
import { CategoyModel } from '@/models/Products';
import { PromotionModel } from '@/models/PromotionModel';
import { Button, Card, Carousel, Typography } from 'antd';
import { BsArrowRight } from 'react-icons/bs';

const { Title } = Typography;

const HomePage = (data: any) => {
	const pageProps = data.pageProps;

	const {
		promotions,
		categories,
	}: { promotions: PromotionModel[]; categories: CategoyModel[] } = pageProps;

	const cats =
		categories.length > 0
			? categories.filter((element) => !element.parentId)
			: [];

	return (
		<>
			<HeadComponent title='Home' />
			<div className='container-fluid bg-light d-none d-md-block'>
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
					<TabbarComponent title='Shop by Categories' />
					<div
						className='row'
						style={{
							overflow: 'scroll',
							width: '100%',
							position: 'relative',
						}}>
						{cats.map((cat) => (
							<div key={cat._id}>
								<div className='col'>
									<Card
										hoverable
										cover={
											<img src='https://i.pinimg.com/originals/d8/51/45/d851458b9cea15c9b919c58992bb6740.jpg' />
										}
										style={{ width: 150 }}
									/>
								</div>
							</div>
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

		return {
			props: {
				promotions: result.data,
				categories: resultCats.data,
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
