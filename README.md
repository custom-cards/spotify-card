## Home Assistant Spotify Lovelace Card
Web component card which can be used as a Lovelace [Home Assistants](https://www.home-assistant.io/lovelace/]) card.

This card supports listing the users currently available devices and the users 10 top playlists on [Spotify](https://www.spotify.com). 
Choose an online media player and click on a playlist to play it on the device.
This component will query the current playback 
The component used the [Spotify Web API](https://developer.spotify.com/documentation/web-api/).

![Screenshot](/spotify-card-highlight.png)

### Requirements
As I wanted to create a vanilla javascript []Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) the code is not transpiled and might not work in your browser.
If this is the case either create a fix and post a PR or upgrade to a more modern browser.

### Installation
Download `src/spotify-card.js` and copy it to `config/www/spotify-card.js`. 
Create a new app at [https://developer.spotify.com/my-applications/#!/applications](Spotify developer console) and set the redirect URL to XXX.
For more information about create an app see [https://www.home-assistant.io/components/media_player.spotify/](Home Assistant Spotify Component documentation).

Add the resource in lovelace config:
```
  - type: module
    url: /local/spotify-card.js
```
Now add the card like this:
```
  cards:
    - type: 'custom:spotify-card'
      client_id: <YOUR CLIENT ID>
```


### General usage
This library can of course also be used on other websites or projects other than Home Assistant

### CONTRIBUTING
Please contribute and help.Before creating a large PR make sure to sync about it with me.