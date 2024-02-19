import { goto, invalidate, invalidateAll } from '$app/navigation';
import { get, writable } from 'svelte/store';
import type { MediaPlayerElement } from 'vidstack/elements';
import { animeCache, clearCache } from './cache';
import type { Anime, Episode } from './classes/Anime';
import { downloading, downloads } from './downloads';
import { fetchAnime } from './fetch';
import { notifications } from './notifications';
import { settings } from './settings';
import {
  checkUpdate,
  defaultProviders,
  encodeAnimeLink,
  encodeEpisodeLink,
  providers,
  source,
  type Provider
} from './source';
import { subscriptions, unwatchedSubscriptions } from './subscriptions';
import { encodeName, type Theme } from './theme';
import { watching } from './watch';
import { getOS } from './info';

export const currentContextMenu = writable<string | undefined>(undefined);

/*
label	string			Displayed test of the menu item.	
disabled	boolean	optional	false	Whether the menu item is disabled.	
event	string	optional		Event name to be emitted when the menu item is clicked.	You can pass a function to be executed instead of an event name.
payload	string	optional		Payload to be passed to the event.	You can pass any type of data.
checked	boolean	optional		Whether the menu item is checked.	
subitems	MenuItem[]	optional	[]	List of sub menu items to be displayed.	
shortcut	string	optional		Keyboard shortcut displayed on the right.	
icon	MenuItemIcon	optional		Icon to be displayed on the left.	
is_separator	boolean	optional	false	Whether the menu item is a separator.	
*/
export type MenuItem = {
  label: string;
  disabled?: boolean;
  event?: string | (() => void | Promise<void>);
  payload?: string;
  checked?: boolean;
  subitems?: MenuItem[];
  shortcut?: string;
  icon?: MenuItemIcon;
  is_separator?: boolean;
};

/*
path	string			Absolute path to the icon file.	You can use assetToPath to convert a relative path to an absolute path.
width	number	optional	16	Width of the icon.	
height	number	optional	16	Height of the icon.	
*/
export type MenuItemIcon = {
  path: string;
  width?: number;
  height?: number;
};

