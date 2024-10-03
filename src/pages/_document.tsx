/** @format */

import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import type { DocumentContext } from 'next/document';

const MyDocument = () => (
	<Html lang='vi'>
		<Head>
			<link
				rel='stylesheet'
				href='https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css'
				integrity='sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm'
				crossOrigin='anonymous'
			/>
		</Head>
		<body>
			<Main />
			<NextScript />
		</body>
	</Html>
);

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
	const cache = createCache();
	const originalRenderPage = ctx.renderPage;
	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App) => (props) =>
				(
					<StyleProvider cache={cache}>
						<App {...props} />
					</StyleProvider>
				),
		});

	const initialProps = await Document.getInitialProps(ctx);
	const style = extractStyle(cache, true);
	return {
		...initialProps,
		styles: (
			<>
				{initialProps.styles}
				<style dangerouslySetInnerHTML={{ __html: style }} />
			</>
		),
	};
};

export default MyDocument;
