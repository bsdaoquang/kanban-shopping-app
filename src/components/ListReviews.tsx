/** @format */

import handleAPI from '@/apis/handleApi';
import { ReviewModel } from '@/models/ReviewModel';
import { List, message, Skeleton, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import ReviewItem from './ReviewItem';
import { auth } from '@/firebase/firebaseConfig';
import { useSelector } from 'react-redux';
import { authSelector } from '@/redux/reducers/authReducer';

interface Props {
	parentId: string;
	datas?: ReviewModel[];
	isParent?: boolean;
}

const ListReviews = (props: Props) => {
	const { parentId, datas, isParent } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [reviews, setReviews] = useState<ReviewModel[]>([]);
	const [isLimit, setIsLimit] = useState(true);

	const auth = useSelector(authSelector);

	useEffect(() => {
		if (datas) {
			setReviews(datas);
		} else {
			getAllReviews();
		}
	}, [parentId, datas]);

	const getAllReviews = async () => {
		const api = `/reviews?id=${parentId}${isLimit ? `&limit=5` : ''}`;
		setIsLoading(reviews.length === 0);
		try {
			const res = await handleAPI({ url: api });
			setReviews(res.data.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateLike = async (id: string, type: 'like' | 'dislike') => {
		const items = [...reviews];
		const index = items.findIndex((element) => element._id === id);
		if (index !== -1) {
			const vals = type === 'like' ? items[index].like : items[index].dislike;

			const indexUid = vals.findIndex((element) => element === auth._id);

			if (indexUid !== -1) {
				vals.splice(indexUid, 1);
			} else {
				vals.push(auth._id);
			}

			//

			// if (type === 'like') {
			// 	items[index].like = vals;
			// } else {
			// 	items[index].dislike = vals;
			// }

			try {
				const res = await handleAPI({
					url: `/reviews/update?id=${id}`,
					data:
						type === 'like'
							? {
									like: vals,
									dislike: handleCheckId(items[index].dislike),
							  }
							: {
									dislike: vals,
									like: handleCheckId(items[index].like),
							  },
					method: 'put',
				});

				await getAllReviews();
				// setReviews(items);
			} catch (error) {
				console.log(error);
			}
		} else {
			message.error('Review not found!!');
		}
	};

	const handleCheckId = (vals: string[]) => {
		const data = [...vals];

		const index = data.findIndex((element) => element === auth._id);

		if (index !== -1) {
			data.splice(index, 1);
		} else {
		}

		return data;
	};

	return isLoading ? (
		<Skeleton />
	) : reviews.length > 0 ? (
		<List
			itemLayout='vertical'
			dataSource={reviews}
			renderItem={(item) => (
				<div className=''>
					<ReviewItem
						onChangeLike={(id, type) => handleUpdateLike(id, type)}
						isParent={isParent}
						item={item}
						onAddnew={getAllReviews}
					/>
				</div>
			)}
		/>
	) : null;
};

export default ListReviews;
