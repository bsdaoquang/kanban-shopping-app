/** @format */

import { SubProductModel } from '@/models/Products';
import { Carousel, Space } from 'antd';
import React, { PropsWithRef, useEffect, useState } from 'react';

interface Props {
	items: SubProductModel[];
	onClick: (val: SubProductModel) => void;
}

const CarouselImages = (props: Props) => {
	const { items, onClick } = props;

	const [images, setImages] = useState<any[][]>([]);

	useEffect(() => {
		const vals: SubProductModel[] = [];

		items.forEach((item) => {
			const imgs = item.images;
			imgs.forEach((img) => vals.push({ ...item, imgURL: img }));
		});

		const nums = Math.ceil(vals.length / 5);
		const imageGroups: SubProductModel[][] = [];
		Array.from({ length: nums }).forEach((item) => {
			const group: SubProductModel[] = vals.splice(0, 5);
			imageGroups.push(group);
		});

		setImages(imageGroups);
	}, [items]);

	return (
		<Carousel autoplay className='mt-4'>
			{images.map((groups, index) => (
				<div key={`image${index}`}>
					<Space key={`groups${index}`}>
						{groups.map((item) => (
							<a key={item._id} onClick={() => onClick(item)}>
								<img
									src={item.imgURL}
									style={{ width: 100, height: 120, objectFit: 'cover' }}
								/>
							</a>
						))}
					</Space>
				</div>
			))}
		</Carousel>
	);
};

export default CarouselImages;
