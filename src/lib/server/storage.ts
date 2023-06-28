import { STORAGE_PASSWORD, STORAGE_NAME, STORAGE_ENDPOINT } from '$env/static/private';
import axios from 'axios';

export const list = async (path?: string) => {
	const request = await axios({
		baseURL: STORAGE_ENDPOINT,
		url: `/${STORAGE_NAME}/${path}`,
		method: 'GET',
		headers: {
			Accept: 'application/json',
			AccessKey: STORAGE_PASSWORD
		}
	});
	return request.data;
};
export const download = async (path: string) => {
	const request = await axios({
		baseURL: STORAGE_ENDPOINT,
		url: `/${STORAGE_NAME}/${path}`,
		method: 'GET',
		headers: {
			Accept: '*/*',
			AccessKey: STORAGE_PASSWORD
		}
	});
	return request.data;
};
export const upload = async (file: ArrayBuffer, path: string) => {
	const request = await axios({
		baseURL: STORAGE_ENDPOINT,
		url: `/${STORAGE_NAME}/${path}`,
		method: 'PUT',
		headers: {
			Accept: '*/*',
			AccessKey: STORAGE_PASSWORD
		},
		data: file,
		maxBodyLength: 104857600
	});
	return request.data;
};
export const downloadFromUrl = async (url: string): Promise<ArrayBuffer> => {
	const request = await fetch(url);
	return request.arrayBuffer();
};
