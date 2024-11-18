/** @format */

import handleAPI from '@/apis/handleApi';
import { ReviewModel } from '@/models/ReviewModel';
import { authSelector } from '@/redux/reducers/authReducer';
import { Button, List, message, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReviewItem from './ReviewItem';

interface Props {
	parentId: string;
	datas?: ReviewModel[];
	isParent?: boolean;
}

const ListReviews = (props: Props) => {
	const { parentId, datas, isParent } = props;
	const [isLoading, setIsLoading] = useState(false);
	const [reviews, setReviews] = useState<ReviewModel[]>([]);
	const [limit, setLimit] = useState(5);

	const auth = useSelector(authSelector);

	useEffect(() => {
		if (datas) {
			setReviews(datas);
		} else {
			getAllReviews();
		}
	}, [parentId, datas]);

	const getAllReviews = async () => {
		const api = `/reviews?id=${parentId}&limit=${limit !== 5 ? limit : 5}`;
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
		<>
			<List
				itemLayout='vertical'
				dataSource={reviews}
				renderItem={(item) => (
					<ReviewItem
						onChangeLike={(id, type) => handleUpdateLike(id, type)}
						isParent={isParent}
						item={item}
						onAddnew={getAllReviews}
					/>
				)}
			/>
			<div className='mt-4'>
				<Button
					type='link'
					onClick={() => {
						setLimit(limit + 5);
						getAllReviews();
					}}>
					Show all
				</Button>
			</div>
		</>
	) : null;
};

export default ListReviews;
