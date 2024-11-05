/** @format */

import { AddNewAddress } from '@/components';
import { AddressModel } from '@/models/Products';
import { Button, Divider } from 'antd';
import React, { useState } from 'react';

interface Props {
	onSelectAddress: (val: AddressModel) => void;
}

const ShipingAddress = (props: Props) => {
	const { onSelectAddress } = props;

	const [addressSelected, setAddressSelected] = useState<AddressModel>();

	return (
		<div>
			<Button
				onClick={() => console.log(addressSelected)}
				size='large'
				type='primary'>
				Deliver address
			</Button>

			<Divider />
			<div className='mt-4'>
				<AddNewAddress onAddnew={(val) => console.log(val)} />
			</div>
		</div>
	);
};

export default ShipingAddress;
