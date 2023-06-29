import { StatusCodes } from '$lib/StatusCodes';
import { newUser, createSession } from '$lib/server/auth';
import { validateUsername, validatePassword, validateEmail } from '$lib/auth';
import { error, type Actions, type ServerLoad, redirect } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		// Data Validation
		const username = data.get('username'),
			password = data.get('password'),
			email = data.get('email');

		if (!username || typeof username != 'string') throw error(StatusCodes.BAD_REQUEST);
		if (!password || typeof password != 'string') throw error(StatusCodes.BAD_REQUEST);
		if (!email || typeof email != 'string') throw error(StatusCodes.BAD_REQUEST);

		const [validUsername, validPassword, validEmail] = [
			validateUsername(username),
			validatePassword(password),
			validateEmail(email)
		];
		if (!validUsername.success || !validPassword.success || !validEmail.success)
			throw error(StatusCodes.BAD_REQUEST);

		// Create New User
		const user = await newUser(email, username, password);

		const session = await createSession(user);
		if (!session) throw error(StatusCodes.INTERNAL_SERVER_ERROR);
		cookies.set('chartiverse_session', session.id, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365
		});
	}
};