export function createAnimeCardContextMenu(anime: Anime, isDownload: boolean) {
  const items: MenuItem[] = [
    {
      label: 'Watch',
      event: () => {
        goto(
          isDownload
            ? `/library/downloads/${anime.source.id}/${anime.id}?autoplay=true`
            : `/${anime.source.id}/${anime.id}?autoplay=true`
        );
      }
    },
    {
      label: 'Anime Details',
      event: () => {
        goto(
          isDownload
            ? `/library/downloads/${anime.source.id}/${anime.id}`
            : `/${anime.source.id}/${anime.id}`
        );
      }
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Open in Browser',
      event: async () => {
        const { open } = await import('@tauri-apps/api/shell');
        open(encodeAnimeLink(anime));
      },
      disabled: !get(providers)[anime.source.id]?.shareLinks?.anime
    },
    {
      label: 'Share',
      event: () => {
        navigator.share({
          title: anime.title.english ?? anime.title.romaji,
          text: `Watch ${anime.title.english ?? anime.title.romaji} on ${
            anime.source.name
          }`,
          url: encodeAnimeLink(anime)
        });
      },
      disabled: !get(providers)[anime.source.id]?.shareLinks?.anime
    },
    {
      label: '',
      is_separator: true
    }
  ];

  if (get(subscriptions)[`${anime.source.id}/${anime.id}`]) {
    items.push({
      label: 'Unsubscribe',
      event: () => {
        subscriptions.remove(anime);
      }
    });
  } else if (get(unwatchedSubscriptions)[`${anime.source.id}/${anime.id}`]) {
    items.push(
      {
        label: 'Unsubscribe',
        event: () => {
          unwatchedSubscriptions.remove(anime);
        }
      },
      {
        label: 'Clear Updates',
        event: () => {
          subscriptions.add(anime);
          unwatchedSubscriptions.remove(anime);
        }
      }
    );
  } else {
    items.push({
      label: 'Subscribe',
      event: async () => {
        const res =
          animeCache.get(`${anime.source.id}/${anime.id}`) ??
          (await fetchAnime(anime.id, anime.source));
        if (!res) {
          notifications.addNotification({
            title: 'Error',
            message: 'Could not find anime',
            type: 'error'
          });
          throw new Error('Could not find anime');
        }

        subscriptions.add(res);
      }
    });
  }

  items.push({
    label: '',
    is_separator: true
  });
  if (get(watching)[`${anime.source.id}/${anime.id}`]) {
    items.push({
      label: 'Clear Watch History',
      event: () => {
        watching.remove(anime);
      }
    });
  }
  items.push({
    label: 'Mark All as Watched',
    event: async () => {
      const res =
        animeCache.get(`${anime.source.id}/${anime.id}`) ??
        (await fetchAnime(anime.id, anime.source));
      if (!res) {
        notifications.addNotification({
          title: 'Error',
          message: 'Could not find anime',
          type: 'error'
        });
        throw new Error('Could not find anime');
      }

      watching.watchAll(res, res.episodes.toReversed());
      if (get(unwatchedSubscriptions)[`${anime.source.id}/${anime.id}`]) {
        unwatchedSubscriptions.remove(anime);
        subscriptions.add(anime);
      }
    }
  });

  items.push(
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Downloads',
      subitems: [
        {
          label: 'Download Episodes',
          event: async () => {
            const res =
              animeCache.get(`${anime.source.id}/${anime.id}`) ??
              (await fetchAnime(anime.id, anime.source));
            if (!res) {
              notifications.addNotification({
                title: 'Error',
                message: 'Could not find anime',
                type: 'error'
              });
              throw new Error('Could not find anime');
            }

            notifications.addNotification({
              title: 'Downloading episodes...',
              message: `Downloading episodes for ${
                res.title.english ?? res.title.romaji
              }`,
              type: 'info'
            });

            res.episodes.forEach(episode =>
              downloading.add(episode.id, res, '1080p', episode.number)
            );
          }
        },
        {
          label: 'Remove Downloads',
          event: async () => {
            const { confirm } = await import('@tauri-apps/api/dialog');
            const confirmed = await confirm(
              'This action cannot be reverted. Are you sure?',
              {
                title: 'Delete All Downloaded Episodes',
                type: 'warning',
                okLabel: "Yes, I'm Sure"
              }
            );

            if (confirmed)
              Object.keys(
                get(downloads)[`${anime.source.id}/${anime.id}`].episodes
              ).forEach(episode => downloads.remove(anime, episode));
          }
        }
      ]
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Services',
      subitems: [
        {
          label: 'Check for Updates',
          event: async () => {
            try {
              const res = await fetchAnime(anime.id, anime.source);
              if (!res) throw new Error('Could not find anime');

              invalidate(`${anime.source.id}:${anime.id}`);

              if (get(watching)[`${anime.source.id}/${anime.id}`])
                watching.updateAnime(res);

              notifications.addNotification({
                title: 'Updated',
                message: `Anime info updated for ${
                  res.title.english ?? res.title.romaji
                }`
              });
            } catch (e) {
              console.error(e);
              notifications.addNotification({
                title: 'Error',
                message: 'Could not update anime info',
                type: 'error'
              });
            }
          }
        }
      ]
    }
  );

  return items;
}

