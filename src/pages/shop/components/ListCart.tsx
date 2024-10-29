/** @format */

import { ButtonRemoveCartItem } from '@/components';
import {
	CartItemModel,
	cartSelector,
	changeCount,
} from '@/redux/reducers/cartReducer';
import { VND } from '@/utils/handleCurrency';
import { Avatar, Button, Space, Table, Typography } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { LuMinus } from 'react-icons/lu';
import { MdAdd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

const ListCart = () => {
	const carts: CartItemModel[] = useSelector(cartSelector);
	const dispatch = useDispatch();

	const columns: ColumnProps<CartItemModel>[] = [
		{
			key: 'image',
			dataIndex: 'image',
			render: (img: string) => <Avatar src={img} size={52} shape='square' />,
		},
		{
			key: 'products',
			dataIndex: '',
			title: 'Product',
			render: (item: CartItemModel) => (
				<>
					<Typography.Title level={4} className='m-0'>
						{item.title}
					</Typography.Title>
					<Typography.Text>Size: {item.size}</Typography.Text>
				</>
			),
		},
		{
			key: 'price',
			title: 'Price',
			dataIndex: 'price',
			render: (price: number) => VND.format(price),
		},
		{
			key: 'quantity',
			dataIndex: '',
			title: 'Quantity',
			render: (item: CartItemModel) => (
				<Space className='btn-groups'>
					<Button
						key={'btn-add'}
						onClick={() => dispatch(changeCount({ id: item._id, val: 1 }))}
						disabled={item.count === item.qty}
						icon={<MdAdd size={22} className='text-muted' />}
						type='text'
					/>
					<Typography.Text style={{ fontSize: '1.1rem', padding: '0 10px' }}>
						{`${item.count}`}
					</Typography.Text>
					<Button
						key={`btn-minus`}
						onClick={() => dispatch(changeCount({ id: item._id, val: -1 }))}
						disabled={item.count === 1}
						icon={<LuMinus size={22} className='text-muted' />}
						type='text'
					/>
				</Space>
			),
			align: 'center',
		},
		{
			key: 'subtotal',
			title: 'SubTotal',
			dataIndex: '',
			render: (item: CartItemModel) => VND.format(item.price * item.count),
		},
		{
			title: '',
			key: 'action',
			dataIndex: '',
			render: (item: CartItemModel) => <ButtonRemoveCartItem item={item} />,
		},
	];
	return (
		<div>
			<Typography.Title
				level={2}
				style={{ fontWeight: 300 }}
				className='text-muted'>
				Checkout
			</Typography.Title>
			<Table dataSource={carts} columns={columns} />
		</div>
	);
};

export default ListCart;
