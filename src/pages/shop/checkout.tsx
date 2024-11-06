/** @format */

import handleAPI from '@/apis/handleApi';
import HeadComponent from '@/components/HeadComponent';
import { CartItemModel, cartSelector } from '@/redux/reducers/cartReducer';
import { VND } from '@/utils/handleCurrency';
import {
	Button,
	Card,
	Divider,
	Input,
	message,
	Space,
	Steps,
	Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { BiCreditCard } from 'react-icons/bi';
import { FaStar } from 'react-icons/fa6';
import { HiHome } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import ListCart from './components/ListCart';
import ShipingAddress from './components/ShipingAddress';
import PaymentMethod from './components/PaymentMethod';
import Reviews from './components/reviews';
import { AddressModel } from '@/models/Products';

interface PaymentDetail {
	address: AddressModel;
	paymentMethod: any;
}

const CheckoutPage = () => {
	const [discountCode, setDiscountCode] = useState('');
	const [discountValue, setDiscountValue] = useState<{
		value: number;
		type: string;
	}>();
	const [grandTotal, setGrandTotal] = useState(0);
	const [isCheckingCode, setIsCheckingCode] = useState(false);
	const [checkoutStep, setCheckoutStep] = useState('checkout');
	const [currentStep, setCurrentStep] = useState<number>();
	const [paymentDetail, setPaymentDetail] = useState<any>();

	const carts: CartItemModel[] = useSelector(cartSelector);

	useEffect(() => {
		if (discountValue && carts.length > 0) {
			const total = carts.reduce((a, b) => a + b.count * b.price, 0);

			setGrandTotal(
				discountValue.type === 'percent'
					? Math.ceil(total - total * (discountValue.value / 100))
					: total - discountValue.value
			);
		}
	}, [discountValue]);

	const handleCheckDiscountCode = async () => {
		const api = `/promotions/check?code=${discountCode}`;
		setIsCheckingCode(true);
		try {
			const res: any = await handleAPI({ url: api });
			const data = res.data.data;
			setDiscountValue(data);
			message.success('Add discount code success');
		} catch (error: any) {
			console.log(error);
			message.error(error.response.data.message);
		} finally {
			setIsCheckingCode(false);
		}
	};

	const renderComponents = () => {
		switch (currentStep) {
			case 0:
				return (
					<ShipingAddress
						onSelectAddress={(val) => {
							setPaymentDetail({ ...paymentDetail, address: val });
							setCurrentStep(1);
						}}
					/>
				);
			case 1:
				return (
					<PaymentMethod
						onContinue={(val) => {
							console.log(val);
							setCurrentStep(2);
						}}
					/>
				);
			case 2:
				return <Reviews />;
			default:
				return <ListCart />;
		}
	};

	return (
		<div className='container-fluid'>
			<div className='container mt-4'>
				<HeadComponent title='Checkout' />
				<div className='row'>
					<div className='col-sm-12 col-md-8'>
						<div className='mb-4'>
							<Steps
								current={currentStep}
								labelPlacement='vertical'
								onChange={(val) => setCurrentStep(val)}
								items={[
									{
										title: 'Address',
										icon: (
											<Button
												icon={<HiHome size={18} />}
												type={currentStep === 0 ? 'primary' : `text`}
												onClick={() => setCurrentStep(0)}
											/>
										),
									},
									{
										title: 'Payment Method',
										icon: (
											<Button
												icon={<BiCreditCard size={20} />}
												type={currentStep === 1 ? 'primary' : `text`}
												onClick={() => setCurrentStep(1)}
											/>
										),
									},
									{
										title: 'Reviews',
										icon: (
											<Button
												icon={<FaStar size={18} />}
												type={currentStep === 2 ? 'primary' : `text`}
												onClick={undefined}
											/>
										),
									},
								]}
							/>
						</div>

						{renderComponents()}
					</div>
					<div className='col-sm-12 col-md-4 mt-5 '>
						<Card
							title='Subtotal'
							extra={
								<Typography.Title level={3} className='m-0'>
									{VND.format(carts.reduce((a, b) => a + b.count * b.price, 0))}
								</Typography.Title>
							}>
							<div className='mt-3'>
								<Typography.Text type='secondary'>
									Discount code
								</Typography.Text>
								<Space.Compact className='mb-3'>
									<Input
										size='large'
										placeholder='code'
										allowClear
										value={discountCode}
										onChange={(val) =>
											setDiscountCode(val.target.value.toUpperCase())
										}
									/>
									<Button
										loading={isCheckingCode}
										onClick={handleCheckDiscountCode}
										disabled={!discountCode}
										type='primary'
										size='large'>
										Apply
									</Button>
								</Space.Compact>
								<Space style={{ justifyContent: 'space-between' }}>
									<Typography.Text style={{ fontSize: 18 }}>
										Delivery charge:
									</Typography.Text>
									{discountValue && (
										<Typography.Text
											style={{
												fontSize: 18,
											}}>{`${discountValue?.value}${
											discountValue?.type === 'percent' ? '%' : ''
										}`}</Typography.Text>
									)}
								</Space>
								<Divider />
								<Space style={{ justifyContent: 'space-between' }}>
									<Typography.Title level={4}>Grand Total:</Typography.Title>
									<Typography.Title level={4}>{`${VND.format(
										grandTotal
									)}`}</Typography.Title>
								</Space>
							</div>
							<div className='mt-3'>
								<Button
									type='primary'
									onClick={() => setCurrentStep(0)}
									size='large'
									style={{ width: '100%' }}>
									Process to Checkout
								</Button>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;
