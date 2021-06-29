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
  CurrentPlayer,
  DisplayStyle,
  PlaylistType,
  ChromecastDevice,
  KnownConnectDevice,
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

  @internalProperty()
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
        let config_value = target.configValue;
        let target_value = target.value;
        if (config_value == 'height' || config_value == 'limit') {
          target_value = Number(target_value);
        } else if (config_value == 'filter_devices') {
          target_value = target_value
            .split(',')
            .map((value: string) => {
              return value.trim();
            })
            .filter((value: string) => {
              return value != '';
            });
        } else if (config_value == 'include_playlists') {
          target_value = target_value
            .split(',')
            .map((value: string) => {
              return value.trim();
            })
            .filter((value: string) => {
              return value != '';
            });
        } else if (config_value.startsWith('known_connect_devices')) {
          const targetIndex = config_value.split(':')[1];
          const targetProperty = config_value.split(':')[0].split('.')[1];
          target_value = (this.config?.known_connect_devices ?? [])
            .map((device: KnownConnectDevice, index: number) => {
              return index == targetIndex ? {
                ...device,
                [targetProperty]: target_value
              } : device;
            });
            config_value = 'known_connect_devices';
        }
        this.config = {
          ...this.config,
          [config_value]: target.checked !== undefined ? target.checked : target_value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this.config });
  }

  private async addKnownConnectDevice(): Promise<void> {
    let currentPlayer: CurrentPlayer | undefined = undefined;
    try {
      currentPlayer = await this.hass.callWS({
        type: 'spotcast/player',
        account: this.config?.account,
      });
    } catch (e) {
      console.error('Failed to fetch player', e);
    }
    if (this.config) {
      this.config = { 
        ...this.config,
        known_connect_devices: (this.config.known_connect_devices ?? []).concat([{
          id: currentPlayer?.device?.id ?? '',
          name: currentPlayer?.device.name ?? ''
        }])
      };
      fireEvent(this, 'config-changed', { config: this.config });
    }
  }

  private removeKnownConnectDevice(index: number): void {
    if (this.config) {
      this.config = { 
        ...this.config,
        known_connect_devices: (this.config.known_connect_devices ?? []).filter((_, i: number) => {
          return i != index;
        })
      };
      fireEvent(this, 'config-changed', { config: this.config });
    }
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
      case ConfigEntry.Known_Connect_Devices:
        return this.config?.known_connect_devices ?? [];
      case ConfigEntry.Include_Playlists:
        return this.config?.include_playlists?.toString() ?? '';
      case ConfigEntry.Hide_Connect_Devices:
        return this.config?.hide_connect_devices ?? false;
      case ConfigEntry.Hide_Chromecast_Devices:
        return this.config?.hide_chromecast_devices ?? false;
      case ConfigEntry.Hide_Top_Header:
        return this.config?.hide_top_header ?? false;
      case ConfigEntry.Hide_Currently_Playing:
        return this.config?.hide_currently_playing ?? false;
      case ConfigEntry.Hide_Playback_Controls:
        return this.config?.hide_playback_controls ?? false;

      default:
        break;
    }
  }

  private renderGeneral(): TemplateResult {
    const media_player_entities = this.getMediaPlayerEntities();
    return html`
      <div class="values">
        <div class="side-by-side">
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
        <div class="side-by-side">
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
          <paper-input
            class=${this.getValue(ConfigEntry.Playlist_Type) == 'featured' ? 'shown' : 'hidden' }
            label=${localize('settings.country_code')}
            .value=${this.getValue(ConfigEntry.Country_Code)}
            .configValue=${'country_code'}
            @value-changed=${this.valueChanged}
          ></paper-input>
          <paper-input
            label=${localize('settings.limit')}
            .value=${this.getValue(ConfigEntry.Limit)}
            .configValue=${'limit'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
        <ha-formfield label=${localize('settings.always_play_random_song')}>
          <ha-switch
            .checked=${this.getValue(ConfigEntry.Always_Play_Random_Song)}
            .configValue=${'always_play_random_song'}
            @change=${this.valueChanged}
            .id=${'always_play_random_song'}
          ></ha-switch>
        </ha-formfield>
        <paper-input
          label=${localize('settings.default_device')}
          .value=${this.getValue(ConfigEntry.Default_Device)}
          .configValue=${'default_device'}
          @value-changed=${this.valueChanged}
        ></paper-input>
      </div>
    `;
  }

  private renderAppearance(): TemplateResult {
    return html`
      <div class="values">
        <paper-input
          label=${localize('settings.title')}
          .value=${this.getValue(ConfigEntry.Name)}
          .configValue=${'name'}
          @value-changed=${this.valueChanged}
        ></paper-input>
        <div class="side-by-side">
          <ha-formfield label=${localize('settings.hide_warning')}>
            <ha-switch
              .checked=${this.getValue(ConfigEntry.Hide_Warning)}
              .configValue=${'hide_warning'}
              @change=${this.valueChanged}
              .id=${'hide_warning'}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label=${localize('settings.hide_top_header')}>
            <ha-switch
              .checked=${this.getValue(ConfigEntry.Hide_Top_Header)}
              .configValue=${'hide_top_header'}
              @change=${this.valueChanged}
              .id=${'hide_top_header'}
            ></ha-switch>
          </ha-formfield>
        </div>
        <div class="side-by-side">
          <ha-formfield label=${localize('settings.hide_currently_playing')}>
            <ha-switch
              .checked=${this.getValue(ConfigEntry.Hide_Currently_Playing)}
              .configValue=${'hide_currently_playing'}
              @change=${this.valueChanged}
              .id=${'hide_currently_playing'}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label=${localize('settings.hide_playback_controls')}>
            <ha-switch
              .checked=${this.getValue(ConfigEntry.Hide_Playback_Controls)}
              .configValue=${'hide_playback_controls'}
              @change=${this.valueChanged}
              .id=${'hide_playback_controls'}
            ></ha-switch>
          </ha-formfield>
        </div>
        <div class="side-by-side">
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
          <paper-input
            label=${localize('settings.height')}
            .value=${this.getValue(ConfigEntry.Height)}
            .configValue=${'height'}
            @value-changed=${this.valueChanged}
          ></paper-input>
        </div>
        <div class="side-by-side${this.getValue(ConfigEntry.Display_Style) == 'grid' ? '' : ' hidden' }">
          <paper-input
              label=${localize('settings.grid_covers_per_row')}
              .value=${this.getValue(ConfigEntry.Grid_Covers_Per_Row)}
              .configValue=${'grid_covers_per_row'}
              @value-changed=${this.valueChanged}
            ></paper-input>
          <ha-formfield label=${localize('settings.grid_show_title')}>
            <ha-switch
              .checked=${this.getValue(ConfigEntry.Grid_Show_Title)}
              .configValue=${'grid_show_title'}
              @change=${this.valueChanged}
              .id=${'grid_show_title'}
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>
    `;
  }

  private renderAdvanced(): TemplateResult {
    const media_player_entities = this.getMediaPlayerEntities();
    return html`
      <div class="values">
        <paper-input
          label=${localize('settings.filter_devices')}
          .value=${this.getValue(ConfigEntry.Filter_Devices)}
          .configValue=${'filter_devices'}
          @value-changed=${this.valueChanged}
        ></paper-input>
        <paper-input
          label=${localize('settings.include_playlists')}
          .value=${this.getValue(ConfigEntry.Include_Playlists)}
          .configValue=${'include_playlists'}
          @value-changed=${this.valueChanged}
        ></paper-input>
        <div class="side-by-side">
          <ha-formfield label=${localize('settings.hide_connect_devices')}>
            <ha-switch
              .checked=${this.getValue(ConfigEntry.Hide_Connect_Devices)}
              .configValue=${'hide_connect_devices'}
              @change=${this.valueChanged}
              .id=${'hide_connect_devices'}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label=${localize('settings.hide_chromecast_devices')}>
            <ha-switch
              .checked=${this.getValue(ConfigEntry.Hide_Chromecast_Devices)}
              .configValue=${'hide_chromecast_devices'}
              @change=${this.valueChanged}
              .id=${'hide_chromecast_devices'}
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>
      <div>
        <div class="side-by-side">
          <p>${localize('settings.known_connect_devices')}</p>
          <ha-icon-button
            @click=${this.addKnownConnectDevice}
            icon="hass:plus"
            title=${localize('settings.known_connect_device_add')}>
          </ha-icon-button>
        </div>
        ${this.getValue(ConfigEntry.Known_Connect_Devices).map((device: KnownConnectDevice, index: number) => {
          return html`<div class="side-by-side">
            <paper-input
              label=${localize('settings.known_connect_device_id')}
              .value=${device.id}
              .configValue=${`known_connect_devices.id:${index}`}
              @value-changed=${this.valueChanged}
            ></paper-input>
            <paper-input
              label=${localize('settings.known_connect_device_name')}
              .value=${device.name}
              .configValue=${`known_connect_devices.name:${index}`}
              @value-changed=${this.valueChanged}
            ></paper-input>
            <paper-dropdown-menu
              label=${localize('settings.known_connect_device_entity_id')}
              @value-changed=${this.valueChanged}
              .configValue=${`known_connect_devices.entity_id:${index}`}
              class="dropdown"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected=${device.entity_id ? media_player_entities.indexOf(device.entity_id) : undefined}
              >
                ${media_player_entities.map((item) => html` <paper-item>${item}</paper-item> `)}
              </paper-listbox>
            </paper-dropdown-menu>
            <ha-icon-button
              @click=${() => this.removeKnownConnectDevice(index)}
              icon="hass:close"
              title=${localize('settings.known_connect_device_remove')}>
            </ha-icon-button>
          </div>`;
        })}
      </div>
    `;
  }

  protected render(): TemplateResult | void {
    if (!this.hass) return html``;

    return html`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${'general'}>
          <ha-icon .icon=${`mdi:${options.general.icon}`}></ha-icon>
          <div class="title">${options.general.name}</div>
          <div class="secondary">${options.general.secondary}</div>
        </div>
        ${options.general.show ? this.renderGeneral() : ''}
        <div class="option" @click=${this._toggleOption} .option=${'appearance'}>
          <ha-icon .icon=${`mdi:${options.appearance.icon}`}></ha-icon>
          <div class="title">${options.appearance.name}</div>
          <div class="secondary">${options.appearance.secondary}</div>
        </div>
        ${options.appearance.show ? this.renderAppearance() : ''}
        <div class="option" @click=${this._toggleOption} .option=${'advanced'}>
          <ha-icon .icon=${`mdi:${options.advanced.icon}`}></ha-icon>
          <div class="title">${options.advanced.name}</div>
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
      .option ha-icon {
        float: left;
        margin-top: 7px;
        pointer-events: none;
      }
      .option div {
        margin-left: 35px;
        pointer-events: none;
      }
      .secondary {
        color: var(--secondary-text-color);
      }
      ha-switch {
        padding: 16px 6px;
      }
      .side-by-side {
        display: flex;
        align-items: center;
      }
      .side-by-side > * {
        flex: 1;
        padding-right: 4px;
      }
      .side-by-side > ha-icon-button {
        flex: 0;
      }
      .hidden {
        display: none;
      }
    `;
  }
}
