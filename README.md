# ![Layendanimator](Misc/Media/LayenanimatorBanner.png)

<p align="center">
  <a href="https://github.com/Layendan/Layendanimator/actions/workflows/publish.yml">
    <img src="https://github.com/Layendan/Layendanimator/actions/workflows/publish.yml/badge.svg" alt="Build and Publish">
  </a>
  <a href="https://github.com/Layendan/Layendanimator/releases">
    <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/Layendan/Layendanimator/total?label=Downloads">
  </a>
  <a href="https://discord.gg/dzTVzeW">
    <img alt="Discord" src="https://img.shields.io/discord/545740643247456267?logo=discord&label=Discord&color=%235865F2">
  </a>
  <a href="https://www.codefactor.io/repository/github/layendan/layendanimator">
    <img alt="CodeFactor Grade" src="https://img.shields.io/codefactor/grade/github/Layendan/Layendanimator?label=Codefactor">
  </a>
  <a href="https://github.com/Layendan/Layendanimator/blob/master/LICENSE.md">
    <img alt="GitHub License" src="https://img.shields.io/github/license/Layendan/Layendanimator?label=License">
  </a>
</p>

A simple yet elegant way of waching anime on your favorite anime websites.
Layendanimator is a free and open source anime watching app for Desktop (Windows and MacOS), using [Sveltekit](https://github.com/sveltejs/kit) and [Tauri](https://github.com/tauri-apps/tauri).

## Table of Contents

- [Layendanimator](/#)
  - [Table of Contents](#table-of-contents)
  - [Download & Install](#download--install)
    - [Windows](#windows)
    - [MacOS](#macos)
    - [Linux](#linux)
  - [Contributing](#contributing)
  - [Features](#features)
  - [Picture in Picture Playback](#picture-in-picture-playback)
  - [Notifications & Subscription](#notifications--subscription)
  - [Download Episodes](#download-episodes)
  - [Google Cast / Airplay](#google-cast--airplay)
  - [Discord Rich Presence](#discord-rich-presence)
  - [Screenshots](#screenshots)
    - [Dark Theme](#dark-theme)
    - [Light Theme](#light-theme)
    - [Custom Themes](#custom-themes)
    - [Main Page](#main-page)
    - [Anime Page](#anime-page)
    - [Player](#player)
    - [Search](#search)
    - [Library](#library)
    - [Settings](#settings)
  - [Contributions](#contributions)
  - [License](#license)

## Download & Install

Download the latest version of Layendanimator from the [releases page](https://github.com/Layendan/Layendanimator/releases/latest).

### Windows

Download `Layendanimator_<version>_x64-setup.exe` then run it.

_Note: The msi install method will be depracted in the future, hence not recommended to install the application._

Works for Windows 10 and above.

### MacOS

Download `Layendanimator_<version>_x64.dmg` then open it. Then, drag the application to your `Applications` folder.

If the application does not want to open, then navigate to your Applications folder, right click on the application, and click open. Once you do that, you will be able to open the application normally.

For Silicon _(M1/M2)_ based Macs, arm64 versions of the app will be available in the future if I move away from ffmpeg for downloading and github will make it easier to compile arm64 builds.

### Linux

**!IMPORTANT: Due to running into problems with the Linux build, I will not be releasing a Linux build for now. I might release a Linux build in the future if the issues are fixed, but I doubt it.**

Download `Layendanimator_<version>_amd64.AppImage` then run it.

If using a Debian based distro, download `Layendanimator_<version>_amd64.deb` then run it.

_Note: Linux is not tested and might not work, if you have problems using the app, please [create an issue](https://github.com/Layendan/Layendanimator/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=) on github._

## Contributing

- [Set up Tauri](https://tauri.app/v1/guides/getting-started/prerequisites)

(Will add more on how to contribute later)

## Features

- [x] Ads Free and no logins
- [x] Super-duper clean UIs + Dark Mode
- [x] Get notifications when new episodes come out
- [x] Custom video playback interface
- [x] Picture in Picture playback
- [ ] Chromecast/Google Cast integration
- [x] Playback History & Auto Resumes
- [ ] Support Custom Sources (WIP)
- [x] Discord Rich Presence integration
- [x] Download & play episodes offline
- [ ] Third party anime
- [ ] Custom anime lists, e.g. favorites and to-watch list

## Picture in Picture Playback

Watch anime in a small window while doing other things on your computer.

To use Picture in Picture playback, click on the Picture in Picture button at the bottom right on the video player.

## Notifications & Subscription

Automatically receive notifications when new episodes of animes you subscribed to come out.

_Note: Notifications will only be sent if the app is open, it will not notify you if the app is closed._

## Download Episodes

Download episodes to watch offline.

To download an episode, click on the download button at the bottom right of an episode card.

Downloaded episodes will automatically be used when watching anime online. You can also find your downloaded episodes in the downloads section in the Library tab.

You can view your download folder in the settings tab.

## Google Cast / Airplay

WIP

## Discord Rich Presence

See what your friends are watching and what you are watching on Discord. You can turn off Rich Presence in the settings tab.

![Main Page RPC](Misc/Media/discord_rpc3.png)

![Profile RPC](Misc/Media/discord_rpc.png)

![Activity RPC](Misc/Media/discord_rpc2.png)

_Note: Rich Presence will only display your currently watching anime if you are using the online anime version (it will not work if you watch through library tab → downloads section)._

## Screenshots

### Themes

#### Dark Theme

![Main Page](Misc/Media/main_page.png)

#### Light Theme

![Main Page Light](Misc/Media/main_page_light.png)

#### Custom Themes

![Main Page Custom](Misc/Media/main_page_custom.png)

![Main Page Custom 2](Misc/Media/main_page_custom_2.png)

![Main Page Custom 3](Misc/Media/main_page_custom_3.png)

### Main Page

![Main Page](Misc/Media/main_page_custom.png)

![Main Page 2](Misc/Media/main_page2.png)

### Anime Page

![Anime Page](Misc/Media/anime_page.png)

![Downloading](Misc/Media/downloading.png)

![Episodes](Misc/Media/episodes.png)

### Player

![Player](Misc/Media/player.png)

### Search

![Search All](Misc/Media/search_all.png)

![Search](Misc/Media/search.png)

### Library

![Library](Misc/Media/library.png)

### Settings

![Settings](Misc/Media/settings.png)

![Settings 2](Misc/Media/settings2.png)

![Settings 3](Misc/Media/settings3.png)

## Contributions

Thanks to the following people for contributing to this project.

<a href="https://github.com/Layendan/Layendanimator/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Layendan/Layendanimator&anon=1" />
</a>

<br />

I also want to thank the following projects and people for ideas and inspiration.

- [NineAnimator](https://github.com/SuperMarcus/NineAnimator)
- [Anilist](https://anilist.co/home)
- [Consumet API](https://github.com/consumet/api.consumet.org)
- [DaisyUI](https://daisyui.com/)

- [Vilian](https://github.com/Fractal-Tess)
- [NotErik](https://github.com/ErrorErrorError)
- [Inamaki](https://github.com/inumakieu)

As well as everyone in the NineAnimator, Consumet, Tauri, and Svelte discord servers for their feedback and helping me squash bugs.

Thank you to idiocymax for making the Layendanimator logo.

## License

This project uses the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
