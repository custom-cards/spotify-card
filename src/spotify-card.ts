import {
  LitElement,
  html,
  customElement,
  property,
  internalProperty,
  CSSResult,
  TemplateResult,
  PropertyValues,
  css,
} from 'lit-element';

import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { CARD_VERSION } from './const';

import {
  SpotifyCardConfig,
  DisplayStyle,
  PlaylistType,
  isConnectDevice,
  ConnectDevice,
  ChromecastDevice,
  Playlist,
  CurrentPlayer,
  isCurrentPlayer,
  ValueChangedEvent,
} from './types';

import { PLAYLIST_TYPES } from './editor';

import { localize } from './localize/localize';
import { ISpotcastConnector, SpotcastConnector } from './spotcast-connector';
import { HassEntity, servicesColl, subscribeEntities, HassEntities } from 'home-assistant-js-websocket';

// Display card version in console
/* eslint no-console: 0 */
console.info(
  `%c  SPOTIFY-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

// Configures the preview in the Lovelace card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'spotify-card',
  name: 'Spotify Card',
  description: localize('common.description'),
  preview: true,
});

export function hasChangedCustom(
  newVal: Array<Playlist> | Array<ConnectDevice> | Array<ChromecastDevice> | CurrentPlayer,
  oldVal: Array<Playlist> | Array<ConnectDevice> | Array<ChromecastDevice> | CurrentPlayer
): boolean {
  if (!oldVal || (!isCurrentPlayer(oldVal) && !isCurrentPlayer(newVal) && newVal.length != oldVal.length)) {
    return true;
  }
  for (const index in newVal) {
    if (newVal[index].id != oldVal[index].id) {
      return true;
    }
  }
  return false;
}

export function hasChangedMediaPlayer(newVal: HassEntity, oldVal: HassEntity): boolean {
  if (!oldVal) {
    return true;
  }
  if (
    newVal.state != oldVal.state ||
    newVal.attributes.shuffle != oldVal.attributes.shuffle ||
    newVal.attributes.media_title != oldVal.attributes.media_title ||
    newVal.attributes.media_artist != oldVal.attributes.media_artist ||
    newVal.attributes.volume_level != oldVal.attributes.volume_level
  ) {
    return true;
  }
  return false;
}

@customElement('spotify-card')
export class SpotifyCard extends LitElement {
  public hass!: HomeAssistant;

  @property({ type: Object })
  public config!: SpotifyCardConfig;

  @property({ hasChanged: hasChangedCustom })
  public playlists: Array<Playlist> = [];

  @property({ hasChanged: hasChangedCustom })
  public devices: Array<ConnectDevice> = [];

  @property({ hasChanged: hasChangedCustom })
  public chromecast_devices: Array<ChromecastDevice> = [];

  @property({ hasChanged: hasChangedCustom })
  public player?: CurrentPlayer;

  @internalProperty({ hasChanged: hasChangedMediaPlayer })
  private _spotify_state?: HassEntity;

  private spotcast_connector!: ISpotcastConnector;
  private _unsubscribe_entitites?: any;
  private _spotify_installed = false;
  private _fetch_time_out: any = 0;
  private _last_volume_set_time = 0;

  constructor() {
    super();
    this.spotcast_connector = new SpotcastConnector(this);
  }

  // Calls the editor
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('spotify-card-editor') as LovelaceCardEditor;
  }

  // Returns default config for Lovelace picker
  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  public setConfig(_config: SpotifyCardConfig): void {
    // I don't know why, but if PLAYLIST_TYPES is not used. The card gives an error which is hard to debug.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const bug = PLAYLIST_TYPES;
    //Check for errors in config
    let var_error = '';
    if (
      _config.playlist_type &&
      !(Object.values(PlaylistType) as Array<string>).includes(_config.playlist_type.toLowerCase())
    ) {
      var_error = 'playlist_type';
    }
    if (
      _config.display_style &&
      !(Object.values(DisplayStyle) as Array<string>).includes(_config.display_style.toLowerCase())
    ) {
      var_error = 'display_style';
    }
    // Show error if neccessary
    if (_config.show_error || var_error != '') {
      throw new Error(localize('common.invalid_configuration') + ': ' + var_error);
    }
    this.config = _config;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.doSubscribeEntities();
    this.updateSpotcast();
  }

  public doSubscribeEntities(): void {
    if (this.hass?.connection && !this._unsubscribe_entitites && this.isConnected) {
      this._unsubscribe_entitites = subscribeEntities(this.hass.connection, (entities) =>
        this.entitiesUpdated(entities)
      );
    }
  }

  //Callback when hass-entity has changed
  private entitiesUpdated(entities: HassEntities): void {
    let updateDevices = false;
    for (const item in entities) {
      // Are there any changes to media players
      if (item.startsWith('media_player')) {
        // Get spotify state
        if (item.startsWith('media_player.spotify') || item == this.config.spotify_entity) {
          this._spotify_installed = true;
          this._spotify_state = entities[item];
        }
        updateDevices = true;
      }
    }
    if (updateDevices && !document.hidden) {
      this.updateSpotcast();
    }
  }

  private updateSpotcast(): void {
    // Debounce updates to 500ms
    if (this._fetch_time_out) {
      clearTimeout(this._fetch_time_out);
    }
    this._fetch_time_out = setTimeout(async () => {
      if (this.hass) {
        //request update of spotcast data
        if (this.isSpotcastInstalled() && !this.spotcast_connector.is_loading()) {
          await this.spotcast_connector.updateState();
          await this.spotcast_connector.fetchPlaylists();
        }
      }
    }, 500);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._unsubscribe_entitites) {
      this._unsubscribe_entitites();
      this._unsubscribe_entitites = undefined;
    }
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    this.updateComplete.then(() => {
      for (const cover of this.renderRoot.querySelectorAll('[data-spotify-image-url]') as NodeListOf<HTMLDivElement>) {
        const downloadingImage = new Image();
        downloadingImage.onload = function (event) {
          cover.firstElementChild?.replaceWith(event.srcElement as HTMLDivElement);
        };
        cover.dataset.spotifyImageUrl ? (downloadingImage.src = cover.dataset.spotifyImageUrl) : '';
      }
    });
  }

  private getDisplayStyle(): DisplayStyle {
    // Display spotify playlists
    if (this.config.display_style?.toLowerCase() == 'grid') {
      return DisplayStyle.Grid;
    } else {
      return DisplayStyle.List;
    }
  }

  private getPlayingState(): boolean {
    return this._spotify_state?.state == 'playing' ?? false;
  }

  private getShuffleState(): boolean {
    return this.player?.shuffle_state ?? false;
  }

  public getSpotifyEntityState(): string {
    return this._spotify_state ? this._spotify_state.state : '';
  }

  private isSpotcastInstalled(): boolean {
    if (this.hass?.connection && servicesColl(this.hass.connection).state.spotcast !== undefined) {
      return true;
    }
    return false;
  }

  private checkIfAllowedToShow(device: ConnectDevice | ChromecastDevice): boolean {
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

  private getDefaultDevice(): string | undefined {
    let [spotify_connect_devices, chromecast_devices] = this.getFilteredDevices();
    spotify_connect_devices = spotify_connect_devices.filter((device) => {
      return device.name == this.config.default_device;
    });
    chromecast_devices = chromecast_devices.filter((device) => {
      return device.friendly_name == this.config.default_device;
    });
    if (spotify_connect_devices.length > 0 || chromecast_devices.length > 0) {
      return this.config.default_device;
    }
    return;
  }

  private getFilteredDevices(): [ConnectDevice[], ChromecastDevice[]] {
    const spotify_connect_devices = this.devices.filter(this.checkIfAllowedToShow, this);
    const chromecast_devices = this.chromecast_devices.filter(this.checkIfAllowedToShow, this);
    return [spotify_connect_devices, chromecast_devices];
  }

  private getPlaylists(): Playlist[] {
    return this.playlists;
  }

  private isThisPlaylistPlaying(item: Playlist): boolean {
    return this._spotify_state?.attributes.media_playlist === item.name;
  }

  private startUri(elem: MouseEvent, uri: string): void {
    const loading = 'loading';
    const target = elem.target as HTMLElement;
    let item;
    switch (target.localName) {
      case 'img': {
        item = target.parentElement?.parentElement;
        break;
      }
      case 'div': {
        item = target;
        break;
      }
      case 'p': {
        item = target.parentElement;
        break;
      }
      default: {
        console.log(target);
        break;
      }
    }
    item.classList.add(loading);
    setTimeout(() => {
      item.classList.remove(loading);
    }, 10000);
    this.spotcast_connector.playUri(uri);
  }

  private onShuffleSelect(elem: MouseEvent): void {
    this.hass.callService('media_player', 'shuffle_set', {
      entity_id: this._spotify_state?.entity_id,
      shuffle: !this.player?.shuffle_state,
    });
    const target = elem.target as HTMLElement;
    let parent = target.parentElement;
    if (parent?.localName == 'svg') {
      parent = parent.parentElement;
    }
    if (parent?.classList.contains('shuffle')) {
      parent.classList.remove('shuffle');
    } else {
      parent?.classList.add('shuffle');
    }
  }

  private handleMediaEvent(ev: Event, command: string): void {
    ev.stopPropagation();
    if (this._spotify_state) {
      this.hass.callService('media_player', command, {
        entity_id: this._spotify_state.entity_id,
      });
    }
  }

  private getVolume(): number {
    return this._spotify_state?.attributes?.volume_level * 100;
  }

  protected shouldUpdate(changedProperties): any {
    let scheduleUpdate = true;
    changedProperties.forEach((_oldValue, propName) => {
      // console.log(`${propName} changed. oldValue: ${_oldValue}`);
      // Blocks render after a volume change, which otherwise can cause a jumping volume slider
      if (propName == '_spotify_state') {
        const d = new Date();
        if (d.getTime() - this._last_volume_set_time < 500) {
          scheduleUpdate = false;
        }
      }
    });
    return scheduleUpdate;
  }

  private handleVolumeChanged(ev: ValueChangedEvent): void {
    ev.stopPropagation();
    if (this._spotify_state) {
      this.hass.callService('media_player', 'volume_set', {
        entity_id: this._spotify_state.entity_id,
        volume_level: ev.target.value / 100,
      });
      const d = new Date();
      this._last_volume_set_time = d.getTime();
    }
  }

  private confirmDeviceSelection(elem: MouseEvent) {
    const target = elem.target as HTMLElement;
    target?.parentElement?.classList.add('dropdown-content-hide');
    setTimeout(() => {
      target?.parentElement?.classList.remove('dropdown-content-hide');
    }, 1000);
  }

  private spotifyDeviceSelected(elem: MouseEvent, device: ConnectDevice): void {
    this.confirmDeviceSelection(elem);
    const current_player = this.spotcast_connector.getCurrentPlayer();
    if (current_player) {
      return this.spotcast_connector.transferPlaybackToConnectDevice(device.id);
    }
    const playlist = this.playlists[0];
    console.log('spotifyDeviceSelected playing first playlist');
    this.spotcast_connector.playUriOnConnectDevice(device.id, playlist.uri);
  }

  private chromecastDeviceSelected(elem: MouseEvent, device: ChromecastDevice): void {
    this.confirmDeviceSelection(elem);
    const current_player = this.spotcast_connector.getCurrentPlayer();
    if (current_player) {
      return this.spotcast_connector.transferPlaybackToCastDevice(device.friendly_name);
    }

    const playlist = this.playlists[0];
    console.log('chromecastDeviceSelected playing first playlist');
    this.spotcast_connector.playUriOnCastDevice(device.friendly_name, playlist.uri);
  }

  private getCurrentPlayer(): ConnectDevice | undefined {
    return this.spotcast_connector.getCurrentPlayer();
  }

  protected render(): TemplateResult | void {
    let warning = html``;
    if (!this.isSpotcastInstalled()) {
      warning = this.showWarning(localize('common.show_missing_spotcast'));
    }
    // if (!this._spotify_installed) {
    //   warning = this.showWarning(localize('common.show_missing_spotify'));
    // }

    // Display loading screen if no content available yet
    let content = html`<div>Loading...</div>`;
    // Request playlist data if not loaded
    if (this.spotcast_connector.is_loaded()) {
      switch (this.getDisplayStyle()) {
        case DisplayStyle.Grid: {
          content = this.generateGridView();
          break;
        }
        default: {
          content = this.generateListView();
          break;
        }
      }
    }
    const header = html`<div id="header">
      <div id="icon" onclick="window.open('https://www.spotify.com/')">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 559 168">
          <path
            d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.288 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.802c-1.89 3.072-5.91 4.042-8.98 2.152-22.51-13.836-56.823-17.843-83.448-9.761-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739zm94.56 3.072c-14.46-3.448-17.03-5.868-17.03-10.953 0-4.804 4.52-8.037 11.25-8.037 6.52 0 12.98 2.455 19.76 7.509 0.2 0.153 0.46 0.214 0.71 0.174 0.26-0.038 0.48-0.177 0.63-0.386l7.06-9.952c0.29-0.41 0.21-0.975-0.18-1.288-8.07-6.473-17.15-9.62-27.77-9.62-15.61 0-26.52 9.369-26.52 22.774 0 14.375 9.41 19.465 25.67 23.394 13.83 3.187 16.17 5.857 16.17 10.629 0 5.29-4.72 8.58-12.32 8.58-8.44 0-15.33-2.85-23.03-9.51-0.19-0.17-0.45-0.24-0.69-0.23-0.26 0.02-0.49 0.14-0.65 0.33l-7.92 9.42c-0.33 0.4-0.29 0.98 0.09 1.32 8.96 8 19.98 12.22 31.88 12.22 16.82 0 27.69-9.19 27.69-23.42 0.03-12.007-7.16-18.657-24.77-22.941l-0.03-0.013zm62.86-14.26c-7.29 0-13.27 2.872-18.21 8.757v-6.624c0-0.523-0.42-0.949-0.94-0.949h-12.95c-0.52 0-0.94 0.426-0.94 0.949v73.601c0 0.52 0.42 0.95 0.94 0.95h12.95c0.52 0 0.94-0.43 0.94-0.95v-23.23c4.94 5.53 10.92 8.24 18.21 8.24 13.55 0 27.27-10.43 27.27-30.369 0.02-19.943-13.7-30.376-27.26-30.376l-0.01 0.001zm12.21 30.375c0 10.149-6.25 17.239-15.21 17.239-8.85 0-15.53-7.41-15.53-17.239 0-9.83 6.68-17.238 15.53-17.238 8.81-0.001 15.21 7.247 15.21 17.237v0.001zm50.21-30.375c-17.45 0-31.12 13.436-31.12 30.592 0 16.972 13.58 30.262 30.91 30.262 17.51 0 31.22-13.39 31.22-30.479 0-17.031-13.62-30.373-31.01-30.373v-0.002zm0 47.714c-9.28 0-16.28-7.46-16.28-17.344 0-9.929 6.76-17.134 16.07-17.134 9.34 0 16.38 7.457 16.38 17.351 0 9.927-6.8 17.127-16.17 17.127zm68.27-46.53h-14.25v-14.566c0-0.522-0.42-0.948-0.94-0.948h-12.95c-0.52 0-0.95 0.426-0.95 0.948v14.566h-6.22c-0.52 0-0.94 0.426-0.94 0.949v11.127c0 0.522 0.42 0.949 0.94 0.949h6.22v28.795c0 11.63 5.79 17.53 17.22 17.53 4.64 0 8.49-0.96 12.12-3.02 0.3-0.16 0.48-0.48 0.48-0.82v-10.6c0-0.32-0.17-0.63-0.45-0.8-0.28-0.18-0.63-0.19-0.92-0.04-2.49 1.25-4.9 1.83-7.6 1.83-4.15 0-6.01-1.89-6.01-6.11v-26.76h14.25c0.52 0 0.94-0.426 0.94-0.949v-11.126c0.02-0.523-0.4-0.949-0.93-0.949l-0.01-0.006zm49.64 0.057v-1.789c0-5.263 2.02-7.61 6.54-7.61 2.7 0 4.87 0.536 7.3 1.346 0.3 0.094 0.61 0.047 0.85-0.132 0.25-0.179 0.39-0.466 0.39-0.77v-10.91c0-0.417-0.26-0.786-0.67-0.909-2.56-0.763-5.84-1.546-10.76-1.546-11.95 0-18.28 6.734-18.28 19.467v2.74h-6.22c-0.52 0-0.95 0.426-0.95 0.948v11.184c0 0.522 0.43 0.949 0.95 0.949h6.22v44.405c0 0.53 0.43 0.95 0.95 0.95h12.94c0.53 0 0.95-0.42 0.95-0.95v-44.402h12.09l18.52 44.402c-2.1 4.66-4.17 5.59-6.99 5.59-2.28 0-4.69-0.68-7.14-2.03-0.23-0.12-0.51-0.14-0.75-0.07-0.25 0.09-0.46 0.27-0.56 0.51l-4.39 9.63c-0.21 0.46-0.03 0.99 0.41 1.23 4.58 2.48 8.71 3.54 13.82 3.54 9.56 0 14.85-4.46 19.5-16.44l22.46-58.037c0.12-0.292 0.08-0.622-0.1-0.881-0.17-0.257-0.46-0.412-0.77-0.412h-13.48c-0.41 0-0.77 0.257-0.9 0.636l-13.81 39.434-15.12-39.46c-0.14-0.367-0.49-0.61-0.88-0.61h-22.12v-0.003zm-28.78-0.057h-12.95c-0.52 0-0.95 0.426-0.95 0.949v56.481c0 0.53 0.43 0.95 0.95 0.95h12.95c0.52 0 0.95-0.42 0.95-0.95v-56.477c0-0.523-0.42-0.949-0.95-0.949v-0.004zm-6.4-25.719c-5.13 0-9.29 4.152-9.29 9.281 0 5.132 4.16 9.289 9.29 9.289s9.28-4.157 9.28-9.289c0-5.128-4.16-9.281-9.28-9.281zm113.42 43.88c-5.12 0-9.11-4.115-9.11-9.112s4.04-9.159 9.16-9.159 9.11 4.114 9.11 9.107c0 4.997-4.04 9.164-9.16 9.164zm0.05-17.365c-4.67 0-8.2 3.71-8.2 8.253 0 4.541 3.51 8.201 8.15 8.201 4.67 0 8.2-3.707 8.2-8.253 0-4.541-3.51-8.201-8.15-8.201zm2.02 9.138l2.58 3.608h-2.18l-2.32-3.31h-1.99v3.31h-1.82v-9.564h4.26c2.23 0 3.69 1.137 3.69 3.051 0.01 1.568-0.9 2.526-2.21 2.905h-0.01zm-1.54-4.315h-2.37v3.025h2.37c1.18 0 1.89-0.579 1.89-1.514 0-0.984-0.71-1.511-1.89-1.511z"
          />
        </svg>
      </div>
      ${this.config.name ? html`<div id="header_name">${this.config.name}</div>` : null}
      <div></div>
    </div>`;
    return html`
      <ha-card tabindex="0" style="${this.config.height ? `height: ${this.config.height}px` : ''}"
        >${this.config.hide_warning ? '' : warning} ${!this.config.hide_top_header ? header : null}
        ${this._spotify_state &&
        !this.config.hide_currently_playing &&
        this._spotify_state?.attributes.media_title &&
        this._spotify_state?.attributes.media_artist
          ? html` <p id="header-track">
              ${this._spotify_state?.attributes.media_title} - ${this._spotify_state?.attributes.media_artist}
            </p>`
          : null}
        <div id="content">${content}</div>
        <div id="footer">
          <div class="dropdown-wrapper">
            <div class="controls">
              <div class="mediaplayer">
                <div class="mediaplayer_select">
                  <svg
                    class="mediaplayer_speaker_icon"
                    width="220"
                    height="220"
                    viewBox="0 0 220 220"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M197.766 112.275q0 56.608-34.867 105.006l-8.157-6.984q32.743-44.355 32.743-98.022 0-52.565-32.632-97.9l8.158-6.984q34.755 48.398 34.755 104.884zm-24.586 0q0 46.928-28.831 88.22l-8.158-6.74q26.708-38.228 26.708-81.48 0-43.13-26.708-81.359l8.158-6.74q28.831 40.435 28.831 88.099zm-24.585 0q0 37.126-22.908 71.434l-8.27-6.617q20.897-30.632 20.897-64.817 0-33.573-20.897-64.818l8.27-6.616q22.908 34.308 22.908 71.434zm-54.646 89.2l-52.634-53.3H8.125V76.374h33.302l52.522-53.177v178.278z"
                      stroke="null"
                    />
                  </svg>
                  ${this.getCurrentPlayer()?.name ?? this.getDefaultDevice() ?? localize('common.choose_player')}
                </div>
              </div>
            </div>
            <div class="dropdown-content dropdown">${this.generateDeviceList()}</div>
          </div>
          <div class="footer__right">
            ${!this.config.hide_playback_controls
              ? html`
                  <div class="playback-controls">
                    ${this.getCurrentPlayer()
                      ? html`
              ${
                this._spotify_state?.state == 'playing'
                  ? html`<div @click=${this.onPauseSelect}>
                      <svg viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    </div>`
                  : html`<div @click=${this.onResumeSelect}>
                      <svg viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>`
              }
              <div @click=${this.onPrevSelect}>
                <svg viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </div>
              <div @click=${this.onNextSelect}>
                <svg viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </div>
              <div class="${this.getShuffleState() ? 'shuffle' : ''}" @click=${(elem) => this.onShuffleSelect(elem)}>
                <svg viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"
                  />
                </svg>
              </div>
              <div class="volume">
                <svg viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                  />
                </svg>
              </div>
              <div id="volume-slider" class="dropdown">
                <paper-slider
                  max="100"
                  min="0"
                  pin
                  .value=${this.getVolume()}
                  @click=${this.handleVolumeChanged}
                  @touchend=${this.handleVolumeChanged}
                ></paper-slider>
              </div>
            </div>`
                      : null}
                  </div>
                `
              : null}
            ${this.config.hide_top_header
              ? html`<div class="small-icon" onclick="window.open('https://www.spotify.com/')">
                  <svg viewBox="0 0 168 168">
                    <path
                      d="M 83.996 0.277 C 37.747 0.277 0.253 37.77 0.253 84.019 C 0.253 130.27 37.747 167.76 83.996 167.76 C 130.25 167.76 167.74 130.27 167.74 84.019 C 167.74 37.773 130.25 0.281 83.995 0.281 L 83.996 0.277 L 83.996 0.277 Z M 122.4 121.057 C 120.9 123.517 117.68 124.297 115.22 122.787 C 95.558 110.777 70.806 108.057 41.656 114.717 C 38.847 115.357 36.047 113.597 35.407 110.787 C 34.764 107.977 36.517 105.177 39.333 104.537 C 71.233 97.249 98.596 100.387 120.67 113.877 C 123.13 115.387 123.91 118.597 122.4 121.057 L 122.4 121.057 Z M 132.65 98.255 C 130.76 101.327 126.74 102.297 123.67 100.407 C 101.16 86.571 66.847 82.564 40.222 90.646 C 36.769 91.689 33.122 89.743 32.074 86.296 C 31.034 82.843 32.981 79.203 36.428 78.153 C 66.841 68.925 104.65 73.395 130.5 89.28 C 133.57 91.17 134.54 95.19 132.65 98.256 L 132.65 98.255 Z M 133.53 74.511 C 106.54 58.48 62.01 57.006 36.241 64.827 C 32.103 66.082 27.727 63.746 26.473 59.608 C 25.219 55.468 27.553 51.095 31.694 49.837 C 61.275 40.857 110.45 42.592 141.524 61.039 C 145.254 63.248 146.474 68.055 144.264 71.772 C 142.064 75.494 137.244 76.721 133.534 74.511 L 133.53 74.511 Z"
                    />
                  </svg>
                </div>`
              : null}
          </div>
        </div>
      </ha-card>
    `;
  }

  // Generate device list
  private generateDeviceList(): TemplateResult {
    const [spotify_connect_devices, chromecast_devices] = this.getFilteredDevices();
    if (spotify_connect_devices.length == 0 && chromecast_devices.length == 0) {
      return html`<p>No devices found</p>`;
    }
    return html`
      ${spotify_connect_devices.length > 0 ? html`<p>Spotify Connect devices</p>` : null}
      ${spotify_connect_devices.map((device) => {
        return html`<a @click=${(elem) => this.spotifyDeviceSelected(elem, device)}>${device.name}</a>`;
      })}
      ${chromecast_devices.length > 0 ? html`<p>Chromecast devices</p>` : null}
      ${chromecast_devices.map((device) => {
        return html`<a @click=${(elem) => this.chromecastDeviceSelected(elem, device)}>${device.friendly_name}</a>`;
      })}
    `;
  }

  // Generate items for display style 'List'
  public generateListView(): TemplateResult {
    const result: TemplateResult[] = [];
    const playlists = this.getPlaylists();
    for (let i = 0; i < playlists.length; i++) {
      const item = playlists[i];
      result.push(html`<div
        class="list-item ${this.isThisPlaylistPlaying(item) ? 'playing' : ''}"
        @click=${(elem) => this.startUri(elem, item.uri)}
      >
        <div class="cover" data-spotify-image-url="${item.images.length > 0 ? item.images[0].url : ''}">
          <svg viewBox="0 0 168 168">
            <path
              d="M 83.996 0.277 C 37.747 0.277 0.253 37.77 0.253 84.019 C 0.253 130.27 37.747 167.76 83.996 167.76 C 130.25 167.76 167.74 130.27 167.74 84.019 C 167.74 37.773 130.25 0.281 83.995 0.281 L 83.996 0.277 L 83.996 0.277 Z M 122.4 121.057 C 120.9 123.517 117.68 124.297 115.22 122.787 C 95.558 110.777 70.806 108.057 41.656 114.717 C 38.847 115.357 36.047 113.597 35.407 110.787 C 34.764 107.977 36.517 105.177 39.333 104.537 C 71.233 97.249 98.596 100.387 120.67 113.877 C 123.13 115.387 123.91 118.597 122.4 121.057 L 122.4 121.057 Z M 132.65 98.255 C 130.76 101.327 126.74 102.297 123.67 100.407 C 101.16 86.571 66.847 82.564 40.222 90.646 C 36.769 91.689 33.122 89.743 32.074 86.296 C 31.034 82.843 32.981 79.203 36.428 78.153 C 66.841 68.925 104.65 73.395 130.5 89.28 C 133.57 91.17 134.54 95.19 132.65 98.256 L 132.65 98.255 Z M 133.53 74.511 C 106.54 58.48 62.01 57.006 36.241 64.827 C 32.103 66.082 27.727 63.746 26.473 59.608 C 25.219 55.468 27.553 51.095 31.694 49.837 C 61.275 40.857 110.45 42.592 141.524 61.039 C 145.254 63.248 146.474 68.055 144.264 71.772 C 142.064 75.494 137.244 76.721 133.534 74.511 L 133.53 74.511 Z"
            />
          </svg>
        </div>
        <p>${item.name}</p>
      </div>`);
    }
    return html`<div>${result}</div>`;
  }

  // Generate items for display style 'Grid'
  public generateGridView(): TemplateResult {
    const result: TemplateResult[] = [];
    const playlists = this.getPlaylists();
    for (let i = 0; i < playlists.length; i++) {
      const item = playlists[i];
      this._spotify_state?.attributes.media_playlist === item.name;
      result.push(html`<div class="grid-item" @click=${(elem) => this.startUri(elem, item.uri)}>
        <div
          class="grid-item-album-image ${this.isThisPlaylistPlaying(item) ? 'playing' : ''}"
          data-spotify-image-url="${item.images.length > 0 ? item.images[0].url : ''}"
        >
          <svg viewBox="0 0 168 168">
            <path
              d="M 83.996 0.277 C 37.747 0.277 0.253 37.77 0.253 84.019 C 0.253 130.27 37.747 167.76 83.996 167.76 C 130.25 167.76 167.74 130.27 167.74 84.019 C 167.74 37.773 130.25 0.281 83.995 0.281 L 83.996 0.277 L 83.996 0.277 Z M 122.4 121.057 C 120.9 123.517 117.68 124.297 115.22 122.787 C 95.558 110.777 70.806 108.057 41.656 114.717 C 38.847 115.357 36.047 113.597 35.407 110.787 C 34.764 107.977 36.517 105.177 39.333 104.537 C 71.233 97.249 98.596 100.387 120.67 113.877 C 123.13 115.387 123.91 118.597 122.4 121.057 L 122.4 121.057 Z M 132.65 98.255 C 130.76 101.327 126.74 102.297 123.67 100.407 C 101.16 86.571 66.847 82.564 40.222 90.646 C 36.769 91.689 33.122 89.743 32.074 86.296 C 31.034 82.843 32.981 79.203 36.428 78.153 C 66.841 68.925 104.65 73.395 130.5 89.28 C 133.57 91.17 134.54 95.19 132.65 98.256 L 132.65 98.255 Z M 133.53 74.511 C 106.54 58.48 62.01 57.006 36.241 64.827 C 32.103 66.082 27.727 63.746 26.473 59.608 C 25.219 55.468 27.553 51.095 31.694 49.837 C 61.275 40.857 110.45 42.592 141.524 61.039 C 145.254 63.248 146.474 68.055 144.264 71.772 C 142.064 75.494 137.244 76.721 133.534 74.511 L 133.53 74.511 Z"
            />
          </svg>
        </div>
      </div>`);
    }

    const configured_grid_width = this.config.grid_covers_per_row ? this.config.grid_covers_per_row : 3;
    const grid_width = (100 - 10) / configured_grid_width;

    return html`<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(${grid_width}%, 1fr));">
      ${result}
    </div>`;
  }

  private onPauseSelect(ev: Event): void {
    this.handleMediaEvent(ev, 'media_pause');
  }

  private onResumeSelect(ev: Event): void {
    this.handleMediaEvent(ev, 'media_play');
  }

  private onNextSelect(ev: Event): void {
    this.handleMediaEvent(ev, 'media_next_track');
  }

  private onPrevSelect(ev: Event): void {
    this.handleMediaEvent(ev, 'media_previous_track');
  }

  // Show warning on top of the card
  private showWarning(warning: string): TemplateResult {
    return html`<hui-warning>${warning}</hui-warning>`;
  }

  static get styles(): CSSResult[] {
    return [SpotifyCard.generalStyles, SpotifyCard.listStyles, SpotifyCard.gridStyles];
  }

  static generalStyles = css`
    *:focus {
      outline: none;
    }

    ha-card {
      --header-height: 2.5em;
      --footer-height: 2.5em;
      padding: 0.5em;
      display: flex;
      flex-direction: column;
    }

    hui-warning {
      position: absolute;
      right: 0;
      left: 0;
      text-align: center;
    }

    #header {
      display: flex;
      height: var(--header-height);
      padding-bottom: 0.5em;
    }
    #header > * {
      display: flex;
      flex: 1;
      align-items: center;
    }

    #header-track {
      overflow: hidden;
      margin: 0;
      margin-left: 0.2em;
    }

    #content {
      border: solid 2px var(--divider-color);
      border-radius: 0.2em;
      overflow: auto;
      padding: 0.2em;
      background-color: var(--primary-background-color);
    }

    #icon {
      justify-content: left;
      padding-left: 0.5em;
      cursor: pointer;
    }

    #icon svg {
      width: 100px;
      fill: var(--primary-text-color);
    }

    #header_name {
      font-size: x-large;
      justify-content: center;
    }

    #footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--footer-height);
      padding: 0.5rem;
      padding-bottom: 0;
    }

    .footer__right {
      display: flex;
      align-items: center;
    }

    .playback-controls {
      display: flex;
    }

    .playback-controls > div {
      height: 2.5em;
    }

    .playback-controls > div:first-child {
      padding-left: 0;
    }

    .playback-controls svg {
      height: 100%;
      cursor: pointer;
    }

    .shuffle > svg {
      fill: var(--primary-color);
    }

    #volume-slider {
      bottom: 3em;
      right: 0.5em;
    }

    #volume-slider > * {
      height: 2.5em;
    }

    .dropdown {
      display: none;
      position: absolute;
      box-shadow: var(--primary-text-color) 0 0 16px 0px;
      z-index: 1;
      background-color: var(--card-background-color);
    }

    .volume:hover + #volume-slider,
    #volume-slider:hover {
      display: block;
    }

    .small-icon {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      padding-left: 10px;
    }

    .small-icon svg {
      height: 2em;
    }

    .controls {
      display: flex;
    }

    .mediaplayer {
      position: relative;
      display: inline-block;
    }

    .mediaplayer_select {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mediaplayer_speaker_icon {
      display: inline-block;
      padding: 3px;
      width: 17px;
      height: 17px;
      margin-right: 10px;
      border: thin solid var(--primary-text-color);
      border-radius: 50%;
    }

    .dropdown-wrapper {
      display: contents;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .dropdown-content {
      left: 1em;
      bottom: 0.5em;
      max-height: calc(100% - 1em);
      overflow-y: auto;
      min-width: 250px;
    }

    .dropdown-content p {
      font-weight: bold;
      padding: 0.5em;
      line-height: 1.5em;
      margin: 0;
    }

    .dropdown-content a {
      color: var(--primary-text-color);
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
    .dropdown-content a:hover {
      box-shadow: inset 0 0 100px 100px var(--secondary-background-color);
    }
    .controls:hover + .dropdown-content:not(.dropdown-content-hide),
    .dropdown-content:hover:not(.dropdown-content-hide) {
      display: block;
    }

    svg {
      fill: var(--primary-text-color);
    }

    @keyframes loading-grid {
      0% {
        box-shadow: rgba(var(--rgb-accent-color), 1) 0 0 0.2em 0.2em;
      }
      50% {
        box-shadow: rgba(var(--rgb-accent-color), 0) 0 0 0.2em 0.2em;
      }
      100% {
        box-shadow: rgba(var(--rgb-accent-color), 1) 0 0 0.2em 0.2em;
      }
    }

    @keyframes loading-list {
      0% {
        background-color: rgba(var(--rgb-accent-color), 1);
      }
      50% {
        background-color: rgba(var(--rgb-accent-color), 0);
      }
      100% {
        background-color: rgba(var(--rgb-accent-color), 1);
      }
    }

    .loading {
      animation-duration: 1.5s;
      animation-iteration-count: 5;
      animation-timing-function: ease-in-out;
    }

    .grid-item.loading {
      animation-name: loading-grid;
    }

    .list-item.loading {
      animation-name: loading-list;
    }
  `;

  //Style definition for the List view
  static listStyles = css`
    ha-card {
      --list-item-height: 3em;
      --placeholder-padding: 4px;
    }

    .list-item {
      /* height: var(--list-item-height); */
      align-items: center;
      border-bottom: solid var(--divider-color) 1px;
      display: flex;
      cursor: pointer;
      margin-right: -0.2em;
      background-clip: content-box;
    }

    .list-item:hover {
      background-color: var(--secondary-background-color);
    }

    .list-item:last-of-type {
      border-bottom: 0;
    }

    .list-item.playing {
      background-color: var(--primary-color);
    }

    .cover {
    }

    .list-item .cover {
      height: var(--list-item-height);
      object-fit: contain;
    }

    .cover > img {
      height: 100%;
      max-width: var(--list-item-height); /* enforce square playlist icons */
    }

    .cover > svg {
      height: calc(var(--list-item-height) - var(--placeholder-padding));
      margin: calc(var(--placeholder-padding) / 2);
    }

    .list-item > p {
      margin: 0 0.5em 0 0.5em;
    }
  `;

  //Style definition for the Grid view
  static gridStyles = css`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
      grid-gap: 0.5em;
    }

    .grid-item {
      position: relative;
      cursor: pointer;
      box-shadow: var(--primary-text-color) 0 0 0.2em;
    }

    .grid-item:hover {
      box-shadow: rgba(var(--rgb-accent-color), 1) 0 0 0.2em 0.2em;
    }

    .grid-item-album-image {
      width: 100%;
      display: grid;
    }

    .grid-item-album-image > img {
      width: 100%;
    }

    .grid-item-album-image > svg {
      width: 100%;
      margin: 10px;
    }

    .grid-item-album-image.playing {
      box-shadow: var(--primary-color) 0 0 0.2em 0.2em;
    }
  `;
}
