/** @format */

import { AddNewAddress } from '@/components';
import { Button, Divider } from 'antd';
import React, { useState } from 'react';

interface Props {
	onSelectAddress: (val: any) => void;
}

const ShipingAddress = (props: Props) => {
	const { onSelectAddress } = props;

	const [addressSelected, setAddressSelected] = useState<any>();

	return (
		<div>
			<Button
				onClick={() => onSelectAddress(addressSelected)}
				size='large'
				type='primary'>
				Deliver address
			</Button>

			<Divider />
			<div className='mt-4'>
				<AddNewAddress />
			</div>
		</div>
	);
};

export default ShipingAddress;
