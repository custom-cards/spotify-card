import { ConnectDevice, CurrentPlayer, Playlist, PlaybackOptions } from './types';
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

export interface ISpotcastConnector {
  parent: SpotifyCard;
  is_loading(): boolean;
  is_loaded(): boolean;
  playUri(uri: string): void;
  transferPlaybackToCastDevice(device_name: string): void;
  transferPlaybackToConnectDevice(device_id: string): void;
  playUriOnCastDevice(device_name: string, uri: string): void;
  playUriOnConnectDevice(device_id: string, uri: string): void;
  updateState(): Promise<void>;
  getCurrentPlayer(): ConnectDevice | undefined;
  fetchPlaylists(): Promise<void>;
}

export class SpotcastConnector implements ISpotcastConnector {
  public parent: SpotifyCard;
  // data is valid for 4 secs otherwise the service is spammed bcos of the entitiy changes
  private state_ttl = 4000;
  private last_state_update_time = 0;

  private loading = false;

  constructor(parent: SpotifyCard) {
    this.parent = parent;
  }

  public is_loading(): boolean {
    setTimeout(this.set_loading_off, 100);
    return this.loading;
  }

  public set_loading_off(): void {
    this.loading = false;
  }

  public is_loaded(): boolean {
    if (this.parent.playlists.length !== undefined) {
      return true;
    }
    return false;
  }

  public getPlaybackOptions(uri: string): PlaybackOptions {
    const options: PlaybackOptions = {
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
        const connect_device = this.parent.devices.filter((device) => device.name == default_device);
        if (connect_device.length > 0) {
          return this.playUriOnConnectDevice(connect_device[0].id, uri);
        } else {
          const cast_device = this.parent.chromecast_devices.filter(
            (cast) => cast.friendly_name == default_device
          );
          if (cast_device.length > 0) {
            return this.playUriOnCastDevice(cast_device[0].friendly_name, uri);
          }
          throw new Error('Could not find default_device: ' + default_device);
        }
      }
      throw new Error('No active device nor default device in settings');
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
    const options: PlaybackOptions = { ...this.getPlaybackOptions(uri), device_name: device_name };
    this.parent.hass.callService('spotcast', 'start', options);
  }

  public playUriOnConnectDevice(device_id: string, uri: string): void {
    const options: PlaybackOptions = { ...this.getPlaybackOptions(uri), spotify_device_id: device_id };
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
      this.loading = true;
      await this.fetchDevices();
      await this.fetchPlayer();
      await this.fetchChromecasts();
      this.last_state_update_time = new Date().getTime();
    } catch (e) {
      throw Error('updateState error: ' + e);
    } finally {
      this.loading = false;
    }
  }

  public getCurrentPlayer(): ConnectDevice | undefined {
    return this.parent.player?.device;
  }

  public async fetchPlayer(): Promise<void> {
    // console.log('fetchPlayer');
    const message: Message = {
      type: 'spotcast/player',
      account: this.parent.config.account,
    };
    try {
      this.parent.player = <CurrentPlayer>await this.parent.hass.callWS(message);
    } catch (e) {
      throw Error('Failed to fetch player: ' + e);
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
      this.parent.devices = res.devices;
    } catch (e) {
      throw Error('Failed to fetch devices: ' + e);
    }
    // console.log('fetchDevices:', JSON.stringify(this.devices, null, 2));
  }

  /**
   * Use HA state for now
   */
  private async fetchChromecasts(): Promise<void> {
    try {
      this.parent.chromecast_devices = await this.parent.hass.callWS({ type: 'spotcast/castdevices' });
    } catch (e) {
      this.parent.chromecast_devices = [];
      throw Error('Failed to fetch devices: ' + e);
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
      this.parent.playlists = res.items;
    } catch (e) {
      throw Error('Failed to fetch playlists: ' + e);
    } finally {
      this.loading = false;
    }
    // console.log('PLAYLISTS:', JSON.stringify(this.playlists, null, 2));
  }
}
