/** @format */

import handleAPI from '@/apis/handleApi';
import { ReviewModel } from '@/models/ReviewModel';
import { authSelector } from '@/redux/reducers/authReducer';
import { handleChangeFile, uploadFile } from '@/utils/uploadFile';
import {
	Avatar,
	Button,
	Input,
	List,
	Rate,
	Skeleton,
	Space,
	Spin,
	Typography,
	Upload,
	UploadFile,
	UploadProps,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ListReviews from './ListReviews';

interface Props {
	productId: string;
}

const Reviews = (props: Props) => {
	const { productId } = props;

	const [starScore, setStarScore] = useState(0);
	const [comment, setcomment] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [isGetting, setIsGetting] = useState(false);
	const [reviews, setReviews] = useState<ReviewModel[]>([]);

	useEffect(() => {
		getAllReviews();
	}, []);

	const auth = useSelector(authSelector);

	const getAllReviews = async () => {
		const api = `/reviews?id=${productId}`;
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
	const handleSubmitReview = async () => {
		const data = {
			createdBy: auth._id,
			parentId: productId,
			comment,
			star: starScore,
		};
		setIsLoading(true);
		if (fileList.length > 0) {
			try {
				const items: string[] = [];
				fileList.forEach(async (item) => {
					const url = await uploadFile(item.originFileObj);

					items.push(url);

					if (items.length === fileList.length) {
						await handleAddReview({ ...data, images: items });
					}
				});
			} catch (error) {
				console.log(error);
			}
		} else {
			await handleAddReview(data);
		}
	};

	const handleAddReview = async (data: any) => {
		const api = `/reviews/add-new`;

		try {
			const res = await handleAPI({
				url: api,
				data,
				method: 'post',
			});

			setStarScore(0);
			setcomment('');
			setFileList([]);
			getAllReviews();
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		const items: UploadFile[] = handleChangeFile(newFileList);
		setFileList(items);
	};
	return (
		<div className='mb-5'>
			{/* list reviews */}
			{isGetting ? (
				<Spin />
			) : (
				<ListReviews isParent datas={reviews} parentId={productId} />
			)}

			<div className='row'>
				<div className='col-sm-12 col-md-8 col-lg-6'>
					<div className='mt-4 text-center'>
						<Rate
							disabled={isLoading}
							count={5}
							defaultValue={starScore}
							onChange={(val) => setStarScore(val)}
							style={{ fontSize: 42 }}
						/>
					</div>
					<div className='mt-4'>
						<Input.TextArea
							disabled={isLoading}
							value={comment}
							onChange={(val) => setcomment(val.target.value)}
							allowClear
							rows={5}
						/>
					</div>
					<div className='mt-3'>
						<Upload
							fileList={fileList}
							onChange={handleChange}
							accept='image/*'
							listType='picture-card'
							multiple>
							{fileList.length <= 4 ? 'Upload' : null}
						</Upload>
					</div>
					<div className='mt-3 text-right'>
						<Button
							loading={isLoading}
							disabled={!auth._id || !comment}
							type='primary'
							size='large'
							onClick={handleSubmitReview}>
							Submit
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Reviews;
