import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TmdbApi implements ICredentialType {
	name = 'tmdbApi';
	displayName = 'TMDB API';
	iconUrl = 'file:tmdb.svg';
	documentationUrl = 'https://developer.themoviedb.org/reference/intro/getting-started';
	properties: INodeProperties[] = [
		{
			displayName: 'Api Token',
			name: 'api_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.api_token}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.themoviedb.org/3',
			url: '/configuration',
		},
	};
}
