// See https://kit.svelte.dev/docs/types#app

import type { User } from '@prisma/client';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
	type ChartINI = {
		Events: string[][];
		Song: string[][];
		SyncTrack: string[][];
		ExpertSingle?: string[][];
		HardSingle?: string[][];
		NormalSingle?: string[][];
		EasySingle?: string[][];
	};

	namespace ChartFile {
		type Chart = {
			events: Event[];
			notes: Notes;
			timing: Timing[];
		};

		type EventType = 'section' | 'phrase_start' | 'phrase_end' | 'lyric' | string;
		type Event = {
			ms: number;
			raw: string;
			point: number;

			type: EventType;
			value: string;
		};

		type Notes = {
			expert?: Note[];
			hard?: Note[];
			normal?: Note[];
			easy?: Note[];
		};

		type NoteType = 'strum' | 'hopo' | 'tap';
		type NotePositionType = 'green' | 'red' | 'yellow' | 'blue' | 'orange' | 'force' | 'tap';
		type Note = {
			ms: number;
			raw: string;
			point: number;

			notes: boolean[];
			powered: boolean;
			type?: NoteType;
			duration: number[];
		};

		type Timing = TimeSignature | BPMChange;
		type TimeSignature = {
			ms: number;
			raw: string;
			point: number;

			top: number;
			bottom: number;
		};

		type BPMChange = {
			ms: number;
			raw: string;
			point: number;

			bpm: number;
		};
	}
}

export {};
