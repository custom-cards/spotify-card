## Home Assistant Spotify Lovelace Card

This card supports listing the currently available devices and the users 10 top playlists. Click on a playlist and choose a device and hit play.

### TODO:
 - Add catch up on state at load time
   GET https://api.spotify.com/v1/me/player. 
   If resp.device.id == devices.id then this device is playing
   If resp.context.external_urls.spotify === playlist.context.external_urls.spotify then this playlist is playing