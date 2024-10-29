/** @format */

import handleAPI from '@/apis/handleApi';
import { CartItemModel, removeProduct } from '@/redux/reducers/cartReducer';
import { Button, Modal } from 'antd';
import { IoTrash } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

interface Props {
	item: CartItemModel;
}

const ButtonRemoveCartItem = (props: Props) => {
	const { item } = props;
	const dispatch = useDispatch();

	const handleRemoveCartItem = async (item: any) => {
		const api = `/carts/remove?id=${item._id}`;

		console.log(api);
		// try {
		// 	await handleAPI({ url: api, data: undefined, method: 'delete' });

		// 	dispatch(removeProduct(item));
		// } catch (error) {
		// 	console.log(error);
		// }
	};

	return (
		<Button
			onClick={() =>
				Modal.confirm({
					title: 'Confirm',
					content: 'Are you sure you want to remove this item?',
					onOk: async () => {
						await handleRemoveCartItem(item);
					},
				})
			}
			icon={<IoTrash size={22} />}
			danger
			type='text'
		/>
	);
};

export default ButtonRemoveCartItem;
