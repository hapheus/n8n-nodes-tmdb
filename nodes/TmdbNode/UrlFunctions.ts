function getUrls(filePath: string | null, sizes: string[]): Record<string, string> | null {
	if (filePath === null) {
		return null;
	}

	const baseUrl = 'https://image.tmdb.org/t/p/';
	const urls: Record<string, string> = {};
	sizes.forEach((size) => {
		urls[size] = `${baseUrl}${size}/${filePath}`;
	});
	return urls;
}

export function getPosterUrls(filePath: string | null): Record<string, string> | null {
	const posterSizes = ['original', 'w92', 'w154', 'w185', 'w342', 'w500', 'w780'];
	return getUrls(filePath, posterSizes);
}

export function getLogoUrls(filePath: string | null): Record<string, string> | null {
	const logoSizes = ['original', 'w45', 'w92', 'w154', 'w185', 'w300', 'w500'];
	return getUrls(filePath, logoSizes);
}

export function getBackdropUrls(filePath: string | null): Record<string, string> | null {
	const backdropSizes = ['original', 'w300', 'w780', 'w1280'];
	return getUrls(filePath, backdropSizes);
}

export function getProfileUrls(filePath: string | null): Record<string, string> | null {
	const profileSizes = ['original', 'w45', 'w185', 'h632'];
	return getUrls(filePath, profileSizes);
}

export function getStillUrls(filePath: string | null): Record<string, string> | null {
	const stillSizes = ['original', 'w92', 'w185', 'w300'];
	return getUrls(filePath, stillSizes);
}
