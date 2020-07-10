import { SpotifyCard } from './spotify-card';

interface Message {
  type: string;
  account?: string;
}

interface PlaylistMessage extends Message {
  playlist_type: string;
  country_code?: string;
  limit?: number;
  locale?: string;
}

export class SpotcastConnector {
  playlists: any = {};
  devices: any = {};

  parent: SpotifyCard;

  loading = false;

  constructor(parent: SpotifyCard) {
    this.parent = parent;
  }

  public is_loading(): boolean {
    setTimeout(this.set_loading_off, 100);
    return this.loading;
  }

  private set_loading_off() {
    this.loading = false;
  }

  public is_loaded(): boolean {
    if (this.playlists.length !== undefined) {
      return true;
    }
    return false;
  }

  private getPlaybackOptions(uri: string): any {
    const options: any = {
      uri: uri,
      force_playback: this.parent.getSpotifyEntityState() == 'playing',
      random_song: this.parent.config.always_play_random_song,
    };

    // implement later
    if (this.parent.config.account) {
      options.account = this.parent.config.account;
    }
    return options;
  }

  public playUriOnCastDevice(device_name: string, uri: string): void {
    const options: any = { ...this.getPlaybackOptions(uri), device_name: device_name };
    this.parent.hass.callService('spotcast', 'start', options);
  }

  public playUriOnConnectDevice(device_id: string, uri: string): void {
    const options: any = { ...this.getPlaybackOptions(uri), spotify_device_id: device_id };
    this.parent.hass.callService('spotcast', 'start', options);
  }

  public fetchDevices(): void {
    this.loading = true;
    const message: Message = {
      type: 'spotcast/devices',
      account: 'default',
    };

    this.parent.hass.connection.sendMessagePromise(message).then(
      (resp: any) => {
        console.log('Message success!', resp.devices);
        this.devices = resp.devices;
        this.parent.requestUpdate();
      },
      (err) => {
        console.error('Message failed!', err);
      }
    );
  }

  public fetchPlaylists(limit: number): void {
    console.log(limit);
    this.loading = true;
    const message: PlaylistMessage = {
      type: 'spotcast/playlists',
      playlist_type: this.parent.config.playlist_type ? this.parent.config.playlist_type : '',
    };
    if (this.parent.config.country_code) {
      message.country_code = this.parent.config.country_code;
    }
    this.parent.hass.connection.sendMessagePromise(message).then(
      (resp: any) => {
        console.log('Message success!', resp.items);
        this.playlists = resp.items;
        this.parent.requestUpdate();
      },
      (err) => {
        console.error('Message failed!', err);
      }
    );
  }
}
