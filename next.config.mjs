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
	// images: {
	// 	remotePatterns: [
	// 		{
	// 			protocol: 'https',
	// 			hostname: 'example.com',
	// 			port: '',
	// 			pathname: '/account123/**',
	// 			search: '',
	// 		},
	// 	],
	// },
};

export default nextConfig;
