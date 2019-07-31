## Home Assistant Spotify Lovelace Card
**DISCLAIMER**: *This project is a private open source project and doesn't have any connection with Spotify.*

Web component card which can be used as a Lovelace [Home Assistants](https://www.home-assistant.io/lovelace/]) card.

Forum thread: https://community.home-assistant.io/t/spotify-lovelace-card/103525

This card supports listing the users currently available devices and the users top playlists on [Spotify](https://www.spotify.com).
Choose an online media player and click on a playlist to play it on the device.
This component will query the current playback from the Spotify Web API and tries to reflect the current status wrt to device and playlist if something is playing.

The component uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api/).

***New from version 1.5***
The card can make use of [My Spotify Chromecast custom component](https://github.com/fondberg/spotcast) if it is installed, to initiate playback on idle chromecast devices. Please read that README for any limitations.
This release also adds a limit configuration property to make the number of playlists retrieved configurable.

***New from version 1.6***
Add device as a parameter (thanks Maxence Dunnewind @maxenced).

**New from version 1.8**
Removed need for custom sensor from [My Spotify Chromecast custom component](https://github.com/fondberg/spotcast). 
Fixed the reauth problem and added support for stopping pollimg Spotify APIs when the browser tab is hidden.
Added transfer playback support and fixed a lot of bugs (amongst others security issues with dependencies).

![Screenshot](/spotify-card-highlight.png)

### Requirements
This should now work in all newer major browsers. If it does not work for you please provide detailed reports in an issue ticket.

### Installation
Create a new app at [Spotify developer console](https://developer.spotify.com/my-applications/#!/applications)
or use the one created for the HA Spotify component (see below).
Make sure you edit the settings and adds the redirect URL for the tab the card has.

Example:  `https://<your public home assistant hostname>:8123/lovelace/media`.

For more information about how to create an app see [Home Assistant Spotify Component documentation](https://www.home-assistant.io/components/media_player.spotify/).

Add the resource in lovelace config:

##### Latest release:
```
  - type: module
    url: >-
      https://cdn.jsdelivr.net/gh/custom-cards/spotify-card@1.6/dist/spotify-card.umd.js
```

##### master version:
```
  - type: module
    url: >-
      https://cdn.jsdelivr.net/gh/custom-cards/spotify-card/dist/spotify-card.umd.js
```


##### Add the card to lovelace config
Now add the card like this:
```
  cards:
    - type: 'custom:spotify-card'
      client_id: <YOUR CLIENT ID>
      limit: <optional number of playlists to retrieve (default 10)>
      device: <optional name of a device to pre-select>
```

If you add the `device` setting, the card will select it by default and will not display the dropdown menu.

### Improvements to come thru PR or with patience
  - Request a refresh token so the user doesn't have to authenticate every 3600 secs
  - Add support to initiate playback on chrome cast media players (tips and code wanted!)

### General usage
This library can of course also be used on other websites or projects other than Home Assistant

### CONTRIBUTING
Please contribute and help.Before creating a large PR make sure to sync about it with me.

### Donate
If you like this and want to buy me a coffee

<a href="https://www.buymeacoffee.com/fondberg" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
### License
This library is licensed under Apache 2.0, see [LICENSE](./LICENSE)
