import {
  LitElement,
  html,
  customElement,
  property,
  internalProperty,
  TemplateResult,
  CSSResult,
  css,
} from 'lit-element';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';

import { SpotifyCardConfig } from './types';
import { localize } from './localize/localize';
import { HassEntity } from 'home-assistant-js-websocket';

//define tabs of editor
const options = {
  general: {
    icon: 'tune',
    name: localize('settings.general'),
    secondary: localize('settings.general_description'),
    show: true,
  },
  appearance: {
    icon: 'palette',
    name: localize('settings.appearance'),
    secondary: localize('settings.appearance_description'),
    show: false,
  },
  advanced: {
    icon: 'pencil',
    name: localize('settings.advanced'),
    secondary: localize('settings.advanced_description'),
    show: false,
  },
};

export const PLAYLIST_TYPES = ['Default', 'featured', 'discover-weekly'];
export const DISPLAY_STYLES = ['List', 'Grid'];

@customElement('spotify-card-editor')
export class SpotifyCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ type: Object }) public hass!: HomeAssistant;

  @internalProperty() private _config?: SpotifyCardConfig;

  @internalProperty() private _toggle?: boolean;

  accounts: Array<string> = [];
  chromecast_devices: Array<string> = [];

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    const res: any = await this.hass.callWS({
      type: 'spotcast/accounts',
    });
    this.accounts = res;

    const casts: any = await this.hass.callWS({
      type: 'spotcast/castdevices',
    });

    this.chromecast_devices = casts.map((c) => c.friendly_name);
    this.requestUpdate();

    // for (const entityId in this.hass.states) {
  }
  public setConfig(config: SpotifyCardConfig): void {
    this._config = config;
  }

  get _name(): string {
    if (this._config) {
      return this._config.name || '';
    }
    return '';
  }

  get _account(): string {
    if (this._config) {
      return this._config.account || 'default';
    }
    return '';
  }

  get _spotify_entity(): string {
    if (this._config) {
      const auto_detected = this.getMediaPlayerEntities().filter((e) => e.entity_id.includes('spotify'));
      return this._config.spotify_entity || (auto_detected.length > 0 ? auto_detected[0].entity_id : '');
    }
    return '';
  }

  get _country_code(): string {
    if (this._config) {
      return this._config.country_code || '';
    }
    return '';
  }

  get _limit(): number {
    if (this._config) {
      return this._config.limit || 10;
    }
    return 10;
  }

  get _playlist_type(): string {
    if (this._config) {
      return this._config.playlist_type || 'Default';
    }
    return '';
  }

  get _always_play_random_song(): boolean {
    if (this._config) {
      return this._config.always_play_random_song || false;
    }
    return false;
  }

  get _height(): string | number {
    if (this._config) {
      return this._config.height || '';
    }
    return '';
  }

  get _display_style(): string {
    if (this._config) {
      return this._config.display_style || 'List';
    }
    return 'List';
  }

  get _grid_covers_per_row(): number {
    if (this._config) {
      return this._config.grid_covers_per_row || 5;
    }
    return 5;
  }

  get _grid_center_covers(): boolean {
    if (this._config) {
      return this._config.grid_center_covers || false;
    }
    return false;
  }

  get _hide_warning(): boolean {
    if (this._config) {
      return this._config.hide_warning || false;
    }
    return false;
  }

  get _show_warning(): boolean {
    if (this._config) {
      return this._config.show_warning || false;
    }
    return false;
  }

  get _show_error(): boolean {
    if (this._config) {
      return this._config.show_error || false;
    }
    return false;
  }

  get _default_device(): string {
    if (this._config) {
      return this._config.default_device || '';
    }
    return '';
  }

  get _filter_devices(): string {
    if (this._config) {
      return this._config.filter_devices?.toString() || '';
    }
    return '';
  }

  private getMediaPlayerEntities(): Array<HassEntity> {
    return Object.keys(this.hass.states)
      .map((key) => this.hass.states[key])
      .filter((ent) => ent.entity_id.match('media_player[.]'));
  }

  private renderGeneral(): TemplateResult {
    const media_player_entities = this.getMediaPlayerEntities().map((e) => e.entity_id);

    return html`
      <div class="values">
        <div>
          <paper-dropdown-menu
            label=${localize('settings.account')}
            @value-changed=${this._valueChanged}
            .configValue=${'account'}
            class="dropdown"
          >
            <paper-listbox slot="dropdown-content" .selected=${this.accounts.indexOf(this._account)}>
              ${this.accounts.map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-dropdown-menu
            label=${localize('settings.spotify_entity')}
            @value-changed=${this._valueChanged}
            .configValue=${'spotify_entity'}
            class="dropdown"
          >
            <paper-listbox slot="dropdown-content" .selected=${media_player_entities.indexOf(this._spotify_entity)}>
              ${media_player_entities.map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-dropdown-menu
            label=${localize('settings.playlist_type')}
            @value-changed=${this._valueChanged}
            .configValue=${'playlist_type'}
            class="dropdown"
          >
            <paper-listbox slot="dropdown-content" .selected=${PLAYLIST_TYPES.indexOf(this._playlist_type)}>
              ${PLAYLIST_TYPES.map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <div>${localize('settings.limit')}</div>
          <paper-slider
            .value=${this._limit}
            .configValue=${'limit'}
            @value-changed=${this._valueChanged}
            max="50"
            editable
            pin
          ></paper-slider>
        </div>
        <div>
          <paper-input
            label=${localize('settings.height')}
            .value=${this._height}
            .configValue=${'height'}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
        <div>
          <paper-input
            label=${localize('settings.country_code')}
            .value=${this._country_code}
            .configValue=${'country_code'}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
        <div>
          <ha-switch
            aria-label=${`Toggle always_play_random_song ${this._hide_warning ? 'off' : 'on'}`}
            .checked=${this._always_play_random_song}
            .configValue=${'always_play_random_song'}
            @change=${this._valueChanged}
            .id=${'always_play_random_song'}
          ></ha-switch>
          <label for=${'always_play_random_song'}>${localize('settings.always_play_random_song')}</label>
        </div>
        <div>
          <paper-input
            label=${localize('settings.default_device')}
            .value=${this._default_device}
            .configValue=${'default_device'}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
      </div>
    `;
  }

  private renderAppearance(): TemplateResult {
    return html`
      <div class="values">
        <div>
          <ha-switch
            aria-label=${`Toogle Warnings ${this._hide_warning ? 'off' : 'on'}`}
            .checked=${this._hide_warning}
            .configValue=${'hide_warning'}
            @change=${this._valueChanged}
            .id=${'hide_warning'}
          ></ha-switch>
          <label for=${'hide_warning'}>${localize('settings.hide_warning')}</label>
        </div>
        <div>
          <paper-input
            label=${localize('settings.title')}
            .value=${this._name}
            .configValue=${'name'}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
        <div>
          <paper-dropdown-menu
            label=${localize('settings.display_style')}
            @value-changed=${this._valueChanged}
            .configValue=${'display_style'}
            class="dropdown"
          >
            <paper-listbox slot="dropdown-content" .selected=${DISPLAY_STYLES.indexOf(this._display_style)}>
              ${DISPLAY_STYLES.map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <div>${localize('settings.grid_covers_per_row')}</div>
          <paper-slider
            .value=${this._grid_covers_per_row}
            .configValue=${'grid_covers_per_row'}
            @value-changed=${this._valueChanged}
            max="10"
            min="1"
            editable
            pin
          ></paper-slider>
        </div>
        <div>
          <ha-switch
            aria-label=${`Toggle grid_center_covers ${this._hide_warning ? 'off' : 'on'}`}
            .checked=${this._grid_center_covers}
            .configValue=${'grid_center_covers'}
            @change=${this._valueChanged}
            .id=${'grid_center_covers'}
          ></ha-switch>
          <label for=${'grid_center_covers'}>${localize('settings.grid_center_covers')}</label>
        </div>
      </div>
    `;
  }

  private renderAdvanced(): TemplateResult {
    return html`
      <div class="values">
        <div>
          <paper-input
            label=${localize('settings.filter_devices')}
            .value=${this._filter_devices}
            .configValue=${'filter_devices'}
            @value-changed=${this._valueChanged}
          ></paper-input>
        </div>
      </div>
    `;
  }

  protected render(): TemplateResult | void {
    if (!this.hass) {
      return html``;
    }

    return html`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${'general'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.general.icon}`}></ha-icon>
            <div class="title">${options.general.name}</div>
          </div>
          <div class="secondary">${options.general.secondary}</div>
        </div>
        ${options.general.show ? this.renderGeneral() : ''}
        <div class="option" @click=${this._toggleOption} .option=${'appearance'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.appearance.icon}`}></ha-icon>
            <div class="title">${options.appearance.name}</div>
          </div>
          <div class="secondary">${options.appearance.secondary}</div>
        </div>
        ${options.appearance.show ? this.renderAppearance() : ''}
        <div class="option" @click=${this._toggleOption} .option=${'advanced'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.advanced.icon}`}></ha-icon>
            <div class="title">${options.advanced.name}</div>
          </div>
          <div class="secondary">${options.advanced.secondary}</div>
        </div>
        ${options.advanced.show ? this.renderAdvanced() : ''}
      </div>
    `;
  }

  private _toggleOption(ev): void {
    this._toggleThing(ev, options);
  }

  private _toggleThing(ev, optionList): void {
    const show = !optionList[ev.target.option].show;
    for (const [key] of Object.entries(optionList)) {
      optionList[key].show = false;
    }
    optionList[ev.target.option].show = show;
    this._toggle = !this._toggle;
  }

  private _valueChanged(ev): void {
    // ev.target.offsetParent checks if editor visible or freetext input is used
    if (!this._config || !this.hass || ev.target.offsetParent === null) {
      return;
    }
    const { target } = ev;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      // Delete item if false or empty
      if (target.checked === false || target.value === '') {
        const clone = { ...this._config };
        delete clone[target.configValue];
        this._config = clone;
      } else {
        let target_value = target.value;
        if (target.configValue == 'height') {
          target_value = Number(target_value);
        } else if (target.configValue == 'filter_devices' && target_value != '') {
          target_value = target_value
            .split(',')
            .map((value: string) => {
              return value.trim();
            })
            .filter((value: string) => {
              return value != '';
            });
        }
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target_value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
    this.requestUpdate(target.configValue);
  }

  // Value changed for lists
  private _valueChangedForList(ev: any): void {
    if (!this._config || !this.hass) {
      return;
    }

    const { checked } = ev.currentTarget;
    const configValue = ev.target.configValue;
    const value = ev.target.innerText;

    const config = JSON.parse(JSON.stringify(this._config));
    if (!config[configValue]) {
      config[configValue] = [];
    }
    if (checked) {
      if (!config[configValue].includes(value)) {
        config[configValue].push(value);
      }
    } else {
      config[configValue] = config[configValue].filter((d) => d !== value);
    }

    fireEvent(this, 'config-changed', { config: config });
    this.requestUpdate(configValue);
  }

  static get styles(): CSSResult {
    return css`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        background: var(--secondary-background-color);
      }

      .values > * {
        padding-top: 16px;
        padding-left: 16px;
        border-bottom: solid var(--divider-color) 2px;
      }

      .values > *:last-child {
        border-bottom: 0;
      }

      .dropdown {
        width: 40%;
      }

      .filter_grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        row-gap: 20px;
        padding-bottom: 10px;
      }

      .filter_grid > .filter_grid--title {
        grid-column: span 3;
      }

      ha-switch {
        padding-bottom: 8px;
      }

      paper-input {
        margin-top: -1em;
      }

      paper-slider {
        width: auto;
      }
    `;
  }
}
