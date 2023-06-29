import { error, type Actions, type ServerLoad, redirect } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';
import { StatusCodes } from '$lib/StatusCodes';
import { validatePassword, validateUsername } from '$lib/auth';

export const load: ServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		// Data Validation
		const username = data.get('username'),
			password = data.get('password');

		if (!username || typeof username != 'string') throw error(StatusCodes.BAD_REQUEST);
		if (!password || typeof password != 'string') throw error(StatusCodes.BAD_REQUEST);

		const [validUsername, validPassword] = [validateUsername(username), validatePassword(password)];
		if (!validUsername.success || !validPassword.success) throw error(StatusCodes.BAD_REQUEST);

		// Get User
		const user = await getUser(username, password);
		if (!user) {
			throw error(StatusCodes.UNAUTHORIZED);
		}
	}
};
