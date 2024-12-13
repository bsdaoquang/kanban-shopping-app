/** @format */

import handleAPI from '@/apis/handleApi';
import { AddressModal } from '@/modals';
import { addAuth, authSelector } from '@/redux/reducers/authReducer';
import { uploadFile } from '@/utils/uploadFile';
import { Button, Form, Input, Upload, UploadFile } from 'antd';
import { useEffect, useState } from 'react';
import { BiCamera, BiEdit } from 'react-icons/bi';
import { FaLocationDot } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';

const PersionalInfomations = () => {
	const [avatarList, setAvatarList] = useState<UploadFile[]>([]);
	const [isVisibleModalAddress, setIsVisibleModalAddress] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	const [form] = Form.useForm();
	const auth = useSelector(authSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		form.setFieldsValue(auth);
	}, []);

	const handleVaues = async (values: any) => {
		const data: any = {};

		for (const i in values) {
			data[i] = values[i] ?? '';
		}

		try {
			if (avatarList.length > 0) {
				delete data.photoUrl;
				const file = avatarList[0];
				const url = await uploadFile(file.originFileObj);

				data.photoURL = url;

				await updateProfile(data);
			} else {
				await updateProfile(data);
			}
		} catch (error) {
			console.log(error);
			setIsUpdating(false);
		}
	};

	const updateProfile = async (data: any) => {
		try {
			const api = `/customers/update`;

			const res = await handleAPI({
				url: api,
				data: {
					...data,
					name: `${data.firstName} ${data.lastName}`,
				},
				method: 'put',
			});
			dispatch(addAuth({ ...auth, ...res.data.data }));
		} catch (error) {
			console.log(error);
		} finally {
			setIsUpdating(false);
		}
	};

	return (
		<>
			<Form
				disabled={isUpdating}
				layout='vertical'
				onFinish={handleVaues}
				size='large'
				form={form}>
				<div className='row d-flex'>
					<div className='col'>
						<Form.Item name={'photoUrl'}>
							<Upload
								onChange={(val) => {
									const { fileList } = val;
									setAvatarList(
										fileList.map((item) => ({
											...item,
											url: item.originFileObj
												? URL.createObjectURL(item.originFileObj)
												: '',
										}))
									);
								}}
								fileList={avatarList}
								listType='picture-circle'
								accept='image/*'
								style={{
									width: 50,
								}}>
								{avatarList.length > 0 ? null : (
									<BiCamera size={28} className='text-muted' />
								)}
							</Upload>
						</Form.Item>
					</div>

					<div className='col text-right'>
						<Button
							type='primary'
							onClick={() => form.submit()}
							icon={<BiEdit size={22} />}>
							Save
						</Button>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<Form.Item name={'firstName'} label='First name'>
							<Input allowClear />
						</Form.Item>
					</div>
					<div className='col'>
						<Form.Item name={'lastName'} label='Last name'>
							<Input allowClear />
						</Form.Item>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<Form.Item name={'phoneNumber'} label='Phone number'>
							<Input allowClear />
						</Form.Item>
					</div>
					<div className='col'>
						<Form.Item name={'email'} label='Email address'>
							<Input allowClear />
						</Form.Item>
					</div>
				</div>
				<Form.Item name={'address'} label='Address'>
					<Input
						allowClear
						suffix={
							<FaLocationDot
								onClick={() => setIsVisibleModalAddress(true)}
								size={22}
								className='text-danger m-0	'
							/>
						}
					/>
				</Form.Item>
			</Form>

			<AddressModal
				onAddAddress={(val) => {
					form.setFieldValue('address', val);
				}}
				visible={isVisibleModalAddress}
				onClose={() => setIsVisibleModalAddress(false)}
			/>
		</>
	);
};

export default PersionalInfomations;
