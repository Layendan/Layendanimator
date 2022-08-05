export default `query ($perPage: Int, $season: MediaSeason, $year: Int) {
	airing: Page(perPage: $perPage) {
		airingSchedules(sort: TIME, notYetAired: true) {
			airingAt
			episode
			media {
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
		}
	}
	recommended: Page(perPage: $perPage) {
		recommendations(onList: true) {
			mediaRecommendation {
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
		}
	}
	seasonal: Page(perPage: $perPage) {
		media(
			season: $season
			seasonYear: $year
			sort: [POPULARITY_DESC]
			format_in: [TV, TV_SHORT, MOVIE, SPECIAL, OVA]
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
	}
	trending: Page(perPage: $perPage) {
		media(sort: TRENDING_DESC, format_in: [TV, TV_SHORT, MOVIE, SPECIAL, OVA]) {
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
	}
}
`;
