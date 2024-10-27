import { IExecuteFunctions } from 'n8n-workflow';
import { getBackdropUrls, getPosterUrls, getProfileUrls } from './UrlFunctions';

export async function getPerson(context: IExecuteFunctions, itemIndex: number) {
	const language = context.getNodeParameter('language', itemIndex) as string;
	const personId = context.getNodeParameter('person_id', itemIndex) as number;
	const appendToResponse = context.getNodeParameter(
		'person_append_to_response',
		itemIndex,
	) as string;

	const response = await context.helpers.httpRequestWithAuthentication.call(context, 'tmdbApi', {
		headers: {
			Accept: 'application/json',
		},
		method: 'GET',
		url: `https://api.themoviedb.org/3/person/${personId}?language=${language}&append_to_response=${appendToResponse}`,
	});

	if (response.combined_credits) {
		response.combined_credits.cast = response.combined_credits.cast?.map((cast: any) => ({
			...cast,
			backdrop_urls: getBackdropUrls(cast.backdrop_path),
			poster_urls: getPosterUrls(cast.poster_path),
		}));
		response.combined_credits.crew = response.combined_credits.crew?.map((crew: any) => ({
			...crew,
			backdrop_urls: getBackdropUrls(crew.backdrop_path),
			poster_urls: getPosterUrls(crew.poster_path),
		}));
	}
	if (response.movie_credits) {
		response.movie_credits.cast = response.movie_credits.cast?.map((cast: any) => ({
			...cast,
			backdrop_urls: getBackdropUrls(cast.backdrop_path),
			poster_urls: getPosterUrls(cast.poster_path),
		}));
		response.movie_credits.crew = response.movie_credits.crew?.map((crew: any) => ({
			...crew,
			backdrop_urls: getBackdropUrls(crew.backdrop_path),
			poster_urls: getPosterUrls(crew.poster_path),
		}));
	}

	if (response.tv_credits) {
		response.tv_credits.cast = response.tv_credits.cast?.map((cast: any) => ({
			...cast,
			backdrop_urls: getBackdropUrls(cast.backdrop_path),
			poster_urls: getPosterUrls(cast.poster_path),
		}));
		response.tv_credits.crew = response.tv_credits.crew?.map((crew: any) => ({
			...crew,
			backdrop_urls: getBackdropUrls(crew.backdrop_path),
			poster_urls: getPosterUrls(crew.poster_path),
		}));
	}

	if (response.images) {
		response.images.profiles = response.images?.profiles?.map((profile: any) => ({
			...profile,
			urls: getProfileUrls(profile.file_path),
		}));
	}

	return {
		...response,
		profile_urls: getProfileUrls(response.profile_path),
	};
}
