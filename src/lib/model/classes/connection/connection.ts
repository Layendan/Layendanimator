export type WatchStatus =
  | 'watching'
  | 'completed'
  | 'on-hold'
  | 'dropped'
  | 'plan-to-watch';

abstract class Connection {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  abstract updateStatus(animeId: string, status: WatchStatus): Promise<void>;

  abstract updateProgress(animeId: string, progress: number): Promise<void>;
}

export default Connection;
