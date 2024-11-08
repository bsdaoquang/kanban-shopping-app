/** @format */

import { colors } from '@/constants/colors';
import { ProductModel } from '@/models/Products';
import { VND } from '@/utils/handleCurrency';
import { Button, Space, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BiTransfer } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import { FaRegStar } from 'react-icons/fa';
import { MdImage } from 'react-icons/md';

interface Props {
	item: ProductModel;
}

const { Title, Text, Paragraph } = Typography;

const ProductItem = (props: Props) => {
	const { item } = props;
	const [elementWidth, setElementWidth] = useState();

	const ref = useRef<any>();
	const router = useRouter();

	useEffect(() => {
		const width = ref.current?.offsetWidth;
		setElementWidth(width);
	}, []);

	// @daoquang-livecode

	return (
		<Link
			href={`/products/${item.slug}/${item._id}`}
			ref={ref}
			key={item._id}
			className='col-sm-6 col-md-4 col-lg-3 mb-4 product-item'>
			<div>
				{item.images && item.images.length > 0 ? (
					<img
						style={{
							width: '100%',
							height: elementWidth ? elementWidth * 1.1 : 250,
						}}
						src={item.images[0]}
						alt={item.title}
					/>
				) : (
					<div
						style={{
							width: '100%',
							height: elementWidth ? elementWidth * 1.2 : 250,
							backgroundColor: `#e0e0e0`,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<MdImage size={32} color={colors.gray600} />
					</div>
				)}

				<div className='button-container'>
					<div
						className='btn-list text-right pr-2'
						style={{
							height: (elementWidth ? elementWidth * 1.2 : 250) * 0.72,
						}}>
						<Space direction='vertical'>
							<Button
								size='large'
								className='btn-icon'
								icon={<FaRegStar size={20} className='text-muted' />}
							/>
							<Button
								size='large'
								className='btn-icon'
								icon={<BiTransfer size={20} className='text-muted' />}
							/>
							<Button
								size='large'
								className='btn-icon'
								icon={<BsEye size={20} className='text-muted' />}
							/>
						</Space>
					</div>
					<div className='text-center'>
						<Button
							onClick={() => router.push(`/products/${item.slug}/${item._id}`)}
							size='large'
							style={{ width: '80%' }}>
							Detail
						</Button>
					</div>
				</div>
			</div>
			<div className='p-2'>
				<Paragraph style={{ fontWeight: 'bold' }}>{item.supplier}</Paragraph>
				<Paragraph>{item.title}</Paragraph>
				<Paragraph style={{ fontSize: '1.1em' }}>
					{item.price && item.price.length > 0
						? `${VND.format(item.price[0])} - ${VND.format(item.price[1])}`
						: ''}
				</Paragraph>
			</div>
		</Link>
	);
};

export default ProductItem;
