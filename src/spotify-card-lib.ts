import { ConnectDevice, Playlist, ChromecastDevice, isConnectDevice } from './types';

import { HomeAssistant} from 'custom-card-helpers';
import { servicesColl, subscribeEntities, HassEntities, HassEntity, Collection, HassServices } from 'home-assistant-js-websocket';

import { SpotifyCardConfig } from './types';
import { SpotcastConnector } from './spotcast-connector';
import { SpotifyCard } from './spotify-card';
import { PLAYLIST_TYPES, DISPLAY_STYLES } from './types';

export enum DisplayStyle {
  Grid,
  List,
}

export interface ISpotifyCardLib {
  hass: HomeAssistant;
  config: SpotifyCardConfig;
  spotify_state?: HassEntity;
  setConfig(config: SpotifyCardConfig): string;
  getDisplayStyle(): DisplayStyle;
  getPlayingState(): boolean;
  getShuffleState(): boolean;
  getSpotifyEntityState(): string;
  isSpotcastInstalled(): boolean;
  isSpotifyInstalled(): boolean;
  requestUpdate(): void;
  getCurrentPlayer(): ConnectDevice | undefined;
  dataAvailable(): boolean;
  updated(hass: HomeAssistant): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  doSubscribeEntities(): void;
  getFilteredDevices(): [ConnectDevice[], ChromecastDevice[]];
  getPlaylists(): Playlist[];
  isThisPlaylistPlaying(item: Playlist): boolean;
  playUri(uri: string): void;
  onShuffleSelect(): void;
  handlePlayPauseEvent(ev: Event, command: string): void;
  spotifyDeviceSelected(device: ConnectDevice): void;
  chromecastDeviceSelected(device: ChromecastDevice): void;
}

export class SpotifyCardLib implements ISpotifyCardLib {
  public _parent: SpotifyCard;
  public hass!: HomeAssistant;
  public config!: SpotifyCardConfig;
  public spotify_state?: HassEntity;
  
  // These are 'private'
  public _spotcast_connector!: SpotcastConnector;
  public _unsubscribe_entitites?: any;
  public _spotify_installed = false;
  public _fetch_time_out: any = 0;

  constructor(parent: SpotifyCard) {
    this._parent = parent;
    this.hass = parent.hass;
  }

  public setConfig(config: SpotifyCardConfig): string {
      this.config = config;
      if (this.config.playlist_type && !PLAYLIST_TYPES.includes(this.config.playlist_type)) {
        return 'playlist_type'; 
      }
      if (this.config.display_style && !DISPLAY_STYLES.includes(this.config.display_style)) {
        return 'display_style';
      }
      return '';
  }

  public getDisplayStyle(): DisplayStyle {
    // Display spotify playlists
    if (this.config.display_style?.toLowerCase() == 'grid') {
      return DisplayStyle.Grid;
    } else {
      return DisplayStyle.List;
    }
  }

  public getPlayingState(): boolean {
    return this.spotify_state?.state == 'playing' ?? false;
  }

  public getShuffleState(): boolean {
    return this._spotcast_connector.player?.shuffle_state ?? false;
  }

  public getSpotifyEntityState(): string {
    return this.spotify_state ? this.spotify_state.state : '';
  }

  public isSpotcastInstalled(): boolean {
    if (this.hass?.connection && this.getHassConnection().state.spotcast !== undefined) {
      return true;
    }
    return false;
  }

  public getHassConnection(): Collection<HassServices> {
    return servicesColl(this.hass.connection);
  }

  public isSpotifyInstalled(): boolean {
    return this._spotify_installed;
  }

  public requestUpdate(): void {
    if (this.isSpotcastInstalled() && !this._spotcast_connector.is_loading()) {
      this._spotcast_connector.fetchPlaylists().then(() => {
        this._parent.requestUpdate();
      });
    }
  }

  public getCurrentPlayer(): ConnectDevice | undefined {
    return this._spotcast_connector.getCurrentPlayer();
  }

  public dataAvailable(): boolean {
    return this._spotcast_connector.is_loaded();
  }

