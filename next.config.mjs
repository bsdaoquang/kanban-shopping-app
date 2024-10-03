/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
	reactStrictMode: true,
	transpilePackages: [
		'antd',
		'rc-util',
		'@babel/runtime',
		'@ant-design/icons',
		'@ant-design/icons-svg',
		'rc-pagination',
		'rc-picker',
		'rc-tree',
		'rc-table',
	],
};

export default nextConfig;