export function createEpisodeContextMenu(
  anime: Anime,
  episode: Episode,
  isDownload: boolean,
  isPlaying: boolean
) {
  const items: MenuItem[] = [
    {
      label: 'Watch',
      event: () => {
        goto(
          isDownload
            ? `/library/downloads/${anime.source.id}/${anime.id}/${episode.id}`
            : `/${anime.source.id}/${anime.id}/${episode.id}`
        );
      }
    },
    {
      label: 'Anime Details',
      event: () => {
        goto(
          isDownload
            ? `/library/downloads/${anime.source.id}/${anime.id}`
            : `/${anime.source.id}/${anime.id}`
        );
      }
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Open in Browser',
      event: async () => {
        const { open } = await import('@tauri-apps/api/shell');
        open(encodeEpisodeLink(anime, episode));
      },
      disabled: !get(providers)[anime.source.id]?.shareLinks?.episode
    },
    {
      label: 'Share',
      event: () => {
        navigator.share({
          title: `${anime.title.english ?? anime.title.romaji} - ${
            episode.title ?? `Episode ${episode.number}`
          }`,
          text: `Watch ${anime.title.english ?? anime.title.romaji} - ${
            episode.title ?? `Episode ${episode.number}`
          } on ${anime.source.name}`,
          url: encodeEpisodeLink(anime, episode)
        });
      },
      disabled: !get(providers)[anime.source.id]?.shareLinks?.episode
    },
    {
      label: '',
      is_separator: true
    }
  ];

  if (
    get(watching)[`${anime.source.id}/${anime.id}`]?.watchedEpisodes?.[
      episode.id
    ]
  ) {
    items.push({
      label: 'Mark as Unwatched',
      event: () => {
        watching.removeEpisode(anime, episode.id);
      }
    });
  } else {
    items.push({
      label: 'Mark as Watched',
      event: () => {
        watching.watch(anime, { episode, time: 0, percentage: 1 });
        if (get(unwatchedSubscriptions)[`${anime.source.id}/${anime.id}`]) {
          get(unwatchedSubscriptions)[
            `${anime.source.id}/${anime.id}`
          ].newEpisodes.delete(episode.id);
          if (
            get(unwatchedSubscriptions)[`${anime.source.id}/${anime.id}`]
              .newEpisodes.size === 0
          ) {
            unwatchedSubscriptions.remove(anime);
            subscriptions.add(anime);
          }
          // Update the store so that the component re-renders
          else unwatchedSubscriptions.update(subscriptions => subscriptions);
        }
      }
    });
  }

  if (!isPlaying) {
    items.push({
      label: '',
      is_separator: true
    });

    if (
      get(downloads)[`${anime.source.id}/${anime.id}`]?.episodes?.[episode.id]
    ) {
      items.push({
        label: 'Remove Download',
        event: () => {
          downloads.remove(anime, episode.id);
        }
      });
    } else if (
      get(downloading)[`${anime.source.id}/${anime.id}/${episode.id}`]
    ) {
      items.push({
        label: 'Cancel Download',
        event: () => {
          downloading.cancel(`${anime.source.id}/${anime.id}/${episode.id}`);
        }
      });
    } else {
      items.push({
        label: 'Download Episode',
        event: () => {
          downloading.add(episode.id, anime, '1080p', episode.number);
        }
      });
    }
  }

  return items;
}

