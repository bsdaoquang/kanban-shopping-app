/** @format */

import handleAPI from '@/apis/handleApi';
import { CategoyModel } from '@/models/Products';
import {
	Card,
	Drawer,
	Empty,
	List,
	Menu,
	MenuProps,
	Skeleton,
	Typography,
} from 'antd';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

interface Props {
	type: 'card' | 'menu';
}

const CategoriesListCard = (props: Props) => {
	const { type } = props;
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

	return type === 'card' ? (
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
												<List.Item.Meta
													title={
														<Link href={`/shop?catId=${chil._id}`}>
															{chil.title}
														</Link>
													}
												/>
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
	) : (
		<Menu
			items={categories.map((item) => ({
				key: item._id,
				label: item.title,
				children: item.children.map((child) => ({
					key: child._id,
					label: <Link href={`/shop?catId=${child._id}`}>{child.title}</Link>,
				})),
			}))}
		/>
	);
};

export default CategoriesListCard;
