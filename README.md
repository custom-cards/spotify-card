[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs) [![spotify-card](https://img.shields.io/github/release/custom-cards/spotify-card.svg)](https://github.com/custom-cards/spotify-card) ![Maintenance](https://img.shields.io/maintenance/yes/2019.svg)

[![Buy me a coffee](https://img.shields.io/static/v1.svg?label=Buy%20me%20a%20coffee&message=🥨&color=black&logo=buy%20me%20a%20coffee&logoColor=white&labelColor=6f4e37)](https://www.buymeacoffee.com/fondberg)

## Home Assistant Spotify Lovelace Card
**DISCLAIMER**: *This project is a private open source project and doesn't have any connection with Spotify.*

Web component card which can be used as a Lovelace [Home Assistants](https://www.home-assistant.io/lovelace/]) card.

Forum thread: https://community.home-assistant.io/t/spotify-lovelace-card/103525

This card supports listing the users currently available devices and the users top playlists on [Spotify](https://www.spotify.com).
Choose an online media player and click on a playlist to play it on the device.
This component will query the current playback from the Spotify Web API and tries to reflect the current status wrt to device and playlist if something is playing.

The component uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api/).

![Screenshot](/spotify-card-highlight.png)

## See release information in github for release notes

### Requirements
This should now work in all newer major browsers. If it does not work for you please provide detailed reports in an issue ticket.

### Installation
Create a new app at [Spotify developer console](https://developer.spotify.com/my-applications/#!/applications)
or use the one created for the HA Spotify component (see below).
Make sure you edit the settings and adds the redirect URL for the tab the card has.

Example:  `https://<your public home assistant hostname>:8123/lovelace/media`.

For more information about how to create an app see [Home Assistant Spotify Component documentation](https://www.home-assistant.io/components/media_player.spotify/).

Add the resource in lovelace config:

##### HACS users:
Follow the HACS instructions when installing it.

##### Latest release using cdn:
```
  - type: module
    url: >-
      https://cdn.jsdelivr.net/gh/custom-cards/spotify-card@1.8/dist/spotify-card.umd.js
```

##### Add the card to lovelace config
Now add the card like this:
```
  cards:
    - type: 'custom:spotify-card'
      client_id: <YOUR CLIENT ID>
      limit: <optional number of playlists to retrieve (default 10)>
      device: <optional name of a device to pre-select>
      player: <optional use this player only, value should be the same name as the displayname of the player>
      featuredPlaylists: <optional show featured playlists instead of users playlists>
      dailyMixes: <optional show daily mixes, requires spotcast>
      height: <optional pixels height for the playlist element. If content is larger scrolling will be enabled>
      random_song: <optional boolean to start playlists from a random song>
      shuffle: <optional boolean to shuffle playlist following first song, combine with random_song for initial shuffle>
```

If you add the `device` setting, the card will select it by default and will not display the dropdown menu.

### General usage
This library can of course also be used on other websites or projects other than Home Assistant

### CONTRIBUTING
Please contribute and help.Before creating a large PR make sure to sync about it with me.

### Donate
If you like this and want to buy me a coffee

<a href="https://www.buymeacoffee.com/fondberg" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
### License
This library is licensed under Apache 2.0, see [LICENSE](./LICENSE)
