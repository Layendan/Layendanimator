export default `query ($id: Int) {
	Media(
		id: $id
		type: ANIME
		format_in: [TV, TV_SHORT, MOVIE, ONA, OVA, SPECIAL]
	) {
		id
		title {
			romaji
			english
			native
		}
		episodes
		coverImage {
			large
		}
		bannerImage
		siteUrl
		description(asHtml: false)
		streamingEpisodes {
			title
			thumbnail
			url
			site
		}
		averageScore
		meanScore
		tags {
			name
		}
		genres
		isAdult
	}
}`;
