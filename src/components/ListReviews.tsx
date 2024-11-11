/** @format */

import handleAPI from '@/apis/handleApi';
import { ReviewModel } from '@/models/ReviewModel';
import { List, Skeleton, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import ReviewItem from './ReviewItem';

interface Props {
	parentId: string;
}

const ListReviews = (props: Props) => {
	const { parentId } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [reviews, setReviews] = useState<ReviewModel[]>([]);
	const [isLimit, setIsLimit] = useState(true);

	useEffect(() => {
		getAllReviews();
	}, [parentId]);

	const getAllReviews = async () => {
		const api = `/reviews?id=${parentId}${isLimit ? `&limit=5` : ''}`;
		setIsLoading(true);
		try {
			const res = await handleAPI({ url: api });
			setReviews(res.data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return isLoading ? (
		<Skeleton />
	) : reviews.length > 0 ? (
		<List
			itemLayout='vertical'
			dataSource={reviews}
			renderItem={(item) => (
				<div className='ml-4'>
					<ReviewItem item={item} onAddnew={getAllReviews} />
				</div>
			)}
		/>
	) : null;
};

export default ListReviews;
