import { IExecuteFunctions } from 'n8n-workflow';
import { getBackdropUrls, getPosterUrls } from './UrlFunctions';

export async function getCollection(context: IExecuteFunctions, itemIndex: number) {
	const language = context.getNodeParameter('language', itemIndex) as string;
	const collectionId = context.getNodeParameter('collection_id', itemIndex) as number;
	const appendToResponse = context.getNodeParameter(
		'collection_append_to_response',
		itemIndex,
	) as string;

	const response = await context.helpers.httpRequestWithAuthentication.call(context, 'tmdbApi', {
		headers: {
			Accept: 'application/json',
		},
		method: 'GET',
		url: `https://api.themoviedb.org/3/collection/${collectionId}?language=${language}&append_to_response=${appendToResponse}`,
	});

	if (response.images) {
		response.images.backdrops = response.images?.backdrops?.map((backdrop: any) => ({
			...backdrop,
			urls: getBackdropUrls(backdrop.file_path),
		}));
		response.images.posters = response.images?.posters?.map((poster: any) => ({
			...poster,
			urls: getPosterUrls(poster.file_path),
		}));
	}

	if (response.parts) {
		response.parts = response.parts.map((part: any) => ({
			...part,
			poster_urls: getPosterUrls(part.poster_path),
			backdrop_urls: getBackdropUrls(part.backdrop_path),
		}));
	}

	return {
		...response,
		poster_urls: getPosterUrls(response.poster_path),
		backdrop_urls: getBackdropUrls(response.backdrop_path),
	};
}