export async function createPlayerContextMenu(
  anime: Anime,
  episode: Episode,
  player: MediaPlayerElement,
  airplay: boolean,
  requestNextEpisode: () => void
) {
  const items: MenuItem[] = [
    {
      label: player.paused ? 'Play' : 'Pause',
      event: () => {
        if (player.paused) player.play();
        else player.pause();
      }
    },
    {
      label: 'Mute',
      event: () => {
        player.muted = !player.muted;
      },
      checked: player.muted
    },
    {
      label: 'Loop',
      event: () => {
        player.loop = !player.loop;
      },
      checked: player.loop
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Anime Details',
      event: () => {
        goto(`/${anime.source.id}/${anime.id}`);
      }
    },
    {
      label: 'Play Next Episode',
      event: requestNextEpisode
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Open in Browser',
      event: async () => {
        const { open } = await import('@tauri-apps/api/shell');
        open(encodeEpisodeLink(anime, episode));
      },
      disabled: !get(providers)[anime.source.id]?.shareLinks?.episode
    },
    {
      label: 'Share',
      event: () => {
        navigator.share({
          title: `${anime.title.english ?? anime.title.romaji} - ${
            episode.title ?? `Episode ${episode.number}`
          }`,
          text: `Watch ${anime.title.english ?? anime.title.romaji} - ${
            episode.title ?? `Episode ${episode.number}`
          } on ${anime.source.name}`,
          url: encodeEpisodeLink(anime, episode)
        });
      },
      disabled: !get(providers)[anime.source.id]?.shareLinks?.episode
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Copy Video URL',
      event: async () => {
        const { writeText } = await import('@tauri-apps/api/clipboard');
        console.log(player.state.source);
        // @ts-expect-error - src typing is not defined
        writeText(player.state.source.src.toString());
      }
    },
    {
      label: 'Copy Video Frame',
      event: async () => {
        try {
          if (
            !player.provider ||
            player.provider.type === 'audio' ||
            player.provider.type === 'vimeo' ||
            player.provider.type === 'youtube' ||
            player.provider.type === 'google-cast'
          )
            throw new Error(
              'Cannot copy frame of audio or vimeo/youtube videos'
            );

          const canvas = document.createElement('canvas');
          canvas.width = player.provider?.video.videoWidth ?? 0;
          canvas.height = player.provider?.video.videoHeight ?? 0;
          if (!canvas.width || !canvas.height)
            throw new Error('Could not get canvas width or height');
          const canvasContext = canvas.getContext('2d');
          const video = player.provider?.video;
          if (!canvasContext || !video)
            throw new Error('Could not get canvas context or video element');
          canvasContext.drawImage(video, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          // Apparently the clipboard api doesn't support data urls with padding
          const data =
            (await getOS()) === 'Darwin'
              ? dataUrl.split(',')[1].replace(/=/g, '')
              : dataUrl.split(',')[1];
          const { writeImage } = await import('tauri-plugin-clipboard-api');
          await writeImage(data);
          //   notifications.addNotification({
          //     title: 'Copied',
          //     message: 'Copied video frame to clipboard'
          //   });
        } catch (e) {
          console.error(e);
          //   notifications.addNotification({
          //     title: 'Error',
          //     message: `Could not copy video frame - ${e}`,
          //     type: 'error'
          //   });
        }
      }
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'AirPlay',
      event: () => {
        player.requestAirPlay();
      },
      disabled: !player.state.canAirPlay
    },
    {
      label: 'Chromecast',
      event: () => {
        player.requestGoogleCast();
      },
      disabled: !player.state.canGoogleCast
    }
  ];

  return items;
}

export function createSourceContextMenu(provider: Provider) {
  const items: MenuItem[] = [
    {
      label: 'Set as Source',
      event: () => {
        source.set(provider);
        goto(`/${provider.id}/`);
      },
      disabled: provider.id === get(source).id
    },
    {
      label: 'Edit Source',
      event: async () => {
        if (window.location.pathname != '/settings') await goto('/settings');

        const element = document.getElementById(
          `${encodeName(provider.id)}-info`
        );
        if (!element) return;

        element.click();
        element.scrollTo({ behavior: 'smooth' });
      }
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Export Source',
      event: async () => {
        try {
          const [{ save }, { downloadDir, join }, { writeTextFile }] =
            await Promise.all([
              import('@tauri-apps/api/dialog'),
              import('@tauri-apps/api/path'),
              import('@tauri-apps/api/fs')
            ]);

          const filePath = await save({
            title: 'Export Source',
            filters: [{ name: 'JSON', extensions: ['json'] }],
            defaultPath: await join(await downloadDir(), provider.name)
          });

          if (!filePath) return;

          await writeTextFile(filePath, JSON.stringify(provider, null, 2));

          notifications.addNotification({
            title: 'Export Successful',
            message: `Source exported to ${filePath}`,
            type: 'success'
          });
        } catch (e) {
          console.error(e);
          notifications.addNotification({
            title: 'Export Failed',
            message: e as string,
            type: 'error'
          });
        }
      }
    },
    {
      label: 'Delete Source',
      event: async () => {
        const { confirm } = await import('@tauri-apps/api/dialog');
        const confirmed = await confirm(
          'This action cannot be reverted. Are you sure?',
          {
            title: 'Delete Source',
            type: 'warning',
            okLabel: "Yes, I'm Sure"
          }
        );
        if (confirmed) {
          providers.remove(provider);
          notifications.addNotification({
            title: 'Success',
            message: 'Source deleted successfully',
            type: 'success'
          });
        }
      },
      disabled: !!defaultProviders[provider.id]
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Services',
      subitems: [
        {
          label: 'Check for Updates',
          event: () => checkUpdate(provider),
          disabled: !provider.updateUrl
        }
      ]
    }
  ];

  return items;
}

export function createThemeContextMenu(
  theme: Theme,
  element: HTMLElement,
  defaultTheme: boolean
) {
  const items: MenuItem[] = [
    {
      label: 'Set Theme',
      event: () => {
        element?.click();
      },
      disabled: theme.name === get(settings).theme.name
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Export Theme',
      event: async () => {
        try {
          const [{ save }, { downloadDir, join }, { writeTextFile }] =
            await Promise.all([
              import('@tauri-apps/api/dialog'),
              import('@tauri-apps/api/path'),
              import('@tauri-apps/api/fs')
            ]);

          const filePath = await save({
            title: 'Export Theme',
            filters: [{ name: 'JSON', extensions: ['json'] }],
            defaultPath: await join(await downloadDir(), theme.name)
          });

          if (!filePath) return;

          await writeTextFile(filePath, JSON.stringify(theme, null, 2));

          notifications.addNotification({
            title: 'Export Successful',
            message: `Theme exported to ${filePath}`,
            type: 'success'
          });
        } catch (e) {
          console.error(e);
          notifications.addNotification({
            title: 'Export Failed',
            message: e as string,
            type: 'error'
          });
        }
      },
      disabled: defaultTheme
    },
    {
      label: 'Delete Theme',
      event: async () => {
        const { confirm } = await import('@tauri-apps/api/dialog');
        const confirmed = await confirm(
          'This action cannot be reverted. Are you sure?',
          {
            title: 'Delete Theme',
            type: 'warning',
            okLabel: "Yes, I'm Sure"
          }
        );
        if (confirmed) {
          settings.update(s => {
            delete s.themes[theme.name];
            if (s.theme.name === theme.name) {
              s.theme = s.themes.system;
              document
                .querySelectorAll(`head > style#${encodeName(theme.name)}`)
                ?.forEach(style => style.remove());
            }
            return s;
          });
        }
      },
      disabled: defaultTheme
    }
  ];

  return items;
}

export async function createDefaultContextMenu() {
  const items: MenuItem[] = [
    {
      label: 'Back',
      event: () => {
        window.history.back();
      }
    },
    {
      label: 'Forward',
      event: () => {
        window.history.forward();
      }
    },
    {
      label: 'Reload',
      event: () => {
        clearCache();
        invalidateAll();
      }
    },
    {
      label: '',
      is_separator: true
    },
    {
      label: 'Home',
      event: () => {
        goto(`/${get(source).id}`);
      }
    },
    {
      label: 'Library',
      event: () => {
        goto('/library');
      }
    },
    {
      label: 'Settings',
      event: () => {
        goto('/settings');
      }
    }
  ];

  if (Object.keys(get(providers)).length > 1)
    items.push(
      {
        label: '',
        is_separator: true
      },
      {
        label: 'Sources',
        subitems: Object.values(get(providers)).map(provider => {
          return {
            label: provider.name,
            event: () => {
              source.set(provider);
              goto(`/${provider.id}`);
            },
            disabled: provider.id === get(source).id
          };
        })
      }
    );

  const { appWindow } = await import('@tauri-apps/api/window');
  if (await appWindow.isFullscreen())
    items.unshift(
      {
        label: 'Exit Fullscreen',
        event: () => appWindow.setFullscreen(false)
      },
      {
        label: '',
        is_separator: true
      }
    );

  return items;
}
