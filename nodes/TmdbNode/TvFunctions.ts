import { IExecuteFunctions } from 'n8n-workflow';
import {
	getBackdropUrls,
	getLogoUrls,
	getPosterUrls,
	getProfileUrls,
	getStillUrls,
} from './UrlFunctions';

export async function getTv(context: IExecuteFunctions, itemIndex: number) {
	const language = context.getNodeParameter('language', itemIndex) as string;
	const tvId = context.getNodeParameter('tv_id', itemIndex) as number;
	const appendToResponse = context.getNodeParameter('tv_append_to_response', itemIndex) as string;

	const response = await context.helpers.httpRequestWithAuthentication.call(context, 'tmdbApi', {
		headers: {
			Accept: 'application/json',
		},
		method: 'GET',
		url: `https://api.themoviedb.org/3/tv/${tvId}?language=${language}&append_to_response=${appendToResponse}`,
	});

	if (response.created_by) {
		response.created_by = response.created_by.map((createdBy: any) => ({
			...createdBy,
			profile_urls: getProfileUrls(createdBy.profile_path),
		}));
	}

	if (response.production_companies) {
		response.production_companies = response.production_companies.map((company: any) => ({
			...company,
			logo_urls: getLogoUrls(company.logo_path),
		}));
	}

	if (response.networks) {
		response.networks = response.networks.map((network: any) => ({
			...network,
			logo_urls: getLogoUrls(network.logo_path),
		}));
	}

	if (response.seasons) {
		response.seasons = response.seasons.map((season: any) => ({
			...season,
			poster_urls: getLogoUrls(season.poster_path),
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

	if (response.last_episode_to_air) {
		response.last_episode_to_air = {
			...response.last_episode_to_air,
			still_urls: getStillUrls(response.last_episode_to_air.still_path),
		};
	}

	if (response.next_episode_to_air) {
		response.next_episode_to_air = {
			...response.next_episode_to_air,
			still_urls: getStillUrls(response.next_episode_to_air.still_path),
		};
	}

	return {
		...response,
		poster_urls: getPosterUrls(response.poster_path),
		backdrop_urls: getBackdropUrls(response.backdrop_path),
	};
}
