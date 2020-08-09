import { ConnectDevice, CurrentPlayer, Playlist } from './types';
import { SpotifyCardLib } from './spotify-card-lib';
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
  parent: SpotifyCardLib;

  playlists: Array<Playlist> = [];
  devices: Array<ConnectDevice> = [];
  player?: CurrentPlayer;
  chromecast_devices: Array<any> = [];
  // data is valid for 4 secs otherwise the service is spammed bcos of the entitiy changes
  state_ttl = 4000;
  last_state_update_time = 0;

  loading = false;

  constructor(parent: SpotifyCardLib) {
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
      random_song: this.parent.config.always_play_random_song || false,
      account: this.parent.config.account,
    };

    return options;
  }

  public playUri(uri: string): void {
    const current_player = this.getCurrentPlayer();
    if (!current_player) {
      const default_device = this.parent.config.default_device;
      if (default_device) {
        const connect_device = this.devices.filter((device) => device.name == default_device);

        if (connect_device.length > 0) {
          return this.playUriOnConnectDevice(connect_device[0].id, uri);
        } else {
          const cast_device = this.chromecast_devices.filter((cast) => cast.friendly_name == default_device);
          if (cast_device.length > 0) {
            return this.playUriOnCastDevice(cast_device[0].friendly_name, uri);
          }
          console.error('Could not find default_device:' + default_device);
        }
      }

      console.error('No active device nor default device in settings');
      return;
    }
    this.playUriOnConnectDevice(current_player.id, uri);
  }

  public transferPlaybackToCastDevice(device_name: string): void {
    this.parent.hass.callService('spotcast', 'start', {
      device_name: device_name,
      force_playback: true,
      account: this.parent.config.account,
    });
  }

  public transferPlaybackToConnectDevice(device_id: string): void {
    this.parent.hass.callService('spotcast', 'start', {
      spotify_device_id: device_id,
      force_playback: true,
      account: this.parent.config.account,
    });
  }

  public playUriOnCastDevice(device_name: string, uri: string): void {
    const options: any = { ...this.getPlaybackOptions(uri), device_name: device_name };
    this.parent.hass.callService('spotcast', 'start', options);
  }

  public playUriOnConnectDevice(device_id: string, uri: string): void {
    const options: any = { ...this.getPlaybackOptions(uri), spotify_device_id: device_id };
    this.parent.hass.callService('spotcast', 'start', options);
  }

  public async updateState(): Promise<void> {
    const now = new Date().getTime();
    if (now - this.last_state_update_time < this.state_ttl) {
      // console.log('cache is still valid:', this.last_state_update_time);
      return;
    }
     // console.log('cache is NOT valid:', this.last_state_update_time);
    try {
      await this.fetchDevices();
      await this.fetchPlayer();
      await this.fetchChromecasts();
      this.last_state_update_time = new Date().getTime();
    } catch (e) {
      console.error('updateState error:', e);
    }
  }

  public getCurrentPlayer(): ConnectDevice | undefined {
    return this.player?.device;
  }

  private async fetchPlayer(): Promise<void> {
    // console.log('fetchPlayer');
    const message: Message = {
      type: 'spotcast/player',
      account: this.parent.config.account,
    };
    try {
      this.player = <CurrentPlayer>await this.parent.hass.callWS(message);
    } catch (e) {
      console.error('Failed to fetch player', e);
    }
    // console.log('fetchPlayer:', JSON.stringify(this.player, null, 2));
  }

  private async fetchDevices(): Promise<void> {
    // console.log('fetchDevices');
    const message: Message = {
      type: 'spotcast/devices',
      account: this.parent.config.account,
    };
    try {
      const res: any = <Array<ConnectDevice>>await this.parent.hass.callWS(message);
      this.devices = res.devices;
    } catch (e) {
      console.error('Failed to fetch devices', e);
    }

    // console.log('fetchDevices:', JSON.stringify(this.devices, null, 2));
  }

  /**
   * Use HA state for now
   */
  private async fetchChromecasts(): Promise<void> {
    try {
      this.chromecast_devices = await this.parent.hass.callWS({ type: 'spotcast/castdevices' });
    } catch (e) {
      console.error('Failed to fetch cast devices', e);
      this.chromecast_devices = [];
    }
    // console.log('fetchChromecasts2:', this.chromecast_devices);
  }

  public async fetchPlaylists(): Promise<void> {
    this.loading = true;
    const message: PlaylistMessage = {
      type: 'spotcast/playlists',
      playlist_type: this.parent.config.playlist_type || '',
      account: this.parent.config.account,
      limit: this.parent.config.limit,
    };
    if (this.parent.config.country_code) {
      message.country_code = this.parent.config.country_code;
    }
    // message.locale = 'implement me later'
    try {
      const res: any = <Array<Playlist>>await this.parent.hass.callWS(message);
      this.playlists = res.items;
    } catch (e) {
      console.error('Failed to fetch playlists', e);
    }
    // console.log('PLAYLISTS:', JSON.stringify(this.playlists, null, 2));
  }
}
