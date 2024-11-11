/** @format */

import handleAPI from '@/apis/handleApi';
import { ReviewModel } from '@/models/ReviewModel';
import { authSelector } from '@/redux/reducers/authReducer';
import { Avatar, Button, Input, List, Rate, Space, Typography } from 'antd';
import { useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { useSelector } from 'react-redux';
import ListReviews from './ListReviews';

interface Props {
	item: ReviewModel;
	onAddnew: () => void;
}

const ReviewItem = (props: Props) => {
	const { item, onAddnew } = props;
	const [content, setContent] = useState('');
	const [isReply, setIsReply] = useState(false);

	const auth = useSelector(authSelector);

	const handleReply = async () => {
		const api = `/reviews/add-new`;
		const data = {
			createdBy: auth._id,
			parentId: item._id,
			comment: content,
		};
		try {
			const res = await handleAPI({
				url: api,
				data,
				method: 'post',
			});

			console.log(res);
			setContent('');
			onAddnew();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<List.Item
			key={item._id}
			actions={[
				<Space>
					<Typography.Text type='secondary'>Posted on:</Typography.Text>
					<Typography.Text>{item.createdAt}</Typography.Text>
				</Space>,
			]}>
			<List.Item.Meta
				className='review-title'
				title={item.createdBy === auth._id ? 'Me' : 'Name'}
				avatar={
					<Avatar
						size={40}
						src={
							item.createdBy === auth._id && auth.photoUrl ? auth.photoUrl : ''
						}
					/>
				}
				description={
					<Rate style={{ fontSize: 22 }} defaultValue={item.star} disabled />
				}
			/>
			{item.comment}
			<ListReviews parentId={item._id} />
			<Button size='small' type='link' onClick={() => setIsReply(!isReply)}>
				Reply
			</Button>
			{isReply && (
				<Input
					onPressEnter={handleReply}
					value={content}
					onChange={(val) => setContent(val.target.value)}
					allowClear
					suffix={
						<Button
							type='text'
							icon={
								<IoIosSend
									className='text-info'
									size={24}
									onClick={handleReply}
								/>
							}
						/>
					}
				/>
			)}
		</List.Item>
	);
};

export default ReviewItem;
