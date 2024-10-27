import { IExecuteFunctions } from 'n8n-workflow';
import { getBackdropUrls, getLogoUrls, getPosterUrls, getProfileUrls } from './UrlFunctions';

export async function getMovie(context: IExecuteFunctions, itemIndex: number) {
	const language = context.getNodeParameter('language', itemIndex) as string;
	const movieId = context.getNodeParameter('movie_id', itemIndex) as number;
	const appendToResponse = context.getNodeParameter(
		'movie_append_to_response',
		itemIndex,
	) as string;

	const response = await context.helpers.httpRequestWithAuthentication.call(context, 'tmdbApi', {
		headers: {
			Accept: 'application/json',
		},
		method: 'GET',
		url: `https://api.themoviedb.org/3/movie/${movieId}?language=${language}&append_to_response=${appendToResponse}`,
	});

	if (response.belongs_to_collection) {
		response.belongs_to_collection = {
			...response.belongs_to_collection,
			poster_urls: getPosterUrls(response.belongs_to_collection.poster_path),
			backdrop_urls: getBackdropUrls(response.belongs_to_collection.backdrop_path),
		};
	}

	if (response.production_companies) {
		response.production_companies = response.production_companies.map((company: any) => ({
			...company,
			logo_urls: getLogoUrls(company.logo_path),
		}));
	}

	if (response.images) {
		response.images.backdrops = response.images?.backdrops?.map((backdrop: any) => ({
			...backdrop,
			urls: getBackdropUrls(backdrop.file_path),
		}));
		response.images.logos = response.images?.logos?.map((logo: any) => ({
			...logo,
			urls: getLogoUrls(logo.file_path),
		}));
		response.images.posters = response.images?.posters?.map((poster: any) => ({
			...poster,
			urls: getPosterUrls(poster.file_path),
		}));
	}
	if (response.credits) {
		response.credits.cast = response.credits.cast.map((cast: any) => ({
			...cast,
			profile_urls: getProfileUrls(cast.profile_path),
		}));
		response.credits.crew = response.credits.crew.map((crew: any) => ({
			...crew,
			profile_urls: getProfileUrls(crew.profile_path),
		}));
	}

	return {
		...response,
		poster_urls: getPosterUrls(response.poster_path),
		backdrop_urls: getBackdropUrls(response.backdrop_path),
	};
}
