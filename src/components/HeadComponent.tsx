/** @format */

import { appInfo } from '@/constants/appInfos';
import Head from 'next/head';
import React from 'react';

interface Props {
	title?: string;
	image?: string;
	url?: string;
	description?: string;
}

const HeadComponent = (props: Props) => {
	const { title, description, image, url } = props;
	return (
		<Head>
			<title>{title ? title : appInfo.title}</title>
			<meta name='title' content={title ? title : appInfo.title} />
			<meta
				name='description'
				content={description ? description : appInfo.description}
			/>
			<meta property='og:type' content='website' />
			<meta property='og:url' content={url ?? ''} />
			<meta property='og:title' content={title ? title : appInfo.title} />
			<meta
				property='og:description'
				content={description ? description : appInfo.description}
			/>
			<meta property='og:site_name' content='YHocSo' />
			<meta property='fb:app_id' content='' />
			<meta property='og:image' content={image ?? ''} />
			<meta
				property='og:image:secure_url'
				content={image ? image : appInfo.logo}
			/>
			<meta property='og:image:width' content='402' />
			<meta property='og:image:height' content='321' />
			<meta property='og:image:type' content='image/png' />
			<meta name='twitter:title' content={title ? title : appInfo.title} />
			<meta
				name='twitter:description'
				content={description ? description : appInfo.description}
			/>
			<meta name='twitter:image' content={image ?? ''} />
		</Head>
	);
};

export default HeadComponent;
