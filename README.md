[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs) [![spotify-card](https://img.shields.io/github/release/custom-cards/spotify-card.svg)](https://github.com/custom-cards/spotify-card)

![Build](https://github.com/FL550/spotify_card_new/workflows/Build/badge.svg)

## Home Assistant Spotify Lovelace Card

**DISCLAIMER**: *This project is a private open source project and doesn't have any connection with Spotify.*

This is a Web component card which can be used as a Lovelace [Home Assistant](https://www.home-assistant.io/lovelace/]) card.

This card supports listing the users currently available devices and the users playlists on [Spotify](https://www.spotify.com). Choose an online media player and click on a playlist to play it on the device. This component will query the current playback from the [Spotify Integration](https://www.home-assistant.io/integrations/spotify/) and tries to reflect the currently playing playlist.

The component uses the [Spotify Integration](https://www.home-assistant.io/integrations/spotify/) and [spotcast](https://github.com/fondberg/spotcast) and both of them have to be installed for the card to function properly.

The forum thread can be found [here](https://community.home-assistant.io/t/spotify-lovelace-card/103525)

![Screenshot](/spotify-card-highlight.png)

## See release information on Github for release notes

### Requirements

[Spotify Integration](https://www.home-assistant.io/integrations/spotify/) and [spotcast](https://github.com/fondberg/spotcast) have to be installed.
This card should work in all newer major browsers. If it does not work for you please provide detailed reports in an issue ticket.

### Installation

#### HACS users

Follow the HACS instructions when installing it.

#### Manually

Copy the content of the `dist` folder to `www/community/spotify_card/` in your Home Assistant configuration directory. Create these folders if they do not exist.

Then you have to add spotify card to your resources. This can be done via `Settings -> Lovelace Dashboards -> Resources`. Add this path:

```
  /local/community/spotify-card/spotify-card.js
```

If you do not have the `Resources` tab available, you have to enable the advanced mode for Lovelace. To do so, click on your username on your Home Assistant dashboard and enanble the setting.
<!-- TODO CDN
##### Latest release using cdn:
```
  - type: module
    url: >-
      https://cdn.jsdelivr.net/gh/custom-cards/spotify-card@1.25.0/dist/spotify-card.umd.js
```-->

### Usage

Add the card via lovelace to your dashboard. All of the settings can be configured via the visual editor.

If you are not using the visual configuration of Lovelace you can add the card like this:

```
  cards:
    - type: 'custom:spotify-card'
      height: <optional pixels height for the playlist element. If content is larger scrolling will be enabled>
      limit: <optional number of playlists to retrieve (default 10)>
      device: <optional name of a device to pre-select>
      playlist_type: <optional featured|discover-weekly> Change type of playlists shown. Default are your normal playlists.
      always_play_random_song: <optional true> Set to start playlists from a random song.
      country_code: <optional country code to show featured playlist relevent to a particular country. https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 >
      hide_warning: <optional true> Hide warnings if they are displayed.
      name: <optional name> Custom title. Leave empty to hide.
      display_style: <optional Grid> Change default display style.
      grid_cover_size: <optional number> Change the cover size in Grid-view.
      grid_center_covers: <optional boolean> Center the covers in Grid-view.
```

### General usage

This library can of course also be used on other websites or projects other than Home Assistant

### CONTRIBUTING

Please contribute and help. Before creating a large PR make sure to sync about it with me.

### Donate

If you like this and want to buy me a coffee

[![buymeacoffe](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/fondberg)

### License

This library is licensed under Apache 2.0, see [LICENSE](./LICENSE)
