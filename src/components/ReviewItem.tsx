/** @format */

import handleAPI from '@/apis/handleApi';
import { ReviewModel } from '@/models/ReviewModel';
import { authSelector } from '@/redux/reducers/authReducer';
import {
	Avatar,
	Button,
	Divider,
	Input,
	List,
	Rate,
	Space,
	Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { useSelector } from 'react-redux';
import ListReviews from './ListReviews';
import { ProfileModel } from '@/models/ProfileModel';
import { BiUser } from 'react-icons/bi';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { DateTime } from '@/utils/dateTime';

interface Props {
	item: ReviewModel;
	onAddnew: () => void;
	isParent?: boolean;
	onChangeLike: (id: string, type: 'like' | 'dislike') => void;
}

const ReviewItem = (props: Props) => {
	const { item, onAddnew, isParent, onChangeLike } = props;
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

			setContent('');
			onAddnew();
		} catch (error) {
			console.log(error);
		}
	};

	/*
		like & dislike 

		- bao nhiêu like và bao nhieu dislike 

		- nếu người này like 
			nếu đã dislike thì phải bỏ dislike 
		
		- nếu dislike 
			nếu đã like thì bỏ like đi 

		
	*/

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
					isParent && (
						<Rate style={{ fontSize: 22 }} defaultValue={item.star} disabled />
					)
				}
			/>

			<>
				<div className=''>{item.comment}</div>
				<div className='mb-2'>
					<Space>
						<Typography.Text type='secondary'>Posted on:</Typography.Text>
						<Typography.Text>
							{DateTime.getShortDateEng(item.createdAt)}
						</Typography.Text>
					</Space>
				</div>
				{item.images && item.images.length > 0 && (
					<Space>
						{item.images.map((url) => (
							<Avatar src={url} size={100} shape='square' />
						))}
					</Space>
				)}
			</>

			<div className='mb-3 mt-2'>
				<Space>
					<Button
						className='p-0'
						size='small'
						type='link'
						onClick={() => setIsReply(!isReply)}>
						Reply
					</Button>
					<Button
						disabled={item.like.includes(auth._id)}
						size='small'
						className={
							item.like.includes(auth._id) ? 'text-info' : 'text-muted'
						}
						onClick={() => onChangeLike(item._id, 'like')}
						type='text'
						icon={
							<FaThumbsUp
								size={14}
								className={
									item.like.includes(auth._id) ? 'text-info' : 'text-muted'
								}
							/>
						}>
						Like ({item.like ? item.like.length : 0})
					</Button>
					<Button
						size='small'
						className={'text-muted'}
						onClick={() => onChangeLike(item._id, 'dislike')}
						type='text'
						icon={<FaThumbsDown size={14} className={'text-muted'} />}>
						Dislike ({item.dislike ? item.dislike.length : 0})
					</Button>
				</Space>
			</div>
			{isReply && (
				<div className='row'>
					<div className='col-sm-12 col-md-8 col-lg-6'>
						<Input
							size='small'
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
					</div>
				</div>
			)}
			<div className='ml-4'>
				<ListReviews parentId={item._id} />
			</div>
		</List.Item>
	);
};

export default ReviewItem;
