## Home Assistant Spotify Lovelace Card
**DISCLAIMER**: *This project is a private open source project and doesn't have any connection with Spotify.*
 
Web component card which can be used as a Lovelace [Home Assistants](https://www.home-assistant.io/lovelace/]) card.

Forum thread: https://community.home-assistant.io/t/spotify-lovelace-card/103525

This card supports listing the users currently available devices and the users 10 top playlists on [Spotify](https://www.spotify.com). 
Choose an online media player and click on a playlist to play it on the device.
This component will query the current playback from the Spotify Web API and tries to reflect the current status wrt to device and playlist if something is playing. 

The component uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api/).

![Screenshot](/spotify-card-highlight.png)

### Requirements
This should now work in all newer major browsers. If it does't work for you please provide detailed reports in an issue ticket.

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
      https://cdn.jsdelivr.net/gh/custom-cards/spotify-card@1.2/dist/spotify-card.umd.js
```

##### Add the card to lovelace config
Now add the card like this:
```
  cards:
    - type: 'custom:spotify-card'
      client_id: <YOUR CLIENT ID>
```

### Improvements to come thru PR or with patience
  - Request a refresh token so the user doesn't have to authenticate every 3600 secs
  - Add support to initiate playback on chrome cast media players (tips and code wanted!)

### General usage
This library can of course also be used on other websites or projects other than Home Assistant

### CONTRIBUTING
Please contribute and help.Before creating a large PR make sure to sync about it with me.

### License
This library is licensed under Apache 2.0, see [LICENSE](./LICENSE)