  public updated(hass: HomeAssistant): void {
    this.hass = hass;
    this.doSubscribeEntities();
  }

  public connectedCallback(): void {
    this._spotcast_connector = new SpotcastConnector(this);
    //get all available entities and when they update
    this.doSubscribeEntities();
  }

  public disconnectedCallback(): void {
    this._unsubscribe_entitites && this._unsubscribe_entitites();
  }

  public doSubscribeEntities(): void {
    if (this.hass?.connection && !this._unsubscribe_entitites && this._parent.isHASSConnected) {
      this._unsubscribe_entitites = subscribeEntities(this.hass.connection, (entities) =>
        this.entitiesUpdated(entities)
      );
    }
  }

  //Callback when hass-entity has changed
  public entitiesUpdated(entities: HassEntities): void {
    let updateDevices = false;
    for (const item in entities) {
      // Are there any changes to media players
      if (item.startsWith('media_player')) {
        // Get spotify state
        if (item.startsWith('media_player.spotify') || item == this.config.spotify_entity) {
          this._spotify_installed = true;
          this.spotify_state = entities[item];
        }
        updateDevices = true;
      }
    }
    if (updateDevices && !document.hidden) {
      // Debounce updates to 500ms
      if (this._fetch_time_out) {
        clearTimeout(this._fetch_time_out);
      }
      this._fetch_time_out = setTimeout(() => {
        this._spotcast_connector.updateState().then(() => {
          this.requestUpdate();
        });
      }, 500);
    }
  }

  public checkIfAllowedToShow(device: ConnectDevice | ChromecastDevice): boolean {
    const filters =
      this.config.filter_devices?.map((filter_str) => {
        return new RegExp(filter_str + '$');
      }) ?? [];
    for (const filter of filters) {
      if (filter.test(isConnectDevice(device) ? device.name : device.friendly_name)) {
        return false;
      }
    }
    return true;
  }

  public getFilteredDevices(): [ConnectDevice[], ChromecastDevice[]] {
    const spotify_connect_devices = this._spotcast_connector.devices.filter(this.checkIfAllowedToShow, this);
    const chromecast_devices = this._spotcast_connector.chromecast_devices.filter(this.checkIfAllowedToShow, this);
    return [spotify_connect_devices, chromecast_devices];
  }

  public getPlaylists(): Playlist[] {
    return this._spotcast_connector.playlists;
  }

  public isThisPlaylistPlaying(item: Playlist): boolean {
    return this.spotify_state?.attributes.media_playlist === item.name;
  }

  public playUri(uri: string): void {
    this._spotcast_connector.playUri(uri);
  }

  public onShuffleSelect(): void {
    if (this.spotify_state?.state == 'playing') {
      this.hass.callService('media_player', 'shuffle_set', {
        entity_id: this.spotify_state.entity_id,
        shuffle: !this._spotcast_connector.player?.shuffle_state,
      });
    }
  }

  public handlePlayPauseEvent(ev: Event, command: string): void {
    ev.stopPropagation();
    if (this.spotify_state) {
      this.hass.callService('media_player', command, { entity_id: this.spotify_state.entity_id });
    }
  }

  public spotifyDeviceSelected(device: ConnectDevice): void {
    const current_player = this._spotcast_connector.getCurrentPlayer();
    if (current_player) {
      return this._spotcast_connector.transferPlaybackToConnectDevice(device.id);
    }
    const playlist = this._spotcast_connector.playlists[0];
    console.log('spotifyDeviceSelected playing first playlist');
    this._spotcast_connector.playUriOnConnectDevice(device.id, playlist.uri);
  }

  public chromecastDeviceSelected(device: ChromecastDevice): void {
    const current_player = this._spotcast_connector.getCurrentPlayer();
    if (current_player) {
      return this._spotcast_connector.transferPlaybackToCastDevice(device.friendly_name);
    }

    const playlist = this._spotcast_connector.playlists[0];
    console.log('chromecastDeviceSelected playing first playlist');
    this._spotcast_connector.playUriOnCastDevice(device.friendly_name, playlist.uri);
  }
}
