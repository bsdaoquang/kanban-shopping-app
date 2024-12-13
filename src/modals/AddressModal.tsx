/** @format */

import { AddNewAddress } from '@/components';
import { Modal } from 'antd';

interface Props {
	visible: boolean;
	onClose: () => void;
	onAddAddress: (val: string) => void;
}

const AddressModal = (props: Props) => {
	const { visible, onClose, onAddAddress } = props;

	const handleClose = () => {
		onClose();
		console.log('fafaa');
	};

	return (
		<Modal
			onCancel={handleClose}
			open={visible}
			onClose={handleClose}
			footer={null}>
			<AddNewAddress
				onSelectAddress={(val) => {
					onAddAddress(val);
					handleClose();
				}}
			/>
		</Modal>
	);
};

export default AddressModal;
