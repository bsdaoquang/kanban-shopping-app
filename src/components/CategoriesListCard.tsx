/** @format */

import handleAPI from '@/apis/handleApi';
import { CategoyModel } from '@/models/Products';
import { Card, Drawer, Empty, List, Skeleton, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

interface Props {
	isVisible: boolean;
	onClose: () => void;
}

const CategoriesListCard = (props: Props) => {
	const { isVisible, onClose } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [categories, setCategories] = useState<CategoyModel[]>([]);

	const WIDTH = window.innerWidth;
	const isShowCategories = ['women', 'men', 'footwear', 'kids'];

	useEffect(() => {
		getCategories();
	}, []);

	const getCategories = async () => {
		const api = `/products/get-categories`;
		setIsLoading(true);
		try {
			const res = await handleAPI({ url: api });
			res && res.data.data && changeListToTreeList(res.data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const changeListToTreeList = (datas: CategoyModel[]) => {
		const items = datas.filter((element) => !element.parentId);

		const values: CategoyModel[] = [];
		items.forEach((item) => {
			const vals = datas.filter((element) => element.parentId === item._id);
			vals.length > 0 &&
				isShowCategories.includes(item.slug) &&
				values.push({ ...item, children: vals });
		});

		setCategories(values);
	};

	return (
		<Card
			className='shadow mt-3'
			style={{
				minWidth: WIDTH * 0.6,
			}}>
			{isLoading ? (
				<Skeleton />
			) : categories.length > 0 ? (
				<>
					<div className='row'>
						{categories.map((item) => (
							<div className='col'>
								<Typography.Title level={5}>{item.title}</Typography.Title>
								{item.children && item.children.length > 0 && (
									<List
										dataSource={item.children}
										renderItem={(chil) => (
											<List.Item
												className='menu-category-list'
												key={chil._id}
												style={{ border: 'none' }}>
												<List.Item.Meta title={chil.title} />
											</List.Item>
										)}
									/>
								)}
							</div>
						))}
					</div>
				</>
			) : (
				<Empty description='Không tìm thấy dữ liệu' />
			)}
		</Card>
	);
};

export default CategoriesListCard;
