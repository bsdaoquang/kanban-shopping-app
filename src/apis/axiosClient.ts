/** @format */

import { appInfo } from '@/constants/appInfos';
import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
	baseURL: appInfo.baseUrl,
	paramsSerializer: (params) => queryString.stringify(params),
});

const getAccesstoken = () => {
	const res = localStorage.getItem('authData');

	return res ? JSON.parse(res).accesstoken : '';
};

axiosClient.interceptors.request.use(async (config: any) => {
	const accesstoken = getAccesstoken();

	config.headers = {
		Authorization: accesstoken ? `Bearer ${accesstoken}` : '',
		Accept: 'application/json',
		...config.headers,
	};

	return { ...config, data: config.data ?? undefined };
});

axios.interceptors.response.use(
	(res) => {
		if (res.data && res.status >= 200 && res.status <= 299) {
			return res.data.data;
		} else {
			return Promise.reject(res.data);
		}
	},
	(error) => {
		const { response } = error;
		return Promise.reject(response.data);
	}
);

export default axiosClient;
