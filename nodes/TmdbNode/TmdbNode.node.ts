import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { getCollection } from './CollectionFunctions';
import { getCompany } from './CompanyFunctions';
import { getMovie } from './MovieFunctions';
import { getPerson } from './PersonFunctions';
import { getTv } from './TvFunctions';

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

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				item = items[itemIndex];

				operation = this.getNodeParameter('operation', itemIndex) as string;

				switch (operation) {
					case 'get_collection':
						item.json = await getCollection(this, itemIndex);
						break;
					case 'get_company':
						item.json = await getCompany(this, itemIndex);
						break;
					case 'get_movie':
						item.json = await getMovie(this, itemIndex);
						break;
					case 'get_person':
						item.json = await getPerson(this, itemIndex);
						break;
					case 'get_tv':
						item.json = await getTv(this, itemIndex);
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
