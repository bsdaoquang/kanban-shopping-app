/** @format */

import { Button, List, Modal, Radio, Typography } from 'antd';
import React, { useState } from 'react';
import CreditCardPayment from './CreditCardPayment';

interface Props {
	onContinue: (val: any) => void;
}

const methods = [
	{
		key: 'cod',
		title: 'Cash on delivery',
	},
	{
		key: 'debit',
		title: 'Debit/Credit card',
	},
	{
		key: 'google',
		title: 'Google pay',
	},
	{
		key: 'paypal',
		title: 'Paypal',
	},
];

const PaymentMethod = (props: Props) => {
	const { onContinue } = props;

	const [methodSelected, setMethodSelected] = useState('cod');
	const [isVisibleModalPayment, setIsVisibleModalPayment] = useState(false);
	const [isEnableContineu, setIsEnableContineu] = useState(false);

	const renderPaymentDetail = () => {
		switch (methodSelected) {
			case 'debit':
				return <CreditCardPayment onPayment={() => {}} />;
			default:
				return <></>;
		}
	};

	const handlePayment = () => {
		if (methodSelected === 'cod') {
			onContinue({ methodSelected });
		} else {
			// Thực hiện thanh toán
			setIsVisibleModalPayment(true);
			// goi oncontineu
		}
	};

	return (
		<div>
			<Typography.Title level={4}>Payment method seleted</Typography.Title>
			<List
				dataSource={methods}
				renderItem={(item) => (
					<List.Item key={item.key}>
						<List.Item.Meta
							title={
								<Radio
									onChange={() => setMethodSelected(item.key)}
									checked={item.key === methodSelected}>
									{item.title}
								</Radio>
							}
							description={item.key === methodSelected && renderPaymentDetail()}
						/>
					</List.Item>
				)}
			/>
			<div className='mt-3'>
				<Button
					disabled={!isEnableContineu}
					type='primary'
					onClick={handlePayment}>
					Continue
				</Button>
			</div>

			<Modal
				open={isVisibleModalPayment}
				onCancel={() => setIsVisibleModalPayment(false)}
				onClose={() => setIsVisibleModalPayment(false)}>
				<h1>Api payment supply</h1>
			</Modal>
		</div>
	);
};

export default PaymentMethod;
