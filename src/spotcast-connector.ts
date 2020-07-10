import { HassEntity } from 'home-assistant-js-websocket';
import { SpotifyCard } from './spotify-card';
import { SpotifyConnectDevice } from './types';
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
  parent: SpotifyCard;

  playlists: any = {};
  devices: Array<SpotifyConnectDevice> = [];
  players: Array<SpotifyConnectDevice> = [];
  chromecast_devices: Array<HassEntity> = [];

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

    // implement later in config
    if (this.parent.config.account) {
      options.account = this.parent.config.account;
    }
    return options;
  }

  public playUri(uri: string): void {
    const current_player = this.getCurrentPlayer();
    if (!current_player) {
      console.error('No active device');
      return;
    }
    this.playUriOnConnectDevice(current_player.id, uri);
  }

  public transferPlaybackToCastDevice(device_name: string): void {
    this.parent.hass.callService('spotcast', 'start', {
      device_name: device_name,
      force_playback: true,
    });
  }

  public transferPlaybackToConnectDevice(device_id: string): void {
    this.parent.hass.callService('spotcast', 'start', {
      spotify_device_id: device_id,
      force_playback: true,
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
    await this.fetchDevices();
    await this.fetchPlayer();
    await this.fetchChromecasts();
  }

  public getCurrentPlayer(): SpotifyConnectDevice | null {
    const spd = this.players.filter((p) => p.is_active).find((o) => typeof o !== 'undefined' && o !== null);
    return spd ? <SpotifyConnectDevice>spd : null;
  }

  private async fetchPlayer(): Promise<void> {
    const message: Message = {
      type: 'spotcast/player',
      account: 'default',
    };
    const res: any = await this.parent.hass.callWS(message);
    this.players = res.devices;
    //console.log('fetchPlayer:', this.players);
  }

  private async fetchDevices(): Promise<void> {
    const message: Message = {
      type: 'spotcast/devices',
      account: 'default',
    };
    const res: any = await this.parent.hass.callWS(message);
    this.devices = res.devices;
    // console.log('fetchDevices:', this.devices);
  }

  /**
   * Use HA state for now
   */
  private async fetchChromecasts(): Promise<void> {
    const res: any = await this.parent.hass.callWS({
      type: 'config/entity_registry/list',
    });
    this.chromecast_devices = res
      .filter((e) => e.platform == 'cast')
      .map((e) => this.parent.hass.states[e.entity_id])
      .filter((e) => e != null && e.state != 'unavailable');
    // console.log('fetchChromecasts:', this.chromecast_devices);
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
        // console.log('fetchPlaylists', resp.items);
        this.playlists = resp.items;
        this.parent.requestUpdate();
      },
      (err) => {
        console.error('fetchPlaylists failed!', err);
      }
    );
  }
}
