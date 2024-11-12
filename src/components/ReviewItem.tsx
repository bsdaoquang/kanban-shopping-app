/** @format */

import handleAPI from '@/apis/handleApi';
import { ReviewModel } from '@/models/ReviewModel';
import { authSelector } from '@/redux/reducers/authReducer';
import { Avatar, Button, Input, List, Rate, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { useSelector } from 'react-redux';
import ListReviews from './ListReviews';
import { ProfileModel } from '@/models/ProfileModel';
import { BiUser } from 'react-icons/bi';

interface Props {
	item: ReviewModel;
	onAddnew: () => void;
}

const ReviewItem = (props: Props) => {
	const { item, onAddnew } = props;
	const [content, setContent] = useState('');
	const [isReply, setIsReply] = useState(false);
	const [profile, setProfile] = useState<ProfileModel>();

	const auth = useSelector(authSelector);

	useEffect(() => {
		handleGetProfile();
	}, [item]);

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

	const handleGetProfile = async () => {
		const api = `/customers/profile?id=${item.createdBy}`;

		try {
			const res = await handleAPI({ url: api });
			setProfile(res.data.data);
		} catch (error) {
			console.log(console.log(error));
		}
	};

	return (
		<List.Item key={item._id}>
			<List.Item.Meta
				className='review-title'
				title={
					item.createdBy === auth._id
						? 'Me'
						: `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`
				}
				avatar={
					(profile && profile.photoURL) || auth.photoURL ? (
						<Avatar
							size={40}
							src={profile?.photoURL ? profile.photoURL : auth.photoURL}
						/>
					) : (
						<Avatar size={40}>
							<BiUser style={{ marginBottom: -4 }} size={24} />
						</Avatar>
					)
				}
				description={
					<Rate style={{ fontSize: 22 }} defaultValue={item.star} disabled />
				}
			/>

			<>
				<div>{item.comment}</div>
				<Space>
					<Typography.Text type='secondary'>Posted on:</Typography.Text>
					<Typography.Text>{item.createdAt}</Typography.Text>
				</Space>
			</>
			<div className='ml-4'>
				<ListReviews parentId={item._id} />
			</div>

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
