/** @format */

import handleAPI from '@/apis/handleApi';
import { SubProductModel } from '@/models/Products';
import { authSelector } from '@/redux/reducers/authReducer';
import {
	addProduct,
	CartItemModel,
	removeProduct,
} from '@/redux/reducers/cartReducer';
import { Button, Modal, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
	visible: boolean;
	onClose: () => void;
	productSelected: CartItemModel;
}

const TransationSubProductModal = (props: Props) => {
	const { productSelected, visible, onClose } = props;

	const [subProducts, setSubProducts] = useState<SubProductModel[]>([]);
	const [itemSeclected, setItemSeclected] = useState<SubProductModel>();
	const [isLoading, setIsLoading] = useState(false);

	const dispatch = useDispatch();
	const auth = useSelector(authSelector);

	useEffect(() => {
		getProductDetail();
	}, [productSelected]);

	const getProductDetail = async () => {
		const api = `/products/detail?id=${productSelected.productId}`;
		try {
			const res = await handleAPI({
				url: api,
			});
			const data = res.data.data;

			setSubProducts(data.subProducts);
			setItemSeclected(data.subProducts[0]);
		} catch (error) {
			console.log(error);
		}
	};

	const handleChangeSubProduct = async () => {
		if (itemSeclected) {
			// Xoá trong database
			// Xoá trong store
			// thêm cái mới vào

			const api = `/carts/remove?id=${productSelected._id}`;
			setIsLoading(true);
			try {
				await handleAPI({ url: api, data: undefined, method: 'delete' });

				const item = itemSeclected;
				const value = {
					createdBy: auth._id,
					count: productSelected.count,
					subProductId: item._id,
					size: item.size,
					color: item.color,
					price: item.price,
					qty: item.qty,
					productId: item.productId,
					image: item.images[0] ?? '',
				};
				dispatch(removeProduct(productSelected));
				dispatch(addProduct(value));

				setItemSeclected(undefined);
				onClose();
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<Modal
			onOk={() => handleChangeSubProduct()}
			open={visible}
			onCancel={onClose}
			onClose={onClose}>
			<img
				src={itemSeclected?.images[0]}
				alt=''
				style={{
					width: 100,
					height: 120,
					objectFit: 'cover',
				}}
			/>
			<div className='mt-4'>
				<Typography.Title level={4}>Sizes</Typography.Title>
				<Space>
					{subProducts.map(
						(item) =>
							productSelected.size !== item.size && (
								<Button
									key={`${item._id}-${item.size}`}
									onClick={() => setItemSeclected(item)}>
									{item.size}
								</Button>
							)
					)}
				</Space>
			</div>
			<div className='mt-4'>
				<Typography.Title level={4}>Colors</Typography.Title>
				<Space>
					{subProducts.map(
						(item) =>
							productSelected.color !== item.color && (
								<Button
									key={`${item._id}-${item.color}`}
									onClick={() => setItemSeclected(item)}
									style={{ backgroundColor: item.color }}
								/>
							)
					)}
				</Space>
			</div>
		</Modal>
	);
};

export default TransationSubProductModal;