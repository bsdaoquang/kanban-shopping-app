/** @format */

import handleAPI from '@/apis/handleApi';
import {
	Button,
	Checkbox,
	Form,
	Input,
	message,
	Space,
	Typography,
} from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
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
	const [signValues, setSignValues] = useState<any>();
	const [numsOfCode, setNumsOfCode] = useState<string[]>([]);

	const [form] = Form.useForm();
	const dispatch = useDispatch();

	const router = useRouter();

	const inpRef1 = useRef<any>(null);
	const inpRef2 = useRef<any>(null);
	const inpRef3 = useRef<any>(null);
	const inpRef4 = useRef<any>(null);
	const inpRef5 = useRef<any>(null);
	const inpRef6 = useRef<any>(null);

	const handleSignUp = async (values: SignUp) => {
		const api = `/customers/add-new`;
		setIsLoading(true);

		try {
			const res = await handleAPI({
				url: api,
				data: values,
				method: 'post',
			});

			if (res.data) {
				setSignValues(res.data.data);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChangeNumsCode = (val: string, index: number) => {
		const items = [...numsOfCode];
		items[index] = val;

		setNumsOfCode(items);
	};

	const handleVerify = async () => {
		if (numsOfCode.length >= 6) {
			let code = '';
			numsOfCode.forEach((num) => (code += num));

			const api = `/customers/verify?id=${signValues._id}`;

			try {
				const res = await handleAPI({
					url: api,
					data: { code: code.toUpperCase() },
					method: 'put',
				});

				console.log(res);
			} catch (error) {
				console.log(error);
			}
		} else {
			message.error('Invalid code');
		}
	};

	return (
		<div className='container-fluid' style={{ height: '100vh' }}>
			<div className='row' style={{ height: '100vh' }}>
				<div
					className='d-none d-md-block col-6 p-0'
					style={{
						backgroundImage: `url(/images/bg-auth-${
							signValues ? '2' : '1'
						}.png)`,
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
							{signValues ? (
								<>
									<Button
										onClick={() => setSignValues(undefined)}
										type='text'
										icon={<BsArrowLeft size={20} className='text-muted' />}>
										<Typography.Text>Back</Typography.Text>
									</Button>

									<div className='mt-4'>
										<Typography.Title level={2} className='m-0'>
											Enter OTP
										</Typography.Title>
										<Typography.Paragraph type='secondary'>
											We have share a code of your registered email address
											robertfox@example.com
										</Typography.Paragraph>
									</div>
									<div className='mt-4'>
										<div
											className='d-flex'
											style={{
												justifyContent: 'space-between',
											}}>
											<Input
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												ref={inpRef1}
												onChange={(val) => {
													if (val.target.value) {
														inpRef2.current.focus();
														handleChangeNumsCode(val.target.value, 0);
													}
												}}
											/>
											<Input
												ref={inpRef2}
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												onChange={(val) => {
													if (val.target.value) {
														inpRef3.current.focus();
														handleChangeNumsCode(val.target.value, 1);
													}
												}}
											/>
											<Input
												ref={inpRef3}
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												onChange={(val) => {
													if (val.target.value) {
														inpRef4.current.focus();
														handleChangeNumsCode(val.target.value, 2);
													}
												}}
											/>
											<Input
												ref={inpRef4}
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												onChange={(val) => {
													if (val.target.value) {
														inpRef5.current.focus();
														handleChangeNumsCode(val.target.value, 3);
													}
												}}
											/>
											<Input
												ref={inpRef5}
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												onChange={(val) => {
													if (val.target.value) {
														inpRef6.current.focus();
														handleChangeNumsCode(val.target.value, 4);
													}
												}}
											/>
											<Input
												ref={inpRef6}
												placeholder=''
												size='large'
												style={{
													fontSize: 32,
													fontWeight: 'bold',
													width: 'calc((100% - 90px) / 6)',
													textAlign: 'center',
												}}
												maxLength={1}
												onChange={(val) => {
													handleChangeNumsCode(val.target.value, 5);
												}}
											/>
										</div>
									</div>
									<div className='mt-4'>
										<Button
											loading={isLoading}
											type='primary'
											size='large'
											style={{ width: '100%' }}
											onClick={handleVerify}>
											Verify
										</Button>
									</div>
								</>
							) : (
								<>
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
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
