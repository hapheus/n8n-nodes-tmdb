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
									urls: {
										original: `https://image.tmdb.org/t/p/original/${backdrop.file_path}`,
										w300: `https://image.tmdb.org/t/p/w300/${backdrop.file_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${backdrop.file_path}`,
										w1280: `https://image.tmdb.org/t/p/w1280/${backdrop.file_path}`,
									},
								}));
							getCollectionDetailResponse.images.posters =
								getCollectionDetailResponse.images?.posters?.map((poster: any) => ({
									...poster,
									urls: {
										original: `https://image.tmdb.org/t/p/original/${poster.file_path}`,
										w92: `https://image.tmdb.org/t/p/w92/${poster.file_path}`,
										w154: `https://image.tmdb.org/t/p/w154/${poster.file_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${poster.file_path}`,
										w342: `https://image.tmdb.org/t/p/w342/${poster.file_path}`,
										w500: `https://image.tmdb.org/t/p/w500/${poster.file_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${poster.file_path}`,
									},
								}));
						}

						if (getCollectionDetailResponse.parts) {
							getCollectionDetailResponse.parts = getCollectionDetailResponse.parts.map(
								(part: any) => ({
									...part,
									poster_urls: part.poster_path
										? {
												original: `https://image.tmdb.org/t/p/original/${part.poster_path}`,
												w92: `https://image.tmdb.org/t/p/w92/${part.poster_path}`,
												w154: `https://image.tmdb.org/t/p/w154/${part.poster_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${part.poster_path}`,
												w342: `https://image.tmdb.org/t/p/w342/${part.poster_path}`,
												w500: `https://image.tmdb.org/t/p/w500/${part.poster_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${part.poster_path}`,
											}
										: null,
									backdrop_urls: part.backdrop_path
										? {
												original: `https://image.tmdb.org/t/p/original/${part.backdrop_path}`,
												w300: `https://image.tmdb.org/t/p/w300/${part.backdrop_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${part.backdrop_path}`,
												w1280: `https://image.tmdb.org/t/p/w1280/${part.backdrop_path}`,
											}
										: null,
								}),
							);
						}

						item.json = {
							...getCollectionDetailResponse,
							poster_urls: getCollectionDetailResponse.poster_path
								? {
										original: `https://image.tmdb.org/t/p/original/${getCollectionDetailResponse.poster_path}`,
										w92: `https://image.tmdb.org/t/p/w92/${getCollectionDetailResponse.poster_path}`,
										w154: `https://image.tmdb.org/t/p/w154/${getCollectionDetailResponse.poster_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${getCollectionDetailResponse.poster_path}`,
										w342: `https://image.tmdb.org/t/p/w342/${getCollectionDetailResponse.poster_path}`,
										w500: `https://image.tmdb.org/t/p/w500/${getCollectionDetailResponse.poster_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${getCollectionDetailResponse.poster_path}`,
									}
								: null,
							backdrop_urls: getCollectionDetailResponse.backdrop_path
								? {
										original: `https://image.tmdb.org/t/p/original/${getCollectionDetailResponse.backdrop_path}`,
										w300: `https://image.tmdb.org/t/p/w300/${getCollectionDetailResponse.backdrop_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${getCollectionDetailResponse.backdrop_path}`,
										w1280: `https://image.tmdb.org/t/p/w1280/${getCollectionDetailResponse.backdrop_path}`,
									}
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
								? {
										original: `https://image.tmdb.org/t/p/original/${getCompanyDetailResponse.logo_path}`,
										w45: `https://image.tmdb.org/t/p/w45/${getCompanyDetailResponse.logo_path}`,
										w92: `https://image.tmdb.org/t/p/w92/${getCompanyDetailResponse.logo_path}`,
										w154: `https://image.tmdb.org/t/p/w154/${getCompanyDetailResponse.logo_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${getCompanyDetailResponse.logo_path}`,
										w300: `https://image.tmdb.org/t/p/w300/${getCompanyDetailResponse.logo_path}`,
										w500: `https://image.tmdb.org/t/p/w500/${getCompanyDetailResponse.logo_path}`,
									}
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
									? {
											original: `https://image.tmdb.org/t/p/original/${getMovieDetailResponse.belongs_to_collection.poster_path}`,
											w92: `https://image.tmdb.org/t/p/w92/${getMovieDetailResponse.belongs_to_collection.poster_path}`,
											w154: `https://image.tmdb.org/t/p/w154/${getMovieDetailResponse.belongs_to_collection.poster_path}`,
											w185: `https://image.tmdb.org/t/p/w185/${getMovieDetailResponse.belongs_to_collection.poster_path}`,
											w342: `https://image.tmdb.org/t/p/w342/${getMovieDetailResponse.belongs_to_collection.poster_path}`,
											w500: `https://image.tmdb.org/t/p/w500/${getMovieDetailResponse.belongs_to_collection.poster_path}`,
											w780: `https://image.tmdb.org/t/p/w780/${getMovieDetailResponse.belongs_to_collection.poster_path}`,
										}
									: null,
								backdrop_urls: getMovieDetailResponse.belongs_to_collection.backdrop_path
									? {
											original: `https://image.tmdb.org/t/p/original/${getMovieDetailResponse.belongs_to_collection.backdrop_path}`,
											w300: `https://image.tmdb.org/t/p/w300/${getMovieDetailResponse.belongs_to_collection.backdrop_path}`,
											w780: `https://image.tmdb.org/t/p/w780/${getMovieDetailResponse.belongs_to_collection.backdrop_path}`,
											w1280: `https://image.tmdb.org/t/p/w1280/${getMovieDetailResponse.belongs_to_collection.backdrop_path}`,
										}
									: null,
							};
						}

						if (getMovieDetailResponse.production_companies) {
							getMovieDetailResponse.production_companies =
								getMovieDetailResponse.production_companies.map((company: any) => ({
									...company,
									logo_urls: company.logo_path
										? {
												original: `https://image.tmdb.org/t/p/original/${company.logo_path}`,
												w45: `https://image.tmdb.org/t/p/w45/${company.logo_path}`,
												w92: `https://image.tmdb.org/t/p/w92/${company.logo_path}`,
												w154: `https://image.tmdb.org/t/p/w154/${company.logo_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${company.logo_path}`,
												w300: `https://image.tmdb.org/t/p/w300/${company.logo_path}`,
												w500: `https://image.tmdb.org/t/p/w500/${company.logo_path}`,
											}
										: null,
								}));
						}

						if (getMovieDetailResponse.images) {
							getMovieDetailResponse.images.backdrops =
								getMovieDetailResponse.images?.backdrops?.map((backdrop: any) => ({
									...backdrop,
									urls: {
										original: `https://image.tmdb.org/t/p/original/${backdrop.file_path}`,
										w300: `https://image.tmdb.org/t/p/w300/${backdrop.file_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${backdrop.file_path}`,
										w1280: `https://image.tmdb.org/t/p/w1280/${backdrop.file_path}`,
									},
								}));
							getMovieDetailResponse.images.logos = getMovieDetailResponse.images?.logos?.map(
								(logo: any) => ({
									...logo,
									urls: {
										original: `https://image.tmdb.org/t/p/original/${logo.file_path}`,
										w45: `https://image.tmdb.org/t/p/w45/${logo.file_path}`,
										w92: `https://image.tmdb.org/t/p/w92/${logo.file_path}`,
										w154: `https://image.tmdb.org/t/p/w154/${logo.file_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${logo.file_path}`,
										w300: `https://image.tmdb.org/t/p/w300/${logo.file_path}`,
										w500: `https://image.tmdb.org/t/p/w500/${logo.file_path}`,
									},
								}),
							);
							getMovieDetailResponse.images.posters = getMovieDetailResponse.images?.posters?.map(
								(poster: any) => ({
									...poster,
									urls: {
										original: `https://image.tmdb.org/t/p/original/${poster.file_path}`,
										w92: `https://image.tmdb.org/t/p/w92/${poster.file_path}`,
										w154: `https://image.tmdb.org/t/p/w154/${poster.file_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${poster.file_path}`,
										w342: `https://image.tmdb.org/t/p/w342/${poster.file_path}`,
										w500: `https://image.tmdb.org/t/p/w500/${poster.file_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${poster.file_path}`,
									},
								}),
							);
						}
						if (getMovieDetailResponse.credits) {
							getMovieDetailResponse.credits.cast = getMovieDetailResponse.credits.cast.map(
								(cast: any) => ({
									...cast,
									profile_urls: cast.profile_path
										? {
												original: `https://image.tmdb.org/t/p/original/${cast.profile_path}`,
												w45: `https://image.tmdb.org/t/p/w45/${cast.profile_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${cast.profile_path}`,
												h632: `https://image.tmdb.org/t/p/h632/${cast.profile_path}`,
											}
										: null,
								}),
							);
							getMovieDetailResponse.credits.crew = getMovieDetailResponse.credits.crew.map(
								(crew: any) => ({
									...crew,
									profile_urls: crew.profile_path
										? {
												original: `https://image.tmdb.org/t/p/original/${crew.profile_path}`,
												w45: `https://image.tmdb.org/t/p/w45/${crew.profile_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${crew.profile_path}`,
												h632: `https://image.tmdb.org/t/p/h632/${crew.profile_path}`,
											}
										: null,
								}),
							);
						}

						item.json = {
							...getMovieDetailResponse,
							poster_urls: getMovieDetailResponse.poster_path
								? {
										original: `https://image.tmdb.org/t/p/original/${getMovieDetailResponse.poster_path}`,
										w92: `https://image.tmdb.org/t/p/w92/${getMovieDetailResponse.poster_path}`,
										w154: `https://image.tmdb.org/t/p/w154/${getMovieDetailResponse.poster_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${getMovieDetailResponse.poster_path}`,
										w342: `https://image.tmdb.org/t/p/w342/${getMovieDetailResponse.poster_path}`,
										w500: `https://image.tmdb.org/t/p/w500/${getMovieDetailResponse.poster_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${getMovieDetailResponse.poster_path}`,
									}
								: null,
							backdrop_urls: getMovieDetailResponse.backdrop_path
								? {
										original: `https://image.tmdb.org/t/p/original/${getMovieDetailResponse.backdrop_path}`,
										w300: `https://image.tmdb.org/t/p/w300/${getMovieDetailResponse.backdrop_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${getMovieDetailResponse.backdrop_path}`,
										w1280: `https://image.tmdb.org/t/p/w1280/${getMovieDetailResponse.backdrop_path}`,
									}
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
									backdrop_urls: cast.backdrop_path
										? {
												original: `https://image.tmdb.org/t/p/original/${cast.backdrop_path}`,
												w300: `https://image.tmdb.org/t/p/w300/${cast.backdrop_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${cast.backdrop_path}`,
												w1280: `https://image.tmdb.org/t/p/w1280/${cast.backdrop_path}`,
											}
										: null,
									poster_urls: cast.poster_path
										? {
												original: `https://image.tmdb.org/t/p/original/${cast.poster_path}`,
												w92: `https://image.tmdb.org/t/p/w92/${cast.poster_path}`,
												w154: `https://image.tmdb.org/t/p/w154/${cast.poster_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${cast.poster_path}`,
												w342: `https://image.tmdb.org/t/p/w342/${cast.poster_path}`,
												w500: `https://image.tmdb.org/t/p/w500/${cast.poster_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${cast.poster_path}`,
											}
										: null,
								}));
							getPersonDetailResponse.combined_credits.crew =
								getPersonDetailResponse.combined_credits.crew?.map((crew: any) => ({
									...crew,
									backdrop_urls: crew.backdrop_path
										? {
												original: `https://image.tmdb.org/t/p/original/${crew.backdrop_path}`,
												w300: `https://image.tmdb.org/t/p/w300/${crew.backdrop_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${crew.backdrop_path}`,
												w1280: `https://image.tmdb.org/t/p/w1280/${crew.backdrop_path}`,
											}
										: null,
									poster_urls: crew.poster_path
										? {
												original: `https://image.tmdb.org/t/p/original/${crew.poster_path}`,
												w92: `https://image.tmdb.org/t/p/w92/${crew.poster_path}`,
												w154: `https://image.tmdb.org/t/p/w154/${crew.poster_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${crew.poster_path}`,
												w342: `https://image.tmdb.org/t/p/w342/${crew.poster_path}`,
												w500: `https://image.tmdb.org/t/p/w500/${crew.poster_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${crew.poster_path}`,
											}
										: null,
								}));
						}
						if (getPersonDetailResponse.movie_credits) {
							getPersonDetailResponse.movie_credits.cast =
								getPersonDetailResponse.movie_credits.cast?.map((cast: any) => ({
									...cast,
									backdrop_urls: cast.backdrop_path
										? {
												original: `https://image.tmdb.org/t/p/original/${cast.backdrop_path}`,
												w300: `https://image.tmdb.org/t/p/w300/${cast.backdrop_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${cast.backdrop_path}`,
												w1280: `https://image.tmdb.org/t/p/w1280/${cast.backdrop_path}`,
											}
										: null,
									poster_urls: cast.poster_path
										? {
												original: `https://image.tmdb.org/t/p/original/${cast.poster_path}`,
												w92: `https://image.tmdb.org/t/p/w92/${cast.poster_path}`,
												w154: `https://image.tmdb.org/t/p/w154/${cast.poster_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${cast.poster_path}`,
												w342: `https://image.tmdb.org/t/p/w342/${cast.poster_path}`,
												w500: `https://image.tmdb.org/t/p/w500/${cast.poster_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${cast.poster_path}`,
											}
										: null,
								}));
							getPersonDetailResponse.movie_credits.crew =
								getPersonDetailResponse.movie_credits.crew?.map((crew: any) => ({
									...crew,
									backdrop_urls: crew.backdrop_path
										? {
												original: `https://image.tmdb.org/t/p/original/${crew.backdrop_path}`,
												w300: `https://image.tmdb.org/t/p/w300/${crew.backdrop_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${crew.backdrop_path}`,
												w1280: `https://image.tmdb.org/t/p/w1280/${crew.backdrop_path}`,
											}
										: null,
									poster_urls: crew.poster_path
										? {
												original: `https://image.tmdb.org/t/p/original/${crew.poster_path}`,
												w92: `https://image.tmdb.org/t/p/w92/${crew.poster_path}`,
												w154: `https://image.tmdb.org/t/p/w154/${crew.poster_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${crew.poster_path}`,
												w342: `https://image.tmdb.org/t/p/w342/${crew.poster_path}`,
												w500: `https://image.tmdb.org/t/p/w500/${crew.poster_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${crew.poster_path}`,
											}
										: null,
								}));
						}

						if (getPersonDetailResponse.tv_credits) {
							getPersonDetailResponse.tv_credits.cast =
								getPersonDetailResponse.tv_credits.cast?.map((cast: any) => ({
									...cast,
									backdrop_urls: cast.backdrop_path
										? {
												original: `https://image.tmdb.org/t/p/original/${cast.backdrop_path}`,
												w300: `https://image.tmdb.org/t/p/w300/${cast.backdrop_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${cast.backdrop_path}`,
												w1280: `https://image.tmdb.org/t/p/w1280/${cast.backdrop_path}`,
											}
										: null,
									poster_urls: cast.poster_path
										? {
												original: `https://image.tmdb.org/t/p/original/${cast.poster_path}`,
												w92: `https://image.tmdb.org/t/p/w92/${cast.poster_path}`,
												w154: `https://image.tmdb.org/t/p/w154/${cast.poster_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${cast.poster_path}`,
												w342: `https://image.tmdb.org/t/p/w342/${cast.poster_path}`,
												w500: `https://image.tmdb.org/t/p/w500/${cast.poster_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${cast.poster_path}`,
											}
										: null,
								}));
							getPersonDetailResponse.tv_credits.crew =
								getPersonDetailResponse.tv_credits.crew?.map((crew: any) => ({
									...crew,
									backdrop_urls: crew.backdrop_path
										? {
												original: `https://image.tmdb.org/t/p/original/${crew.backdrop_path}`,
												w300: `https://image.tmdb.org/t/p/w300/${crew.backdrop_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${crew.backdrop_path}`,
												w1280: `https://image.tmdb.org/t/p/w1280/${crew.backdrop_path}`,
											}
										: null,
									poster_urls: crew.poster_path
										? {
												original: `https://image.tmdb.org/t/p/original/${crew.poster_path}`,
												w92: `https://image.tmdb.org/t/p/w92/${crew.poster_path}`,
												w154: `https://image.tmdb.org/t/p/w154/${crew.poster_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${crew.poster_path}`,
												w342: `https://image.tmdb.org/t/p/w342/${crew.poster_path}`,
												w500: `https://image.tmdb.org/t/p/w500/${crew.poster_path}`,
												w780: `https://image.tmdb.org/t/p/w780/${crew.poster_path}`,
											}
										: null,
								}));
						}

						if (getPersonDetailResponse.images) {
							getPersonDetailResponse.images.profiles =
								getPersonDetailResponse.images?.profiles?.map((profile: any) => ({
									...profile,
									urls: {
										original: `https://image.tmdb.org/t/p/original/${profile.file_path}`,
										w45: `https://image.tmdb.org/t/p/w45/${profile.file_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${profile.file_path}`,
										h632: `https://image.tmdb.org/t/p/h632/${profile.file_path}`,
									},
								}));
						}

						item.json = {
							...getPersonDetailResponse,
							profile_urls: getPersonDetailResponse.profile_path
								? {
										original: `https://image.tmdb.org/t/p/original/${getPersonDetailResponse.profile_path}`,
										w45: `https://image.tmdb.org/t/p/w45/${getPersonDetailResponse.profile_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${getPersonDetailResponse.profile_path}`,
										h632: `https://image.tmdb.org/t/p/h632/${getPersonDetailResponse.profile_path}`,
									}
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
										? {
												original: `https://image.tmdb.org/t/p/original/${createdBy.profile_path}`,
												w45: `https://image.tmdb.org/t/p/w45/${createdBy.profile_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${createdBy.profile_path}`,
												h632: `https://image.tmdb.org/t/p/h632/${createdBy.profile_path}`,
											}
										: null,
								}),
							);
						}

						if (getTvDetailResponse.production_companies) {
							getTvDetailResponse.production_companies =
								getTvDetailResponse.production_companies.map((company: any) => ({
									...company,
									logo_urls: company.logo_path
										? {
												original: `https://image.tmdb.org/t/p/original/${company.logo_path}`,
												w45: `https://image.tmdb.org/t/p/w45/${company.logo_path}`,
												w92: `https://image.tmdb.org/t/p/w92/${company.logo_path}`,
												w154: `https://image.tmdb.org/t/p/w154/${company.logo_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${company.logo_path}`,
												w300: `https://image.tmdb.org/t/p/w300/${company.logo_path}`,
												w500: `https://image.tmdb.org/t/p/w500/${company.logo_path}`,
											}
										: null,
								}));
						}

						if (getTvDetailResponse.networks) {
							getTvDetailResponse.networks = getTvDetailResponse.networks.map((network: any) => ({
								...network,
								logo_urls: network.logo_path
									? {
											original: `https://image.tmdb.org/t/p/original/${network.logo_path}`,
											w45: `https://image.tmdb.org/t/p/w45/${network.logo_path}`,
											w92: `https://image.tmdb.org/t/p/w92/${network.logo_path}`,
											w154: `https://image.tmdb.org/t/p/w154/${network.logo_path}`,
											w185: `https://image.tmdb.org/t/p/w185/${network.logo_path}`,
											w300: `https://image.tmdb.org/t/p/w300/${network.logo_path}`,
											w500: `https://image.tmdb.org/t/p/w500/${network.logo_path}`,
										}
									: null,
							}));
						}

						if (getTvDetailResponse.seasons) {
							getTvDetailResponse.seasons = getTvDetailResponse.seasons.map((season: any) => ({
								...season,
								poster_urls: season.poster_path
									? {
											original: `https://image.tmdb.org/t/p/original/${season.poster_path}`,
											w92: `https://image.tmdb.org/t/p/w92/${season.poster_path}`,
											w154: `https://image.tmdb.org/t/p/w154/${season.poster_path}`,
											w185: `https://image.tmdb.org/t/p/w185/${season.poster_path}`,
											w342: `https://image.tmdb.org/t/p/w342/${season.poster_path}`,
											w500: `https://image.tmdb.org/t/p/w500/${season.poster_path}`,
											w780: `https://image.tmdb.org/t/p/w780/${season.poster_path}`,
										}
									: null,
							}));
						}

						if (getTvDetailResponse.images) {
							getTvDetailResponse.images.backdrops = getTvDetailResponse.images?.backdrops?.map(
								(backdrop: any) => ({
									...backdrop,
									urls: {
										original: `https://image.tmdb.org/t/p/original/${backdrop.file_path}`,
										w300: `https://image.tmdb.org/t/p/w300/${backdrop.file_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${backdrop.file_path}`,
										w1280: `https://image.tmdb.org/t/p/w1280/${backdrop.file_path}`,
									},
								}),
							);
							getTvDetailResponse.images.logos = getTvDetailResponse.images?.logos?.map(
								(logo: any) => ({
									...logo,
									urls: {
										original: `https://image.tmdb.org/t/p/original/${logo.file_path}`,
										w45: `https://image.tmdb.org/t/p/w45/${logo.file_path}`,
										w92: `https://image.tmdb.org/t/p/w92/${logo.file_path}`,
										w154: `https://image.tmdb.org/t/p/w154/${logo.file_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${logo.file_path}`,
										w300: `https://image.tmdb.org/t/p/w300/${logo.file_path}`,
										w500: `https://image.tmdb.org/t/p/w500/${logo.file_path}`,
									},
								}),
							);
							getTvDetailResponse.images.posters = getTvDetailResponse.images?.posters?.map(
								(poster: any) => ({
									...poster,
									urls: {
										original: `https://image.tmdb.org/t/p/original/${poster.file_path}`,
										w92: `https://image.tmdb.org/t/p/w92/${poster.file_path}`,
										w154: `https://image.tmdb.org/t/p/w154/${poster.file_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${poster.file_path}`,
										w342: `https://image.tmdb.org/t/p/w342/${poster.file_path}`,
										w500: `https://image.tmdb.org/t/p/w500/${poster.file_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${poster.file_path}`,
									},
								}),
							);
						}
						if (getTvDetailResponse.credits) {
							getTvDetailResponse.credits.cast = getTvDetailResponse.credits.cast.map(
								(cast: any) => ({
									...cast,
									profile_urls: cast.profile_path
										? {
												original: `https://image.tmdb.org/t/p/original/${cast.profile_path}`,
												w45: `https://image.tmdb.org/t/p/w45/${cast.profile_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${cast.profile_path}`,
												h632: `https://image.tmdb.org/t/p/h632/${cast.profile_path}`,
											}
										: null,
								}),
							);
							getTvDetailResponse.credits.crew = getTvDetailResponse.credits.crew.map(
								(crew: any) => ({
									...crew,
									profile_urls: crew.profile_path
										? {
												original: `https://image.tmdb.org/t/p/original/${crew.profile_path}`,
												w45: `https://image.tmdb.org/t/p/w45/${crew.profile_path}`,
												w185: `https://image.tmdb.org/t/p/w185/${crew.profile_path}`,
												h632: `https://image.tmdb.org/t/p/h632/${crew.profile_path}`,
											}
										: null,
								}),
							);
						}

						if (getTvDetailResponse.last_episode_to_air) {
							getTvDetailResponse.last_episode_to_air = {
								...getTvDetailResponse.last_episode_to_air,
								still_urls: getTvDetailResponse.last_episode_to_air.still_path
									? {
											original: `https://image.tmdb.org/t/p/original/${getTvDetailResponse.last_episode_to_air.still_path}`,
											w92: `https://image.tmdb.org/t/p/w92/${getTvDetailResponse.last_episode_to_air.still_path}`,
											w185: `https://image.tmdb.org/t/p/w185/${getTvDetailResponse.last_episode_to_air.still_path}`,
											w300: `https://image.tmdb.org/t/p/w300/${getTvDetailResponse.last_episode_to_air.still_path}`,
										}
									: null,
							};
						}

						if (getTvDetailResponse.next_episode_to_air) {
							getTvDetailResponse.next_episode_to_air = {
								...getTvDetailResponse.next_episode_to_air,
								still_urls: getTvDetailResponse.next_episode_to_air.still_path
									? {
											original: `https://image.tmdb.org/t/p/original/${getTvDetailResponse.next_episode_to_air.still_path}`,
											w92: `https://image.tmdb.org/t/p/w92/${getTvDetailResponse.next_episode_to_air.still_path}`,
											w185: `https://image.tmdb.org/t/p/w185/${getTvDetailResponse.next_episode_to_air.still_path}`,
											w300: `https://image.tmdb.org/t/p/w300/${getTvDetailResponse.next_episode_to_air.still_path}`,
										}
									: null,
							};
						}

						item.json = {
							...getTvDetailResponse,
							poster_urls: getTvDetailResponse.poster_path
								? {
										original: `https://image.tmdb.org/t/p/original/${getTvDetailResponse.poster_path}`,
										w92: `https://image.tmdb.org/t/p/w92/${getTvDetailResponse.poster_path}`,
										w154: `https://image.tmdb.org/t/p/w154/${getTvDetailResponse.poster_path}`,
										w185: `https://image.tmdb.org/t/p/w185/${getTvDetailResponse.poster_path}`,
										w342: `https://image.tmdb.org/t/p/w342/${getTvDetailResponse.poster_path}`,
										w500: `https://image.tmdb.org/t/p/w500/${getTvDetailResponse.poster_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${getTvDetailResponse.poster_path}`,
									}
								: null,
							backdrop_urls: getTvDetailResponse.backdrop_path
								? {
										original: `https://image.tmdb.org/t/p/original/${getTvDetailResponse.backdrop_path}`,
										w300: `https://image.tmdb.org/t/p/w300/${getTvDetailResponse.backdrop_path}`,
										w780: `https://image.tmdb.org/t/p/w780/${getTvDetailResponse.backdrop_path}`,
										w1280: `https://image.tmdb.org/t/p/w1280/${getTvDetailResponse.backdrop_path}`,
									}
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
