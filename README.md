## Home Assistant Spotify Lovelace Card
**DISCLAIMER**: *This project is a private open source project and doesn't have any connection with Spotify.*
 
Web component card which can be used as a Lovelace [Home Assistants](https://www.home-assistant.io/lovelace/]) card.

This card supports listing the users currently available devices and the users 10 top playlists on [Spotify](https://www.spotify.com). 
Choose an online media player and click on a playlist to play it on the device.
This component will query the current playback from the Spotify Web API and tries to reflect the current status wrt to device and playlist if something is playing. 

The component uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api/).

![Screenshot](/spotify-card-highlight.png)

### Requirements
As I wanted to create a vanilla javascript [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) the code is not transpiled and might not work in your browser.
If this is the case either create a fix and post a PR or upgrade to a more modern browser.

### Installation
Create a new app at [https://developer.spotify.com/my-applications/#!/applications](Spotify developer console) 
or use the one created for the HA Spotify component (see below).
Make sure you edit the settings and adds the redirect URL for the tab the card is one. 

Example:  `https://<your public home assistant hostname>:8123/lovelace/media`.

For more information about how to create an app see [Home Assistant Spotify Component documentation](https://www.home-assistant.io/components/media_player.spotify/).

Add the resource in lovelace config:
##### Master builds:
```
  - type: module
    url: >-
      https://cdn.jsdelivr.net/gh/fondberg/spotify-card@master/src/spotify-card.js 
```

##### Specific release:
```
  - type: module
    url: >-
      https://cdn.jsdelivr.net/gh/fondberg/spotify-card@1.1/src/spotify-card.js
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
  - Add support for chrome cast media players

### General usage
This library can of course also be used on other websites or projects other than Home Assistant

### CONTRIBUTING
Please contribute and help.Before creating a large PR make sure to sync about it with me.

