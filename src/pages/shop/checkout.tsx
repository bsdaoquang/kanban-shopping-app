/** @format */

import handleAPI from '@/apis/handleApi';
import { ButtonRemoveCartItem } from '@/components';
import HeadComponent from '@/components/HeadComponent';
import {
	CartItemModel,
	cartSelector,
	changeCount,
	removeProduct,
} from '@/redux/reducers/cartReducer';
import { VND } from '@/utils/handleCurrency';
import { Avatar, Button, Card, Space, Table, Typography } from 'antd';
import Item from 'antd/es/list/Item';
import { ColumnProps } from 'antd/es/table';
import { LuMinus } from 'react-icons/lu';
import { MdAdd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

const CheckoutPage = () => {
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
						onClick={() => dispatch(changeCount({ id: item._id, val: 1 }))}
						disabled={item.count === item.qty}
						icon={<MdAdd size={22} className='text-muted' />}
						type='text'
					/>
					<Typography.Text style={{ fontSize: '1.1rem', padding: '0 10px' }}>
						{`${item.count}`}
					</Typography.Text>
					<Button
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
		<div className='container-fluid'>
			<div className='container mt-4'>
				<HeadComponent title='Checkout' />
				<div className='row'>
					<div className='col-sm-12 col-md-8'>
						<Typography.Title
							level={2}
							style={{ fontWeight: 300 }}
							className='text-muted'>
							Checkout
						</Typography.Title>
						<Table dataSource={carts} columns={columns} />
					</div>
					<div className='col-sm-12 col-md-4 '>
						<Card>fafafa</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;
