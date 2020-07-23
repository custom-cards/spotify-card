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

import { HomeAssistant, LovelaceCardEditor, getLovelace } from 'custom-card-helpers';
import { servicesColl, subscribeEntities, HassEntities, HassEntity } from 'home-assistant-js-websocket';
import { PLAYLIST_TYPES, DISPLAY_STYLES } from './editor';

import { SpotcastConnector } from './spotcast-connector';

import { SpotifyCardConfig } from './types';
import CARD_VERSION from './const';

import { localize } from './localize/localize';

// Display card verion in console
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

@customElement('spotify-card')
export class SpotifyCard extends LitElement {
  // Calls the editor
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('spotify-card-editor') as LovelaceCardEditor;
  }

  // Returns default config for Lovelace picker
  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  @property() public hass!: HomeAssistant;

  @property({ type: Object })
  public config!: SpotifyCardConfig;

  @internalProperty()
  private spotcast_connector!: SpotcastConnector;

  // Private variables
  private spotcast_installed = false;

  private spotify_installed = false;

  private spotify_state?: HassEntity;

  private fetch_time_out: any = 0;

  private unsubscribe_entitites?: any;

  doSubscribeEntities(): void {
    if (this.hass?.connection && !this.unsubscribe_entitites && this.isConnected) {
      this.unsubscribe_entitites = subscribeEntities(this.hass.connection, (entities) =>
        this.entitiesUpdated(entities)
      );
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.spotcast_connector = new SpotcastConnector(this);
    //get all available entities and when they update
    this.doSubscribeEntities();
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    this.doSubscribeEntities();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unsubscribe_entitites && this.unsubscribe_entitites();
  }

  //Callback when hass-entity has changed
  entitiesUpdated(entities: HassEntities): void {
    let updateDevices = false;
    for (const item in entities) {
      // Are there any changes to media players
      if (item.startsWith('media_player')) {
        // Get spotify state
        if (item.startsWith('media_player.spotify_') || item == this.config.spotify_entity) {
          this.spotify_installed = true;
          this.spotify_state = entities[item];
        }
        updateDevices = true;
      }
    }
    if (updateDevices && !document.hidden) {
      // Debounce updates to 500ms
      if (this.fetch_time_out) {
        clearTimeout(this.fetch_time_out);
      }
      this.fetch_time_out = setTimeout(() => {
        this.spotcast_connector.updateState().then(() => {
          this.requestUpdate();
        });
      }, 500);
    }
  }

  public getSpotifyEntityState(): string {
    return this.spotify_state ? this.spotify_state.state : '';
  }

  public setConfig(_config: SpotifyCardConfig): void {
    //Check for errors in config
    let var_error = '';
    if (_config.limit && !(typeof _config.limit === 'number')) {
      var_error = 'limit';
    }
    if (_config.playlist_type && !PLAYLIST_TYPES.includes(_config.playlist_type)) {
      var_error = 'playlist_type';
    }
    if (_config.country_code && !(typeof _config.country_code === 'string')) {
      var_error = 'country_code';
    }
    if (_config.height && !(typeof _config.height === 'number')) {
      var_error = 'height';
    }
    if (_config.display_style && !DISPLAY_STYLES.includes(_config.display_style)) {
      var_error = 'display_style';
    }
    if (_config.darkmode && !(typeof _config.darkmode === 'boolean')) {
      var_error = 'darkmode';
    }

    // Show error if neccessary
    if (_config.show_error || var_error != '') {
      throw new Error(localize('common.invalid_configuration') + ': ' + var_error);
    }

    // Convenience mode for developing
    if (_config.test_gui) {
      getLovelace().setEditMode(true);
    }
    this.config = {
      ..._config,
    };
  }

  private spotifyDeviceSelected(device: any): void {
    const current_player = this.spotcast_connector.getCurrentPlayer();
    if (current_player) {
      return this.spotcast_connector.transferPlaybackToConnectDevice(device.id);
    }
    const playlist = this.spotcast_connector.playlists[0];
    console.log('spotifyDeviceSelected playing first playlist');
    this.spotcast_connector.playUriOnConnectDevice(device.id, playlist.uri);
  }

  private chromecastDeviceSelected(device: any): void {
    const current_player = this.spotcast_connector.getCurrentPlayer();
    if (current_player) {
      return this.spotcast_connector.transferPlaybackToCastDevice(device.friendly_name);
    }

    const playlist = this.spotcast_connector.playlists[0];
    console.log('chromecastDeviceSelected playing first playlist');
    this.spotcast_connector.playUriOnCastDevice(device.friendly_name, playlist.uri);
  }

  private onShuffleSelect(): void {
    if (this.spotify_state?.state == 'playing') {
      this.hass.callService('media_player', 'shuffle_set', {
        entity_id: this.spotify_state.entity_id,
        shuffle: !this.spotcast_connector.player?.shuffle_state,
      });
    }
  }

  private handlePlayPauseEvent(ev: Event, command: string) {
    ev.stopPropagation();
    if (this.spotify_state) {
      this.hass.callService('media_player', command, { entity_id: this.spotify_state.entity_id });
    }
  }

  private onPauseSelect(ev: Event): void {
    this.handlePlayPauseEvent(ev, 'media_pause');
  }

  private onResumeSelect(ev: Event): void {
    this.handlePlayPauseEvent(ev, 'media_play');
  }

  protected render(): TemplateResult | void {
    let warning = html``;

    if (!this.spotcast_installed) {
      // Check for installed spotcast
      if (this.hass.connection && servicesColl(this.hass.connection).state.spotcast !== undefined) {
        this.spotcast_installed = true;
      }
    }

    if (this.config.show_warning) {
      warning = this.showWarning(localize('common.show_warning'));
    }
    if (!this.spotcast_installed) {
      warning = this.showWarning(localize('common.show_missing_spotcast'));
    }

    if (!this.spotify_installed) {
      warning = this.showWarning(localize('common.show_missing_spotify'));
    }

    // Display loading screen if no content available yet
    let content = html`<div>Loading...</div>`;
    // Request playlist data from spotcast
    if (!this.spotcast_connector.is_loading() && this.spotcast_installed) {
      this.spotcast_connector.fetchPlaylists().then(() => {
        this.requestUpdate();
      });
    } else {
      // Display spotify playlists
      if (this.config.display_style?.toLowerCase() == 'grid') {
        content = this.generateGridView();
      } else {
        content = this.generateListView();
      }
    }

    const spotify_player_device = this.spotcast_connector.getCurrentPlayer();
    const playing_text = spotify_player_device?.name ?? localize('common.choose_player');

    return html`
      <ha-card tabindex="0" style="${this.config.height ? `height: ${this.config.height}px` : ''}"
        >${this.config.hide_warning ? '' : warning}
        <div id="header">
          <div id="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 559 168">
              <path
                d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.288 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.802c-1.89 3.072-5.91 4.042-8.98 2.152-22.51-13.836-56.823-17.843-83.448-9.761-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739zm94.56 3.072c-14.46-3.448-17.03-5.868-17.03-10.953 0-4.804 4.52-8.037 11.25-8.037 6.52 0 12.98 2.455 19.76 7.509 0.2 0.153 0.46 0.214 0.71 0.174 0.26-0.038 0.48-0.177 0.63-0.386l7.06-9.952c0.29-0.41 0.21-0.975-0.18-1.288-8.07-6.473-17.15-9.62-27.77-9.62-15.61 0-26.52 9.369-26.52 22.774 0 14.375 9.41 19.465 25.67 23.394 13.83 3.187 16.17 5.857 16.17 10.629 0 5.29-4.72 8.58-12.32 8.58-8.44 0-15.33-2.85-23.03-9.51-0.19-0.17-0.45-0.24-0.69-0.23-0.26 0.02-0.49 0.14-0.65 0.33l-7.92 9.42c-0.33 0.4-0.29 0.98 0.09 1.32 8.96 8 19.98 12.22 31.88 12.22 16.82 0 27.69-9.19 27.69-23.42 0.03-12.007-7.16-18.657-24.77-22.941l-0.03-0.013zm62.86-14.26c-7.29 0-13.27 2.872-18.21 8.757v-6.624c0-0.523-0.42-0.949-0.94-0.949h-12.95c-0.52 0-0.94 0.426-0.94 0.949v73.601c0 0.52 0.42 0.95 0.94 0.95h12.95c0.52 0 0.94-0.43 0.94-0.95v-23.23c4.94 5.53 10.92 8.24 18.21 8.24 13.55 0 27.27-10.43 27.27-30.369 0.02-19.943-13.7-30.376-27.26-30.376l-0.01 0.001zm12.21 30.375c0 10.149-6.25 17.239-15.21 17.239-8.85 0-15.53-7.41-15.53-17.239 0-9.83 6.68-17.238 15.53-17.238 8.81-0.001 15.21 7.247 15.21 17.237v0.001zm50.21-30.375c-17.45 0-31.12 13.436-31.12 30.592 0 16.972 13.58 30.262 30.91 30.262 17.51 0 31.22-13.39 31.22-30.479 0-17.031-13.62-30.373-31.01-30.373v-0.002zm0 47.714c-9.28 0-16.28-7.46-16.28-17.344 0-9.929 6.76-17.134 16.07-17.134 9.34 0 16.38 7.457 16.38 17.351 0 9.927-6.8 17.127-16.17 17.127zm68.27-46.53h-14.25v-14.566c0-0.522-0.42-0.948-0.94-0.948h-12.95c-0.52 0-0.95 0.426-0.95 0.948v14.566h-6.22c-0.52 0-0.94 0.426-0.94 0.949v11.127c0 0.522 0.42 0.949 0.94 0.949h6.22v28.795c0 11.63 5.79 17.53 17.22 17.53 4.64 0 8.49-0.96 12.12-3.02 0.3-0.16 0.48-0.48 0.48-0.82v-10.6c0-0.32-0.17-0.63-0.45-0.8-0.28-0.18-0.63-0.19-0.92-0.04-2.49 1.25-4.9 1.83-7.6 1.83-4.15 0-6.01-1.89-6.01-6.11v-26.76h14.25c0.52 0 0.94-0.426 0.94-0.949v-11.126c0.02-0.523-0.4-0.949-0.93-0.949l-0.01-0.006zm49.64 0.057v-1.789c0-5.263 2.02-7.61 6.54-7.61 2.7 0 4.87 0.536 7.3 1.346 0.3 0.094 0.61 0.047 0.85-0.132 0.25-0.179 0.39-0.466 0.39-0.77v-10.91c0-0.417-0.26-0.786-0.67-0.909-2.56-0.763-5.84-1.546-10.76-1.546-11.95 0-18.28 6.734-18.28 19.467v2.74h-6.22c-0.52 0-0.95 0.426-0.95 0.948v11.184c0 0.522 0.43 0.949 0.95 0.949h6.22v44.405c0 0.53 0.43 0.95 0.95 0.95h12.94c0.53 0 0.95-0.42 0.95-0.95v-44.402h12.09l18.52 44.402c-2.1 4.66-4.17 5.59-6.99 5.59-2.28 0-4.69-0.68-7.14-2.03-0.23-0.12-0.51-0.14-0.75-0.07-0.25 0.09-0.46 0.27-0.56 0.51l-4.39 9.63c-0.21 0.46-0.03 0.99 0.41 1.23 4.58 2.48 8.71 3.54 13.82 3.54 9.56 0 14.85-4.46 19.5-16.44l22.46-58.037c0.12-0.292 0.08-0.622-0.1-0.881-0.17-0.257-0.46-0.412-0.77-0.412h-13.48c-0.41 0-0.77 0.257-0.9 0.636l-13.81 39.434-15.12-39.46c-0.14-0.367-0.49-0.61-0.88-0.61h-22.12v-0.003zm-28.78-0.057h-12.95c-0.52 0-0.95 0.426-0.95 0.949v56.481c0 0.53 0.43 0.95 0.95 0.95h12.95c0.52 0 0.95-0.42 0.95-0.95v-56.477c0-0.523-0.42-0.949-0.95-0.949v-0.004zm-6.4-25.719c-5.13 0-9.29 4.152-9.29 9.281 0 5.132 4.16 9.289 9.29 9.289s9.28-4.157 9.28-9.289c0-5.128-4.16-9.281-9.28-9.281zm113.42 43.88c-5.12 0-9.11-4.115-9.11-9.112s4.04-9.159 9.16-9.159 9.11 4.114 9.11 9.107c0 4.997-4.04 9.164-9.16 9.164zm0.05-17.365c-4.67 0-8.2 3.71-8.2 8.253 0 4.541 3.51 8.201 8.15 8.201 4.67 0 8.2-3.707 8.2-8.253 0-4.541-3.51-8.201-8.15-8.201zm2.02 9.138l2.58 3.608h-2.18l-2.32-3.31h-1.99v3.31h-1.82v-9.564h4.26c2.23 0 3.69 1.137 3.69 3.051 0.01 1.568-0.9 2.526-2.21 2.905h-0.01zm-1.54-4.315h-2.37v3.025h2.37c1.18 0 1.89-0.579 1.89-1.514 0-0.984-0.71-1.511-1.89-1.511z"
              />
            </svg>
          </div>
          ${this.config.name ? html`<div id="header_name">${this.config.name}</div>` : ''}
          <div></div>
        </div>
        <div id="content">
          ${content}
        </div>
        <div id="footer">
          <div class="dropdown-wrapper">
            <div class="controls">
              <div class="dropdown">
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
                  ${playing_text}
                </div>
              </div>
            </div>
            ${this.generateDeviceList()}
          </div>
          <div class="footer__right">
            ${this.spotify_state?.state == 'playing'
              ? html`<div
                  class="icon ${this.spotcast_connector.player?.shuffle_state ? 'playing' : ''}"
                  @click=${this.onShuffleSelect}
                >
                  <svg width="24" height="24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"
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
    const hidden = this.config.hidden_cast_devices ?? [];

    return html`
      <div class="dropdown-content">
        <p>Spotify Connect devices</p>
        ${this.spotcast_connector.devices.map(
          (device) => html` <a @click=${() => this.spotifyDeviceSelected(device)}>${device.name}</a> `
        )}
        ${this.spotcast_connector.chromecast_devices.length ? html`<p>Chromecast devices</p>` : null}
        ${this.spotcast_connector.chromecast_devices.map((device) => {
          return hidden.includes(device.friendly_name)
            ? null
            : html`<a @click=${() => this.chromecastDeviceSelected(device)}>${device.friendly_name}</a>`;
        })}
      </div>
    `;
  }

  private generateButtonForCurrent(): TemplateResult {
    if (this.spotify_state?.state == 'playing') {
      return html`<div class="icon playing" @click=${this.onPauseSelect}>
        <svg width="24" height="24" viewBox="0 0 500 1000">
          <path d="M0 832h192V192H0V832zM320 192v640h192V192H320z" />
        </svg>
      </div>`;
    } else {
      return html`<div class="icon playing" @click=${this.onResumeSelect}>
        <svg width="24" height="24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>`;
    }
  }

  // Generate items for display style 'List'
  public generateListView(): TemplateResult {
    if (this.spotcast_connector.is_loaded()) {
      const result: TemplateResult[] = [];
      for (let i = 0; i < this.spotcast_connector.playlists.length; i++) {
        const item = this.spotcast_connector.playlists[i];
        const playing = this.spotify_state?.attributes.media_playlist === item.name;

        result.push(html`<div class="list-item" @click=${() => this.spotcast_connector.playUri(item.uri)}>
          <img src="${item.images[item.images.length - 1].url}" />

          ${playing
            ? this.generateButtonForCurrent()
            : html`<div class="icon">
                <svg width="24" height="24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>`}

          <p>${item.name}</p>
        </div>`);
      }
      return html`<div>${result}</div>`;
    }
    return html``;
  }

  private generateGridIconForCurrent(): TemplateResult {
    if (this.spotify_state?.state == 'playing') {
      return html` <svg width="24" height="24" viewBox="0 0 500 1000" @click=${this.onPauseSelect}>
        <path d="M0 832h192V192H0V832zM320 192v640h192V192H320z" />
      </svg>`;
    } else {
      return html` <svg width="24" height="24" @click=${this.onResumeSelect}>
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M8 5v14l11-7z" />
      </svg>`;
    }
  }

  // Generate items for display style 'Grid'
  public generateGridView(): TemplateResult {
    if (!this.spotcast_connector.is_loaded()) {
      return html``;
    }

    const result: TemplateResult[] = [];
    for (let i = 0; i < this.spotcast_connector.playlists.length; i++) {
      const item = this.spotcast_connector.playlists[i];
      const playing = this.spotify_state?.attributes.media_playlist === item.name;
      this.spotify_state?.attributes.media_playlist === item.name;

      result.push(html`<div class="grid-item" @click=${() => this.spotcast_connector.playUri(item.uri)}>
        <img
          class="grid-item-album-image ${playing ? 'playing' : ''}"
          src="${item.images[item.images.length - 1].url}"
        />
        <div class="grid-item-overlay-icon">
          ${playing
            ? this.generateGridIconForCurrent()
            : html`
                <svg width="24" height="24" @click=${() => this.spotcast_connector.playUri(item.uri)}>
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 5v14l11-7z" />
                </svg>
              `}
        </div>
      </div>`);
    }

    const configured_grid_width = this.config.grid_covers_per_row ? this.config.grid_covers_per_row : 3;
    const grid_width = (100 - 10) / configured_grid_width;

    return html`<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(${grid_width}%, 1fr));">
      ${result}
    </div>`;
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
      --header-height: 4em;
      --footer-height: 3.5em;
      padding-left: 0.5em;
      padding-right: 0.5em;
    }

    #header {
      display: flex;
      height: var(--header-height);
    }
    #header > * {
      display: flex;
      flex-grow: 1;
      align-items: center;
    }

    #content {
      height: calc(100% - var(--header-height) - var(--footer-height));
      border: solid 2px var(--divider-color);
      border-radius: 0.2em;
      overflow: auto;
      padding: 0.2em;
      background-color: var(--primary-background-color);
    }

    #icon {
      justify-content: left;
      flex-grow: 0;
      flex-shrink: 1;
      padding-left: 0.5em;
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
    }

    .footer__right {
      padding-right: 15px;
    }

    .controls {
      padding: 0.5em;
    }

    .dropdown {
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

    .mediaplayer_speaker_icon > path {
      fill: var(--primary-text-color);
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
      display: none;
      position: absolute;
      left: 1em;
      bottom: 0.5em;
      max-height: calc(100% - 1em);
      overflow-y: auto;
      background-color: var(--card-background-color);
      min-width: 250px;
      box-shadow: var(--primary-text-color) 0 0 16px 0px;
      z-index: 1;
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
    .controls:hover + .dropdown-content,
    .dropdown-content:hover {
      display: block;
    }

    .icon > svg {
      fill: var(--primary-text-color);
    }

    .icon.playing > svg {
      fill: var(--primary-color) !important;
    }
  `;

  //Style definition for the List view
  static listStyles = css`
    ha-card {
      --list-item-height: 3em;
      --spotify-color: #1db954;
    }

    .list-item {
      /* height: var(--list-item-height); */
      align-items: center;
      border-bottom: solid var(--divider-color) 1px;
      display: flex;
      cursor: pointer;
    }

    .list-item:hover {
      background-color: var(--secondary-background-color);
    }

    .list-item:last-of-type {
      border-bottom: 0;
    }

    .list-item > img {
      height: var(--list-item-height);
      object-fit: contain;
    }

    .list-item > .icon {
      height: var(--list-item-height);
      width: var(--list-item-height);
      min-height: var(--list-item-height);
      min-width: var(--list-item-height);
      display: flex;
      justify-content: center;
      align-items: center;
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
      grid-gap: 5px;
    }

    .grid-item {
      position: relative;
      cursor: pointer;
    }

    .grid-item-album-image {
      width: 100%;
      height: auto;
      box-shadow: var(--primary-text-color) 0 0 0.2em;
    }

    .grid-item-album-image.playing {
      box-shadow: var(--primary-color) 0 0 0.2em 0.2em;
    }

    .grid-item-overlay-icon {
      position: absolute;
      top: calc(50% - 12px);
      left: calc(50% - 12px);
      transition: transform 0.2s;
      transform: scale(1.5);
      opacity: 0.7;
    }

    .grid-item-overlay-icon:hover {
      transform: scale(2);
      opacity: 1;
    }
    .grid-item-overlay-icon > svg {
      fill: white;
    }
  `;
}
