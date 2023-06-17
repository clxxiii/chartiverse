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

		if (file.includes('album.png')) {
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
	let background;
	let icon;

	let song_type: string | undefined = undefined;
	let album_type: string | undefined = undefined;
	let background_type: string | undefined = undefined;

	for (const file in zipfile.files) {
		if (file.includes('album.jpg')) {
			album = await zip.file(file)?.async('base64');
			album_type = 'jpg';
		}

		if (file.includes('album.png')) {
			album = await zip.file(file)?.async('base64');
			album_type = 'png';
		}

		if (file.includes('background.jpg')) {
			background = await zip.file(file)?.async('base64');
			background_type = 'jpg';
		}

		if (file.includes('background.png')) {
			background = await zip.file(file)?.async('base64');
			background_type = 'png';
		}

		if (file.includes('icon.png')) {
			icon = await zip.file(file)?.async('base64');
		}

		if (file.includes('song.ogg')) {
			song = await zip.file(file)?.async('base64');
			song_type = 'ogg';
		}

		if (file.includes('song.mp3')) {
			song = await zip.file(file)?.async('base64');
			song_type = 'mp3'
		}

		if (file.includes('notes.chart')) {
			chart = await zip.file(file)?.async('base64');
		}

	}

	return { album, chart, song, background, icon, song_type, album_type, background_type };
};
