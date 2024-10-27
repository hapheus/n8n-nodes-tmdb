# n8n-nodes-tmdb

This project integrates [TMDb (The Movie Database)](https://www.themoviedb.org/) into [n8n](https://n8n.io/) workflows, allowing users to access comprehensive movie data and manage their workflows seamlessly.

## Table of Contents
- [Work in Progress](#work-in-progress)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Work in Progress
Currently, only querying details for Movie, Person, Collection, TV, and Company is supported. List and search functionalities will be implemented later. Please star or follow the repository to stay updated on the latest changes.

## Features
- Retrieve movie details, cast, and crew information.
- Search movies by title, genre, and more.
- Get recommendations based on movies or TV shows.
- Access TV show details and seasons.

## Prerequisites
- [n8n](https://n8n.io/) installed (Node.js required)
- TMDb API Key (available through TMDb account)

## Installation
1. Open n8n and navigate to **Settings** > **Community Nodes**.
2. Search for `n8n-nodes-tmdb` and install the package directly.
3. Restart n8n to apply the changes.

## Usage
- Configure the TMDb credentials in n8n using your API key.
- Use the provided nodes in your n8n workflows to integrate TMDb data retrieval seamlessly.

## Contributing
1. Fork the repository.
2. Create a new feature branch.
3. Submit a pull request with a detailed description.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Acknowledgments
- Thanks to [TMDb](https://www.themoviedb.org/) for providing an extensive movie database.
- Inspired by the n8n community and its commitment to automation.
