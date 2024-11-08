/** @format */

import { Typography } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
	title: string;
	right?: ReactNode;
	level?: 1 | 5 | 2 | 3 | 4 | undefined;
	orentation?: string;
}

const { Title, Text, Paragraph } = Typography;

const TabbarComponent = (props: Props) => {
	const { title, right, level, orentation } = props;

	return (
		<div>
			<div className='row'>
				<div
					className={`col ${
						!right ? '' : orentation ? orentation : 'text-center'
					}`}>
					<Title style={{ fontWeight: 300 }} level={level ?? 2}>
						{title}
					</Title>
				</div>
				{right && right}
			</div>
		</div>
	);
};

export default TabbarComponent;
