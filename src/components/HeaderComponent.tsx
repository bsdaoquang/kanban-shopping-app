/** @format */

import { authSelector, removeAuth } from '@/redux/reducers/authReducer';
import { Button } from 'antd';
import Link from 'next/link';
import { BiPowerOff } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';

const HeaderComponent = () => {
	const auth = useSelector(authSelector);

	const dispatch = useDispatch();

	return (
		<div className='p-3'>
			<div className='row'>
				<div className='col'></div>
				<div className='col text-right'>
					{auth.accesstoken && auth._id ? (
						<Button
							onClick={() => {
								dispatch(removeAuth({}));
								localStorage.clear();
							}}
							danger
							type='text'
							icon={<BiPowerOff size={23} />}
						/>
					) : (
						<Link href={`/auth/login`}>Login</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default HeaderComponent;
