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

	if (folder.nextPageToken) {
		let token: string | null = folder.nextPageToken;
		while (token) {
			const params = new URLSearchParams();
			params.set('key', GOOGLE_DRIVE_API_KEY);
			params.set('orderBy', 'createdTime')
			params.set('q', `'${folderId}' in parents`);
			params.set('fields', 'files(id, name, mimeType, md5Checksum), nextPageToken');
			params.set('pageToken', token);

			const folderReq = await fetch(`${BASE_URL}/files?${params.toString()}`);
			const folder: Drive.ListResponse = await folderReq.json();
			console.log({ token, folder });
			for (let i = 0; i < folder.files.length; i++) {
				files.push(folder.files[i]);
			}
			token = folder.nextPageToken;
		}
	}

	return files;
};

export const validateDriveId = async (folderId: string) => {
	const params = new URLSearchParams();
	params.set('key', GOOGLE_DRIVE_API_KEY);
	params.set('corpora', 'user');
	params.set('q', `'${folderId}' in parents`);
	params.set('pageSize', '1');
	params.set('fields', 'files(id)');
	const folderReq = await fetch(`${BASE_URL}/files?${params.toString()}`);
	const folder: Drive.ListResponse = await folderReq.json();

	const files = folder.files;
	if (files == undefined) {
		return { 'valid_id': false, 'can_read': false }
	}
	if (files[0] == undefined) {
		return { 'valid_id': true, 'can_read': false }
	}
	return { 'valid_id': true, 'can_read': true };
}

export const getCharts = async (folderId: string) => {
	const charts = await getChartFolders(folderId);
	for (const chart of charts) {
		chart.playlist.shift();


	}
	console.log(charts);

}

const getChartFolders = async (folderId: string, subfolderPath?: string[]): Promise<({ id: string, playlist: string[] })[]> => {
	type Chart = { id: string, playlist: string[] };
	const playlist = subfolderPath ?? [];
	const allFiles = await getFilesInFolder(folderId);

	// If current folder contains a notes.chart, return it as a chart 
	if (allFiles.filter(x => x.name == "notes.chart").length == 1) {
		return [{ id: folderId, playlist }]
	}

	const subfolders = allFiles.filter(x => x.mimeType);
	const charts: Chart[] = [];
	for (let i = 0; i < subfolders.length; i++) {
		const folder = subfolders[i];
		const newPlaylist = [
			...playlist,
			folder.name
		];
		const subfolderCharts = await getChartFolders(folder.id, newPlaylist)
		for (let j = 0; j < subfolderCharts.length; j++) {
			charts.push(subfolderCharts[j]);
		}
	}

	return charts;
}
