import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class TmdbNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tmdb Node',
		name: 'tmdbNode',
		icon: 'file:tmdb.svg',
		group: ['transform'],
		version: 1,
		description: 'Tmdb Node',
		defaults: {
			name: 'Tmdb Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tmdbApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'get_company',
				options: [
					{ name: 'Get Collection', value: 'get_collection' },
					{ name: 'Get Company', value: 'get_company' },
					{ name: 'Get Movie', value: 'get_movie' },
					{ name: 'Get Person', value: 'get_person' },
					{ name: 'Get TV', value: 'get_tv' },
				],
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: 'en',
			},
			{
				displayName: 'Company ID',
				name: 'company_id',
				type: 'number',
				default: '',
				placeholder: '123',
				displayOptions: {
					show: {
						'/operation': ['get_company'],
					},
				},
			},
			{
				displayName: 'Movie ID',
				name: 'movie_id',
				type: 'number',
				default: '',
				placeholder: '123',
				displayOptions: {
					show: {
						'/operation': ['get_movie'],
					},
				},
			},
			{
				displayName: 'Append to Response',
				name: 'movie_append_to_response',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						'/operation': ['get_movie'],
					},
				},
			},
			{
				displayName: 'Collection ID',
				name: 'collection_id',
				type: 'number',
				default: '',
				placeholder: '123',
				displayOptions: {
					show: {
						'/operation': ['get_collection'],
					},
				},
			},
			{
				displayName: 'Append to Response',
				name: 'collection_append_to_response',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						'/operation': ['get_collection'],
					},
				},
			},
			{
				displayName: 'Person ID',
				name: 'person_id',
				type: 'number',
				default: '',
				placeholder: '123',
				displayOptions: {
					show: {
						'/operation': ['get_person'],
					},
				},
			},
			{
				displayName: 'Append to Response',
				name: 'person_append_to_response',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						'/operation': ['get_person'],
					},
				},
			},
			{
				displayName: 'TV ID',
				name: 'tv_id',
				type: 'number',
				default: '',
				placeholder: '123',
				displayOptions: {
					show: {
						'/operation': ['get_tv'],
					},
				},
			},
			{
				displayName: 'Append to Response',
				name: 'tv_append_to_response',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						'/operation': ['get_tv'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const getUrls = function (filePath: string, sizes: string[]): Record<string, string> {
			const baseUrl = 'https://image.tmdb.org/t/p/';
			const urls: Record<string, string> = {};
			sizes.forEach((size) => {
				urls[size] = `${baseUrl}${size}/${filePath}`;
			});
			return urls;
		};

		const getPosterUrls = function (filePath: string): Record<string, string> {
			const posterSizes = ['original', 'w92', 'w154', 'w185', 'w342', 'w500', 'w780'];
			return getUrls(filePath, posterSizes);
		};
		const getLogoUrls = function (filePath: string): Record<string, string> {
			const logoSizes = ['original', 'w45', 'w92', 'w154', 'w185', 'w300', 'w500'];
			return getUrls(filePath, logoSizes);
		};

		const getBackdropUrls = function (filePath: string): Record<string, string> {
			const backdropSizes = ['original', 'w300', 'w780', 'w1280'];
			return getUrls(filePath, backdropSizes);
		};

		const getProfileUrls = function (filePath: string): Record<string, string> {
			const profileSizes = ['original', 'w45', 'w185', 'h632'];
			return getUrls(filePath, profileSizes);
		};

		const getStillUrls = function (filePath: string): Record<string, string> {
			const stillSizes = ['original', 'w92', 'w185', 'w300'];
			return getUrls(filePath, stillSizes);
		};

		let item: INodeExecutionData;
		let operation: string;

		let language: string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				item = items[itemIndex];

				operation = this.getNodeParameter('operation', itemIndex) as string;
				language = this.getNodeParameter('language', itemIndex) as string;

				switch (operation) {
					case 'get_collection':
						const collectionId = this.getNodeParameter('collection_id', itemIndex) as number;
						const collectionAppendToResponse = this.getNodeParameter(
							'collection_append_to_response',
							itemIndex,
						) as string;

						const getCollectionDetailResponse =
							await this.helpers.httpRequestWithAuthentication.call(this, 'tmdbApi', {
								headers: {
									Accept: 'application/json',
								},
								method: 'GET',
								url: `https://api.themoviedb.org/3/collection/${collectionId}?language=${language}&append_to_response=${collectionAppendToResponse}`,
							});

						if (getCollectionDetailResponse.images) {
							getCollectionDetailResponse.images.backdrops =
								getCollectionDetailResponse.images?.backdrops?.map((backdrop: any) => ({
									...backdrop,
									urls: getBackdropUrls(backdrop.file_path),
								}));
							getCollectionDetailResponse.images.posters =
								getCollectionDetailResponse.images?.posters?.map((poster: any) => ({
									...poster,
									urls: getPosterUrls(poster.file_path),
								}));
						}

						if (getCollectionDetailResponse.parts) {
							getCollectionDetailResponse.parts = getCollectionDetailResponse.parts.map(
								(part: any) => ({
									...part,
									poster_urls: part.poster_path ? getPosterUrls(part.poster_path) : null,
									backdrop_urls: part.backdrop_path ? getBackdropUrls(part.backdrop_path) : null,
								}),
							);
						}

						item.json = {
							...getCollectionDetailResponse,
							poster_urls: getCollectionDetailResponse.poster_path
								? getPosterUrls(getCollectionDetailResponse.poster_path)
								: null,
							backdrop_urls: getCollectionDetailResponse.backdrop_path
								? getBackdropUrls(getCollectionDetailResponse.backdrop_path)
								: null,
						};

						break;
					case 'get_company':
						const companyId = this.getNodeParameter('company_id', itemIndex) as number;

						const getCompanyDetailResponse = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'tmdbApi',
							{
								headers: {
									Accept: 'application/json',
								},
								method: 'GET',
								url: `https://api.themoviedb.org/3/company/${companyId}?language=${language}`,
							},
						);
						item.json = {
							...getCompanyDetailResponse,
							logo_urls: getCompanyDetailResponse.logo_path
								? getLogoUrls(getCompanyDetailResponse.logo_path)
								: null,
						};

						break;
					case 'get_movie':
						const movieId = this.getNodeParameter('movie_id', itemIndex) as number;
						const movieAppendToResponse = this.getNodeParameter(
							'movie_append_to_response',
							itemIndex,
						) as string;

						const getMovieDetailResponse = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'tmdbApi',
							{
								headers: {
									Accept: 'application/json',
								},
								method: 'GET',
								url: `https://api.themoviedb.org/3/movie/${movieId}?language=${language}&append_to_response=${movieAppendToResponse}`,
							},
						);

						if (getMovieDetailResponse.belongs_to_collection) {
							getMovieDetailResponse.belongs_to_collection = {
								...getMovieDetailResponse.belongs_to_collection,
								poster_urls: getMovieDetailResponse.belongs_to_collection.poster_path
									? getPosterUrls(getMovieDetailResponse.belongs_to_collection.poster_path)
									: null,
								backdrop_urls: getMovieDetailResponse.belongs_to_collection.backdrop_path
									? getBackdropUrls(getMovieDetailResponse.belongs_to_collection.backdrop_path)
									: null,
							};
						}

						if (getMovieDetailResponse.production_companies) {
							getMovieDetailResponse.production_companies =
								getMovieDetailResponse.production_companies.map((company: any) => ({
									...company,
									logo_urls: company.logo_path ? getLogoUrls(company.logo_path) : null,
								}));
						}

						if (getMovieDetailResponse.images) {
							getMovieDetailResponse.images.backdrops =
								getMovieDetailResponse.images?.backdrops?.map((backdrop: any) => ({
									...backdrop,
									urls: getBackdropUrls(backdrop.file_path),
								}));
							getMovieDetailResponse.images.logos = getMovieDetailResponse.images?.logos?.map(
								(logo: any) => ({
									...logo,
									urls: getLogoUrls(logo.file_path),
								}),
							);
							getMovieDetailResponse.images.posters = getMovieDetailResponse.images?.posters?.map(
								(poster: any) => ({
									...poster,
									urls: getPosterUrls(poster.file_path),
								}),
							);
						}
						if (getMovieDetailResponse.credits) {
							getMovieDetailResponse.credits.cast = getMovieDetailResponse.credits.cast.map(
								(cast: any) => ({
									...cast,
									profile_urls: cast.profile_path ? getProfileUrls(cast.profile_path) : null,
								}),
							);
							getMovieDetailResponse.credits.crew = getMovieDetailResponse.credits.crew.map(
								(crew: any) => ({
									...crew,
									profile_urls: crew.profile_path ? getProfileUrls(crew.profile_path) : null,
								}),
							);
						}

						item.json = {
							...getMovieDetailResponse,
							poster_urls: getMovieDetailResponse.poster_path
								? getPosterUrls(getMovieDetailResponse.poster_path)
								: null,
							backdrop_urls: getMovieDetailResponse.backdrop_path
								? getBackdropUrls(getMovieDetailResponse.backdrop_path)
								: null,
						};
						break;
					case 'get_person':
						const personId = this.getNodeParameter('person_id', itemIndex) as number;
						const personAppendToResponse = this.getNodeParameter(
							'person_append_to_response',
							itemIndex,
						) as string;

						const getPersonDetailResponse = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'tmdbApi',
							{
								headers: {
									Accept: 'application/json',
								},
								method: 'GET',
								url: `https://api.themoviedb.org/3/person/${personId}?language=${language}&append_to_response=${personAppendToResponse}`,
							},
						);

						if (getPersonDetailResponse.combined_credits) {
							getPersonDetailResponse.combined_credits.cast =
								getPersonDetailResponse.combined_credits.cast?.map((cast: any) => ({
									...cast,
									backdrop_urls: cast.backdrop_path ? getBackdropUrls(cast.backdrop_path) : null,
									poster_urls: cast.poster_path ? getPosterUrls(cast.poster_path) : null,
								}));
							getPersonDetailResponse.combined_credits.crew =
								getPersonDetailResponse.combined_credits.crew?.map((crew: any) => ({
									...crew,
									backdrop_urls: crew.backdrop_path ? getBackdropUrls(crew.backdrop_path) : null,
									poster_urls: crew.poster_path ? getPosterUrls(crew.poster_path) : null,
								}));
						}
						if (getPersonDetailResponse.movie_credits) {
							getPersonDetailResponse.movie_credits.cast =
								getPersonDetailResponse.movie_credits.cast?.map((cast: any) => ({
									...cast,
									backdrop_urls: cast.backdrop_path ? getBackdropUrls(cast.backdrop_path) : null,
									poster_urls: cast.poster_path ? getPosterUrls(cast.poster_path) : null,
								}));
							getPersonDetailResponse.movie_credits.crew =
								getPersonDetailResponse.movie_credits.crew?.map((crew: any) => ({
									...crew,
									backdrop_urls: crew.backdrop_path ? getBackdropUrls(crew.backdrop_path) : null,
									poster_urls: crew.poster_path ? getPosterUrls(crew.poster_path) : null,
								}));
						}

						if (getPersonDetailResponse.tv_credits) {
							getPersonDetailResponse.tv_credits.cast =
								getPersonDetailResponse.tv_credits.cast?.map((cast: any) => ({
									...cast,
									backdrop_urls: cast.backdrop_path ? getBackdropUrls(cast.backdrop_path) : null,
									poster_urls: cast.poster_path ? getPosterUrls(cast.poster_path) : null,
								}));
							getPersonDetailResponse.tv_credits.crew =
								getPersonDetailResponse.tv_credits.crew?.map((crew: any) => ({
									...crew,
									backdrop_urls: crew.backdrop_path ? getBackdropUrls(crew.backdrop_path) : null,
									poster_urls: crew.poster_path ? getPosterUrls(crew.poster_path) : null,
								}));
						}

						if (getPersonDetailResponse.images) {
							getPersonDetailResponse.images.profiles =
								getPersonDetailResponse.images?.profiles?.map((profile: any) => ({
									...profile,
									urls: getProfileUrls(profile.file_path),
								}));
						}

						item.json = {
							...getPersonDetailResponse,
							profile_urls: getPersonDetailResponse.profile_path
								? getProfileUrls(getPersonDetailResponse.profile_path)
								: null,
						};
						break;

					case 'get_tv':
						const tvId = this.getNodeParameter('tv_id', itemIndex) as number;
						const tvAppendToResponse = this.getNodeParameter(
							'tv_append_to_response',
							itemIndex,
						) as string;

						const getTvDetailResponse = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'tmdbApi',
							{
								headers: {
									Accept: 'application/json',
								},
								method: 'GET',
								url: `https://api.themoviedb.org/3/tv/${tvId}?language=${language}&append_to_response=${tvAppendToResponse}`,
							},
						);

						if (getTvDetailResponse.created_by) {
							getTvDetailResponse.created_by = getTvDetailResponse.created_by.map(
								(createdBy: any) => ({
									...createdBy,
									profile_urls: createdBy.profile_path
										? getProfileUrls(createdBy.profile_path)
										: null,
								}),
							);
						}

						if (getTvDetailResponse.production_companies) {
							getTvDetailResponse.production_companies =
								getTvDetailResponse.production_companies.map((company: any) => ({
									...company,
									logo_urls: company.logo_path ? getLogoUrls(company.logo_path) : null,
								}));
						}

						if (getTvDetailResponse.networks) {
							getTvDetailResponse.networks = getTvDetailResponse.networks.map((network: any) => ({
								...network,
								logo_urls: network.logo_path ? getLogoUrls(network.logo_path) : null,
							}));
						}

						if (getTvDetailResponse.seasons) {
							getTvDetailResponse.seasons = getTvDetailResponse.seasons.map((season: any) => ({
								...season,
								poster_urls: season.poster_path ? getLogoUrls(season.poster_path) : null,
							}));
						}

						if (getTvDetailResponse.images) {
							getTvDetailResponse.images.backdrops = getTvDetailResponse.images?.backdrops?.map(
								(backdrop: any) => ({
									...backdrop,
									urls: getBackdropUrls(backdrop.file_path),
								}),
							);
							getTvDetailResponse.images.logos = getTvDetailResponse.images?.logos?.map(
								(logo: any) => ({
									...logo,
									urls: getLogoUrls(logo.file_path),
								}),
							);
							getTvDetailResponse.images.posters = getTvDetailResponse.images?.posters?.map(
								(poster: any) => ({
									...poster,
									urls: getPosterUrls(poster.file_path),
								}),
							);
						}
						if (getTvDetailResponse.credits) {
							getTvDetailResponse.credits.cast = getTvDetailResponse.credits.cast.map(
								(cast: any) => ({
									...cast,
									profile_urls: cast.profile_path ? getProfileUrls(cast.profile_path) : null,
								}),
							);
							getTvDetailResponse.credits.crew = getTvDetailResponse.credits.crew.map(
								(crew: any) => ({
									...crew,
									profile_urls: crew.profile_path ? getProfileUrls(crew.profile_path) : null,
								}),
							);
						}

						if (getTvDetailResponse.last_episode_to_air) {
							getTvDetailResponse.last_episode_to_air = {
								...getTvDetailResponse.last_episode_to_air,
								still_urls: getTvDetailResponse.last_episode_to_air.still_path
									? getStillUrls(getTvDetailResponse.last_episode_to_air.still_path)
									: null,
							};
						}

						if (getTvDetailResponse.next_episode_to_air) {
							getTvDetailResponse.next_episode_to_air = {
								...getTvDetailResponse.next_episode_to_air,
								still_urls: getTvDetailResponse.next_episode_to_air.still_path
									? getStillUrls(getTvDetailResponse.next_episode_to_air.still_path)
									: null,
							};
						}

						item.json = {
							...getTvDetailResponse,
							poster_urls: getTvDetailResponse.poster_path
								? getPosterUrls(getTvDetailResponse.poster_path)
								: null,
							backdrop_urls: getTvDetailResponse.backdrop_path
								? getBackdropUrls(getTvDetailResponse.backdrop_path)
								: null,
						};
						break;
				}
			} catch (error) {
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}
