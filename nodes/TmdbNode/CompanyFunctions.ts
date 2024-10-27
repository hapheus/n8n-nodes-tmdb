import { IExecuteFunctions } from 'n8n-workflow';
import { getLogoUrls } from './UrlFunctions';

export async function getCompany(context: IExecuteFunctions, itemIndex: number) {
	const companyId = context.getNodeParameter('company_id', itemIndex) as number;
	const language = context.getNodeParameter('language', itemIndex) as number;

	const response = await context.helpers.httpRequestWithAuthentication.call(context, 'tmdbApi', {
		headers: {
			Accept: 'application/json',
		},
		method: 'GET',
		url: `https://api.themoviedb.org/3/company/${companyId}?language=${language}`,
	});
	return {
		...response,
		logo_urls: getLogoUrls(response.logo_path),
	};
}
