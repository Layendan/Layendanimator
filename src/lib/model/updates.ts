import { get, writable } from 'svelte/store';
import Semaphore from './classes/Semaphore';
import { fetchAnime } from './fetch';
import { settings } from './settings';
import { subscriptions, unwatchedSubscriptions } from './subscriptions';

export type Task = {
  id: string;
  title: string;
  value: number;
  max: number;
};

export const tasks = writable<Task[]>([]);

export const isUpdatingSubscriptions = writable(false);

const lowNumSemaphore = new Semaphore(5, 500);
const highNumSemaphore = new Semaphore(5, 2000);
export async function updateSubscriptions() {
  if (get(isUpdatingSubscriptions)) return;

  isUpdatingSubscriptions.set(true);
  const id = 'updateSubscriptions';

  const totalSubs = get(settings).checkCompletedUpdates
    ? [
        ...Object.values(get(unwatchedSubscriptions)),
        ...Object.values(get(subscriptions))
      ]
    : [
        ...Object.values(get(unwatchedSubscriptions)).filter(
          anime => anime.status !== 'Completed' && anime.status !== 'Cancelled'
        ),
        ...Object.values(get(subscriptions)).filter(
          anime => anime.status !== 'Completed' && anime.status !== 'Cancelled'
        )
      ];

  tasks.update(tasks => [
    ...tasks,
    { id, title: 'Fetching Subscriptions', value: 0, max: totalSubs.length }
  ]);

  try {
    await Promise.allSettled(
      totalSubs.map(anime => {
        return (
          totalSubs.length > 30 ? highNumSemaphore : lowNumSemaphore
        ).callFunction(async () => {
          try {
            await fetchAnime(anime.id, anime.source);
          } catch (e) {
            console.error(e);
          } finally {
            tasks.update(tasksList => {
              const task = tasksList.find(task => task.id === id);
              if (task) task.value++;
              return tasksList;
            });
          }
        }, `${anime.source.id}/${anime.id}`);
      })
    );
  } catch (e) {
    console.error(e);
  } finally {
    setTimeout(() => {
      tasks.update(tasks => tasks.filter(task => task.id !== id));
      isUpdatingSubscriptions.set(false);
    }, 500);
  }
}
