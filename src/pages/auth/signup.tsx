/** @format */

import handleAPI from '@/apis/handleApi';
import { addAuth } from '@/redux/reducers/authReducer';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

interface SignUp {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

const SignUp = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isAgree, setIsAgree] = useState(true);

	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const router = useRouter();

	const handleSignUp = async (values: SignUp) => {
		const api = `/customers/add-new`;
		setIsLoading(true);

		try {
			const res = await handleAPI({ url: api, data: values, method: 'post' });

			if (res.data) {
				const auth = res.data.data;
				dispatch(addAuth(auth));
				localStorage.setItem('authData', JSON.stringify(auth));
			}

			router.push('/');
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container-fluid' style={{ height: '100vh' }}>
			<div className='row' style={{ height: '100vh' }}>
				<div
					className='d-none d-md-block col-6 p-0'
					style={{
						backgroundImage: `url(/images/bg-auth-1.png)`,
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat',
					}}>
					<div className='mt-5 ml-5' style={{ backgroundColor: 'transparent' }}>
						<img
							src='/images/logo.png'
							alt=''
							style={{ backgroundColor: 'transparent' }}
						/>
					</div>
				</div>
				<div className='col-sm-12 col-md-6'>
					<div
						className='container d-flex'
						style={{ height: '100%', alignItems: 'center' }}>
						<div className='col-sm-12 col-md-12 col-lg-8 offset-lg-2'>
							<div className='mb-4'>
								<Typography.Title className='m-0'>
									Create new account
								</Typography.Title>
								<Typography.Paragraph type='secondary'>
									Please enter detail
								</Typography.Paragraph>
							</div>
							<Form
								disabled={isLoading}
								form={form}
								layout='vertical'
								onFinish={handleSignUp}
								size='large'>
								<Form.Item name={'firstName'} label='First Name'>
									<Input placeholder='' allowClear />
								</Form.Item>
								<Form.Item name={'lastName'} label='Last Name'>
									<Input placeholder='' allowClear />
								</Form.Item>
								<Form.Item
									name={'email'}
									label='Email'
									rules={[
										{
											required: true,
											message: 'Please enter your email!',
										},
									]}>
									<Input placeholder='' type='email-address' allowClear />
								</Form.Item>
								<Form.Item
									name={'password'}
									label='Password'
									rules={[
										{
											message: 'Please enter your password!!',
											required: true,
										},
									]}>
									<Input placeholder='' allowClear />
								</Form.Item>
							</Form>
							<div className='mt-4'>
								<Checkbox
									onChange={(val) => setIsAgree(val.target.checked)}
									checked={isAgree}>
									I agree to Terms and Conditions
								</Checkbox>
							</div>
							<div className='mt-4'>
								<Button
									loading={isLoading}
									type='primary'
									size='large'
									style={{ width: '100%' }}
									onClick={() => form.submit()}>
									Sign Up
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
