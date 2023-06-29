import { z } from 'zod';

export type UsernameValidation = {
	success: boolean;
	errors?: {
		too_short: boolean;
		too_long: boolean;
		weird_characters: boolean;
	};
};

export type PasswordValidation = {
	success: boolean;
	errors?: {
		length: boolean;
		number: boolean;
		uppercase: boolean;
		lowercase: boolean;
	};
};

export const validateUsername = (s: string | undefined): UsernameValidation => {
	const data = {
		success: false,
		errors: {
			too_short: false,
			too_long: false,
			weird_characters: false
		}
	};

	if (!s) {
		data.errors = {
			too_short: true,
			too_long: true,
			weird_characters: true
		};
		return data;
	}

	const validUsername = z
		.string()
		.min(2, 'too_short')
		.max(24, 'too_long')
		.refine((s: string) => {
			const regex = s.match(/([A-Z]|[a-z]|[0-9]| |_|=|\.|-)*/);
			if (!regex) return false;
			return regex[0] == s;
		}, 'weird_characters');

	const validity = validUsername.safeParse(s);
	if (validity.success) {
		data.success = true;
		return data;
	}

	for (const issue of validity.error.issues) {
		if (issue.message == 'too_short') data.errors.too_short = true;
		if (issue.message == 'too_long') data.errors.too_long = true;
		if (issue.message == 'weird_characters') data.errors.weird_characters = true;
	}

	return data;
};

export const validatePassword = (s: string | undefined): PasswordValidation => {
	const data = {
		success: false,
		errors: {
			length: false,
			number: false,
			uppercase: false,
			lowercase: false
		}
	};

	if (!s) {
		data.errors = {
			length: true,
			number: true,
			uppercase: true,
			lowercase: true
		};
		return data;
	}

	const validPassword = z
		.string()
		.min(8, 'length')
		.regex(/[0-9]/, 'number')
		.regex(/[A-Z]/, 'uppercase')
		.regex(/[a-z]/, 'lowercase');

	const validity = validPassword.safeParse(s);
	if (validity.success) {
		data.success = true;
		return data;
	}

	for (const issue of validity.error.issues) {
		if (issue.message == 'length') data.errors.length = true;
		if (issue.message == 'number') data.errors.number = true;
		if (issue.message == 'uppercase') data.errors.uppercase = true;
		if (issue.message == 'lowercase') data.errors.lowercase = true;
	}
	return data;
};

export const validateEmail = (s: string) => z.string().email().safeParse(s);
