const noteTypeArray = ['#008000', '#FF0000', '#FFFF00', '#0000FF', '#FFA500', '#800080']; // Surprisingly, the default HTML colors work extremely well

const sidePaddingPercent = 0.05; // Distance between walls and notes
const notePaddingPercent = 0.02; // Distance between notes
export const speedFactorMS = 450; // How quick the notes move (note speed)
const FPS = 60;

const frameTime = Math.round(1000 / FPS);

class ChartPreviewer {
	ctx: CanvasRenderingContext2D;
	chart: ChartFile.Chart;
	width: number;
	height: number;
	noteSize: number;
	frame: number;
	length = NaN;
	frameCallback: ((num: number) => void) | undefined;
	playbackPercentage = 0;
	playing: boolean;
	runInterval: NodeJS.Timer | undefined;
	audio: HTMLAudioElement;

	constructor(
		ctx: CanvasRenderingContext2D,
		chart: ChartFile.Chart,
		mp3Path: string,
		height?: number,
		width?: number
	) {
		this.ctx = ctx;
		this.chart = chart;
		this.height = height ?? 720;
		this.width = width ?? this.height * (9 / 16);
		this.playing = false;

		this.noteSize =
			(this.width - this.width * sidePaddingPercent * 2 - this.width * notePaddingPercent * 4) / 5;

		ctx.canvas.height = this.height;
		ctx.canvas.width = this.width;

		// Audio
		this.audio = new Audio(mp3Path);
		this.audio.onloadeddata = () => (this.length = Math.round(this.audio.duration * 1000));

		this.frame = 0;
		this._renderFrame(0);
	}

	setFrameCallback(callback: (num: number) => void) {
		this.frameCallback = callback;
	}

	play() {
		this.runInterval = setInterval(() => {
			if (this.playbackPercentage >= 1) this.pause();

			this._renderFrame(this.frame);
			this.frame = this.frame + frameTime;
			this.playbackPercentage = this.frame / this.length;
			if (this.frameCallback) this.frameCallback(this.playbackPercentage);
		}, frameTime);
		this.playing = true;
		this.audio.play();
	}

	pause() {
		clearInterval(this.runInterval);
		this.playing = false;
		this.audio.pause();
	}

	seek(percentage: number) {
		percentage = percentage < 0 ? 0 : percentage;

		this.frame = this.length * percentage;
		this.audio.currentTime = this.frame / 1000;
		this._renderFrame(this.frame);

		if (this.frameCallback) this.frameCallback(percentage);
	}

	_drawBG() {
		this.ctx.beginPath();
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.lineWidth = this.width * notePaddingPercent * 1;
		this.ctx.moveTo(0, this.height * 0.9);
		this.ctx.lineTo(this.width, this.height * 0.9);
		this.ctx.strokeStyle = '#AAA';
		this.ctx.stroke();
	}

	_renderFrame(time: number) {
		const strikeline = this.height * 0.9;
		const notes = this._getNotesInRange(time, time + speedFactorMS);
		if (!notes) return;
		this._drawBG();



		/**
		 * BEATLINES
		 */
		let beatLineTime = time;
		while (beatLineTime < time + speedFactorMS) {
			const latestBPMChange = getLatestBPMLine(this.chart.timing, beatLineTime);
			const latestTimeSignature = getLatestTimeSignature(this.chart.timing, beatLineTime);
			if (!latestBPMChange) break;
			const measureLength = (60 / latestBPMChange.bpm) * 1000 * 4;
			const beatLength = measureLength / latestTimeSignature.bottom;
			const distanceFromBeatLine = beatLineTime - latestBPMChange.ms;
			const beatNumber = Math.floor(distanceFromBeatLine / beatLength);

			const beatLinePosition = latestBPMChange.ms + beatLength * (beatNumber + 1);
			const distanceToBeat = beatLinePosition - time;
			const yCenter =
				this.height *
				0.9 * // Length of the highway
				(1 - distanceToBeat / speedFactorMS); //

			if ((beatNumber + 1) % latestTimeSignature.top == 0) {
				this.ctx.strokeStyle = '#fff';
				this.ctx.lineWidth = (this.width * notePaddingPercent) / 1;
			} else {
				this.ctx.strokeStyle = '#aaa';
				this.ctx.lineWidth = (this.width * notePaddingPercent) / 2;
			}

			this.ctx.beginPath();
			this.ctx.lineCap = 'square';
			this.ctx.moveTo(0, yCenter);
			this.ctx.lineTo(this.width, yCenter);
			this.ctx.stroke();

			beatLineTime += beatLength;
		}

		/**
		 * NOTES
		 */
		for (const noteSet of notes) {
			const yCenter =
				this.height *
				0.9 * // Length of the highway
				(1 - (noteSet.ms - time) / speedFactorMS); // Percentage Position between Current Time, and Current Time + SpeedFactor

			for (let i = 0; i < noteSet.notes.length; i++) {
				const note = noteSet.notes[i];

				if (!note) continue;

				const xCenter =
					this.width * sidePaddingPercent + // Side Margin
					i * (this.noteSize + this.width * notePaddingPercent) + // Which Note
					this.noteSize / 2; // Center of gem

				setSustainStyle(this.ctx, i, noteSet.powered);
				// Open Note Sustain
				if (i == 5 && max(noteSet.duration) > 0) {
					const sustainEnd =
						yCenter - this.height * (noteSet.duration[i] / speedFactorMS) + this.noteSize * 1;
					const sustainWidth = this.width - 4 * (this.width * sidePaddingPercent);
					const sustainHeight = yCenter - sustainEnd;

					this.ctx.fillRect(
						this.width * sidePaddingPercent * 2,
						sustainEnd,
						sustainWidth,
						sustainHeight < strikeline - sustainEnd ? sustainHeight : strikeline - sustainEnd
						// sustainHeight + sustainEnd >
					);
				}

				// Sustain
				if (max(noteSet.duration) > 0) {
					const sustainEnd =
						yCenter - this.height * (noteSet.duration[i] / speedFactorMS) + this.noteSize * 1;
					if (yCenter - sustainEnd > 0) {
						this.ctx.beginPath();
						this.ctx.lineCap = 'square';
						this.ctx.moveTo(xCenter, yCenter < strikeline ? yCenter : strikeline);
						this.ctx.lineTo(xCenter, sustainEnd < strikeline ? sustainEnd : strikeline);
						this.ctx.lineWidth = this.width * notePaddingPercent * 1.5;
						this.ctx.stroke();
					}
				}

				setNoteStyle(this.ctx, i, noteSet.type, noteSet.powered, xCenter, yCenter, this.noteSize);
				// Note Head
				if (noteSet.ms >= time && i < 5) {
					this.ctx.beginPath();
					this.ctx.arc(xCenter, yCenter, this.noteSize / 2, 0, Math.PI * 2);
					this.ctx.fill();
				}
				// Open Note
				if (noteSet.ms >= time && i == 5) {
					this.ctx.beginPath();
					this.ctx.lineCap = 'round';
					this.ctx.lineWidth = this.width * notePaddingPercent * 4;
					this.ctx.moveTo(this.width * sidePaddingPercent, yCenter);
					this.ctx.lineTo(this.width - this.width * sidePaddingPercent, yCenter);
					this.ctx.stroke();
				}
			}
		}


	}

