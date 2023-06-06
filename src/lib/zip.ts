import JSZip from 'jszip';
import { parseMetadata } from './ChartParser';

const zip = new JSZip();
export const ondrop = async (input: File) => {
	const zipfile = await zip.loadAsync(input);

	let songIni;
	let albumImg;

	for (const file in zipfile.files) {
		if (file.includes('song.ini')) {
			songIni = await zip.file(file)?.async('string');
		}

		if (file.includes('album.jpg')) {
			albumImg = await zip.file(file)?.async('blob');
		}
	}

	if (!albumImg) {
		console.log('no album img');
		return { error: 'no album img found' };
	}
	if (!songIni) {
		console.log('no songini');
		return { error: 'no song.ini found' };
	}

	return { info: parseMetadata(songIni), album_url: URL.createObjectURL(albumImg) };
};

export const onupload = async (input: File) => {
	const zipfile = await zip.loadAsync(input);

	let album;
	let chart;
	let song;

	for (const file in zipfile.files) {
		if (file.includes('album.jpg')) {
			album = await zip.file(file)?.async('base64');
		}

		if (file.includes('notes.chart')) {
			chart = await zip.file(file)?.async('base64');
		}

		if (file.includes('song.ogg')) {
			song = await zip.file(file)?.async('base64');
		}
	}

	return { album, chart, song };
};
