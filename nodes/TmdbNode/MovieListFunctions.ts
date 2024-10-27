import { IExecuteFunctions } from 'n8n-workflow';
import { getBackdropUrls } from './UrlFunctions';

export async function getMovieList(context: IExecuteFunctions, itemIndex: number) {
	const language = context.getNodeParameter('language', itemIndex) as string;
	const movieListType = context.getNodeParameter('movie_list_type', itemIndex) as string;
	const page = context.getNodeParameter('page', itemIndex) as string;
	const region = context.getNodeParameter('region', itemIndex) as string;

	const response = await context.helpers.httpRequestWithAuthentication.call(context, 'tmdbApi', {
		headers: {
			Accept: 'application/json',
		},
		method: 'GET',
		url: `https://api.themoviedb.org/3/movie/${movieListType}?language=${language}&page=${page}&region=${region}`,
	});

	if (response.results) {
		response.results = response.results.map((movie: any) => ({
			...movie,
			backdrop_urls: getBackdropUrls(movie.backdrop_path),
			poster_urls: getBackdropUrls(movie.poster_path),
		}));
	}

	return response;
}
