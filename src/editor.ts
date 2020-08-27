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
import { HomeAssistant, LovelaceCardEditor, fireEvent } from 'custom-card-helpers';

import {
  SpotifyCardConfig,
  ConfigEntry,
  DisplayStyle,
  PlaylistType,
  ChromecastDevice,
  ValueChangedEvent,
} from './types';
import { localize } from './localize/localize';

export const PLAYLIST_TYPES = ['default', 'featured', 'discover-weekly'];

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

@customElement('spotify-card-editor')
export class SpotifyCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ type: Object }) public hass!: HomeAssistant;

  @internalProperty() private config?: SpotifyCardConfig;

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

    this.chromecast_devices = casts?.map((c: ChromecastDevice) => c.friendly_name);
    this.requestUpdate();
  }

  public setConfig(_config: SpotifyCardConfig): void {
    this.config = _config;
  }

  public getMediaPlayerEntities(): Array<string> {
    return Object.values(this.hass.states)
      .filter((ent) => ent.entity_id.match('media_player[.]'))
      .map((e) => e.entity_id);
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

  public valueChanged(ev: ValueChangedEvent): void {
    // ev.target.offsetParent checks if this visible or freetext input is used
    if (!this.config || !this.hass || ev.target.offsetParent === null) {
      return;
    }
    const { target } = ev;
    if (target.value && this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      // Delete item if false or empty
      if (target.checked === false || target.value === '') {
        const clone = { ...this.config };
        delete clone[target.configValue];
        this.config = clone;
      } else {
        let target_value = target.value;
        if (target.configValue == 'height') {
          target_value = Number(target_value);
        } else if (target.configValue == 'filter_devices') {
          target_value = target_value
            .split(',')
            .map((value: string) => {
              return value.trim();
            })
            .filter((value: string) => {
              return value != '';
            });
        }
        this.config = {
          ...this.config,
          [target.configValue]: target.checked !== undefined ? target.checked : target_value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this.config });
    this.requestUpdate(target.configValue);
  }

  public getValue(value: ConfigEntry): any {
    switch (value) {
      case ConfigEntry.Name:
        return this.config?.name ?? '';
      case ConfigEntry.Account:
        return this.config?.account ?? 'default';
      case ConfigEntry.Spotify_Entity:
        // eslint-disable-next-line no-case-declarations
        const auto_detected = this.getMediaPlayerEntities().filter((e) => e.includes('spotify'));
        return this.config?.spotify_entity ?? (auto_detected.length > 0 ? auto_detected[0] : '');
      case ConfigEntry.Country_Code:
        return this.config?.country_code ?? '';
      case ConfigEntry.Limit:
        return this.config?.limit ?? 10;
      case ConfigEntry.Playlist_Type:
        return this.config?.playlist_type ?? 'default';
      case ConfigEntry.Always_Play_Random_Song:
        return this.config?.always_play_random_song ?? false;
      case ConfigEntry.Height:
        return this.config?.height ?? '';
      case ConfigEntry.Display_Style:
        return this.config?.display_style ?? 'list';
      case ConfigEntry.Grid_Covers_Per_Row:
        return this.config?.grid_covers_per_row ?? 5;
      case ConfigEntry.Grid_Center_Covers:
        return this.config?.grid_center_covers ?? false;
      case ConfigEntry.Hide_Warning:
        return this.config?.hide_warning ?? false;
      case ConfigEntry.Default_Device:
        return this.config?.default_device ?? '';
      case ConfigEntry.Filter_Devices:
        return this.config?.filter_devices?.toString() ?? '';

      default:
        break;
    }
  }

  private renderGeneral(): TemplateResult {
    const media_player_entities = this.getMediaPlayerEntities();
    return html`
      <div class="values">
        <div>
          <paper-dropdown-menu
            label=${localize('settings.account')}
            @value-changed=${this.valueChanged}
            .configValue=${'account'}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${this.accounts.indexOf(this.getValue(ConfigEntry.Account))}
            >
              ${this.accounts.map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <paper-dropdown-menu
            label=${localize('settings.spotify_entity')}
            @value-changed=${this.valueChanged}
            .configValue=${'spotify_entity'}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${media_player_entities.indexOf(this.getValue(ConfigEntry.Spotify_Entity))}
            >
              ${media_player_entities.map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <paper-dropdown-menu
            label=${localize('settings.playlist_type')}
            @value-changed=${this.valueChanged}
            .configValue=${'playlist_type'}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${(Object.values(PlaylistType) as Array<string>).indexOf(
                this.getValue(ConfigEntry.Playlist_Type)
              )}
            >
              ${(Object.values(PlaylistType) as Array<string>).map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <div>${localize('settings.limit')}</div>
          <paper-slider
            .value=${this.getValue(ConfigEntry.Limit)}
            .configValue=${'limit'}
            @value-changed=${this.valueChanged}
            max="50"
            editable
            pin
          ></paper-slider>
        </div>
        <div>
          <paper-input
            label=${localize('settings.height')}
            .value=${this.getValue(ConfigEntry.Height)}
            .configValue=${'height'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
        <div>
          <paper-input
            label=${localize('settings.country_code')}
            .value=${this.getValue(ConfigEntry.Country_Code)}
            .configValue=${'country_code'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
        <div>
          <ha-switch
            .checked=${this.getValue(ConfigEntry.Always_Play_Random_Song)}
            .configValue=${'always_play_random_song'}
            @change=${this.valueChanged}
            .id=${'always_play_random_song'}
          ></ha-switch>
          <label for=${'always_play_random_song'}>${localize('settings.always_play_random_song')}</label>
        </div>
        <div>
          <paper-input
            label=${localize('settings.default_device')}
            .value=${this.getValue(ConfigEntry.Default_Device)}
            .configValue=${'default_device'}
            @value-changed=${this.valueChanged}
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
            .checked=${this.getValue(ConfigEntry.Hide_Warning)}
            .configValue=${'hide_warning'}
            @change=${this.valueChanged}
            .id=${'hide_warning'}
          ></ha-switch>
          <label for=${'hide_warning'}>${localize('settings.hide_warning')}</label>
        </div>
        <div>
          <paper-input
            label=${localize('settings.title')}
            .value=${this.getValue(ConfigEntry.Name)}
            .configValue=${'name'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
        <div>
          <paper-dropdown-menu
            label=${localize('settings.display_style')}
            @value-changed=${this.valueChanged}
            .configValue=${'display_style'}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${(Object.values(DisplayStyle) as Array<string>).indexOf(
                this.getValue(ConfigEntry.Display_Style)
              )}
            >
              ${(Object.values(DisplayStyle) as Array<string>).map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <div>${localize('settings.grid_covers_per_row')}</div>
          <paper-slider
            .value=${this.getValue(ConfigEntry.Grid_Covers_Per_Row)}
            .configValue=${'grid_covers_per_row'}
            @value-changed=${this.valueChanged}
            max="10"
            min="1"
            editable
            pin
          ></paper-slider>
        </div>
        <div>
          <ha-switch
            .checked=${this.getValue(ConfigEntry.Grid_Center_Covers)}
            .configValue=${'grid_center_covers'}
            @change=${this.valueChanged}
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
            .value=${this.getValue(ConfigEntry.Filter_Devices)}
            .configValue=${'filter_devices'}
            @value-changed=${this.valueChanged}
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
