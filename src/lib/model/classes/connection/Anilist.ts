import Connection, { type WatchStatus } from './connection';

class Anilist extends Connection {
  query = `
    mutation (
$id: Int,
$mediaId: Int,
$status: MediaListStatus,
$score: Float,
$progress: Int,
$progressVolumes: Int,
$repeat: Int,
$private: Boolean,
$notes: String,
$customLists: [String],
$hiddenFromStatusLists: Boolean,
$advancedScores: [Float],
$startedAt: FuzzyDateInput,
$completedAt: FuzzyDateInput
) {
    SaveMediaListEntry(
        id: $id,
        mediaId: $mediaId,
        status: $status,
        score: $score,
        progress: $progress,
        progressVolumes: $progressVolumes,
        repeat: $repeat,
        private: $private,
        notes: $notes,
        customLists: $customLists,
        hiddenFromStatusLists: $hiddenFromStatusLists,
        advancedScores: $advancedScores,
        startedAt: $startedAt,
        completedAt: $completedAt) {
        id
        mediaId
        status
        score
        progress
        progressVolumes
        repeat
        priority
        private
        hiddenFromStatusLists
        customLists
        notes
        updatedAt
        startedAt {
            year
            month
            day
        }
        completedAt {
            year
            month
            day
        }
        user {
            id
            name
        }
        media {
            id
            title {
                userPreferred
            }
            coverImage {
                large
            }
            type
            format
            status
            episodes
            volumes
            chapters
            averageScore
            popularity
            isAdult
            startDate {
                year
            }
            mediaListEntry {
                status
                progress
            }
        }
    }
}`;

  constructor(id: string) {
    super(id, 'Anilist');
  }

  async updateStatus(animeId: string, status: WatchStatus): Promise<void> {
    const date = new Date(),
      parameters =
        status === 'completed'
          ? {
              mediaId: animeId,
              status: status,
              completedAt: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
              }
            }
          : {
              mediaId: animeId,
              status: status
            };

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: this.query,
        variables: parameters
      })
    });

    console.debug(response);
    console.debug(await response.json());
  }

  async updateProgress(animeId: string, progress: number): Promise<void> {
    const date = new Date(),
      parameters =
        progress === 0
          ? {
              mediaId: animeId,
              progress: progress,
              startedAt: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate()
              }
            }
          : {
              mediaId: animeId,
              progress: progress
            };

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query: this.query,
        variables: parameters
      })
    });

    console.debug(response);
    console.debug(await response.json());
  }
}

export default Anilist;
