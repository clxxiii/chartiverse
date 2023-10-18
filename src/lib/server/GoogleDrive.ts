import { GOOGLE_DRIVE_API_KEY } from '$env/static/private';

const BASE_URL = 'https://www.googleapis.com/drive/v3';

export const getFilesInFolder = async (folderId: string) => {
	const params = new URLSearchParams();
	params.set('key', GOOGLE_DRIVE_API_KEY);
	params.set('corpora', 'user');
	params.set('q', `'${folderId}' in parents`);
	params.set('orderBy', 'createdTime');
	params.set('fields', 'files(id, name, mimeType, md5Checksum), nextPageToken');
	const folderReq = await fetch(`${BASE_URL}/files?${params.toString()}`);
	const folder: Drive.ListResponse = await folderReq.json();

	const files = folder.files;

	/*
  if (folder.nextPageToken) {
   let token = folder.nextPageToken;
   while (token) {
    const params = new URLSearchParams();
    params.set('key', GOOGLE_DRIVE_API_KEY);
    params.set('orderBy', 'createdTime')
	  params.set('fields', 'files(id, name, mimeType, md5Checksum), nextPageToken');
    params.set('pageToken', token);
   }
  }
  */

	return files;
};