	_getNotesInRange(startMS: number, endMS: number) {
		if (!this.chart.notes.expert) return;

		const notes: ChartFile.Note[] = [];
		for (const note of this.chart.notes.expert) {
			const farthestVisible = note.ms + max(note.duration);
			if (note.ms > endMS) {
				return notes;
			} else if (farthestVisible >= startMS) {
				notes.push(note);
			}
		}
		return notes;
	}
}

function isBpmLine(timing: ChartFile.Timing): timing is ChartFile.BPMChange {
	return (timing as ChartFile.BPMChange).bpm !== undefined;
}

function getLatestTimeSignature(
	timingEvents: ChartFile.Timing[],
	time: number
): ChartFile.TimeSignature {
	const bpmLines = timingEvents.filter((x) => !isBpmLine(x) && x.ms <= time).reverse();
	if (!isBpmLine(bpmLines[0])) return bpmLines[0];
	// The code will never get here, but the typescript compiler is dumb af
	return { ms: 0, raw: '', point: 0, top: 0, bottom: 0 };
}

function getLatestBPMLine(timingEvents: ChartFile.Timing[], time: number): ChartFile.BPMChange {
	const bpmLines = timingEvents.filter((x) => isBpmLine(x) && x.ms <= time).reverse();
	if (isBpmLine(bpmLines[0])) return bpmLines[0];
	// The code will never get here, but the typescript compiler is dumb af
	return { ms: 0, raw: '', point: 0, bpm: 0 };
}

function setNoteStyle(
	ctx: CanvasRenderingContext2D,
	note: number,
	type: 'strum' | 'hopo' | 'tap' | undefined,
	powered: boolean,
	xCenter: number,
	yCenter: number,
	noteSize: number
) {
	const baseColor = noteTypeArray[note];

	let shadowPosition = 0;
	if (note < 5) {
		shadowPosition = note * 5 - 10;
	}
	ctx.strokeStyle = baseColor;
	ctx.shadowColor = '#0005';
	ctx.shadowBlur = 20;
	ctx.shadowOffsetY = 5 + Math.abs(shadowPosition);
	ctx.shadowOffsetX = shadowPosition;
	if (type == undefined) {
		ctx.fillStyle = baseColor;
		ctx.strokeStyle = baseColor;
		return;
	}

	const grd = ctx.createRadialGradient(xCenter, yCenter, 5, xCenter, yCenter, noteSize / 2);

	if (type == 'tap') {
		grd.addColorStop(0, '#888888');
		grd.addColorStop(0.3, '#222222');
		grd.addColorStop(0.5, '#222222');
		if (powered) grd.addColorStop(1, '#00FFFF88');
		else grd.addColorStop(1, `${noteTypeArray[note]}88`);
		ctx.fillStyle = grd;
		return;
	}

	if (type == 'strum') {
		grd.addColorStop(0, '#888888');
		grd.addColorStop(0.3, '#222222');
	}
	grd.addColorStop(0.5, 'white');
	if (powered) {
		grd.addColorStop(1, 'cyan');
		ctx.strokeStyle = 'cyan';
	} else {
		grd.addColorStop(1, baseColor);
	}
	ctx.fillStyle = grd;
}

function setSustainStyle(ctx: CanvasRenderingContext2D, note: number, powered: boolean) {
	const baseColor = noteTypeArray[note];
	if (powered) {
		ctx.strokeStyle = 'cyan';
		ctx.fillStyle = '#00AAAA';
		ctx.shadowColor = `#00FFFF88`;
	} else {
		ctx.strokeStyle = baseColor;
		ctx.fillStyle = baseColor;
		ctx.shadowColor = `${baseColor}88`;
	}
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 10;
}

function max(arr: number[]) {
	return Math.max.apply(null, arr);
}

export default ChartPreviewer;
