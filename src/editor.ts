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
import { HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';

import { SpotifyCardConfig, ConfigEntry, DisplayStyle, PlaylistType } from './types';
import { localize } from './localize/localize';

import { SpotifyCardEditorLib } from './editor-lib';

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

  @internalProperty() public config?: SpotifyCardConfig;

  @internalProperty() public _toggle?: boolean;

  @internalProperty()
  private lib: SpotifyCardEditorLib;

  accounts: Array<string> = [];
  chromecast_devices: Array<string> = [];

  constructor() {
    super();
    this.lib = new SpotifyCardEditorLib(this);
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    await this.lib.connectedCallback();
  }

  public setConfig(_config: SpotifyCardConfig): void {
    this.config = _config;
  }

  private renderGeneral(): TemplateResult {
    const media_player_entities = this.lib.getMediaPlayerEntities();
    return html`
      <div class="values">
        <div>
          <paper-dropdown-menu
            label=${localize('settings.account')}
            @value-changed=${this.lib.valueChanged}
            .configValue=${'account'}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${this.accounts.indexOf(this.lib.getValue(ConfigEntry.Account))}
            >
              ${this.accounts.map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-dropdown-menu
            label=${localize('settings.spotify_entity')}
            @value-changed=${this.lib.valueChanged}
            .configValue=${'spotify_entity'}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${media_player_entities.indexOf(this.lib.getValue(ConfigEntry.Spotify_Entity))}
            >
              ${media_player_entities.map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>

        <div>
          <paper-dropdown-menu
            label=${localize('settings.playlist_type')}
            @value-changed=${this.lib.valueChanged}
            .configValue=${'playlist_type'}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${(Object.values(PlaylistType) as Array<string>).indexOf(
                this.lib.getValue(ConfigEntry.Playlist_Type)
              )}
            >
              ${(Object.values(PlaylistType) as Array<string>).map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <div>${localize('settings.limit')}</div>
          <paper-slider
            .value=${this.lib.getValue(ConfigEntry.Limit)}
            .configValue=${'limit'}
            @value-changed=${this.lib.valueChanged}
            max="50"
            editable
            pin
          ></paper-slider>
        </div>
        <div>
          <paper-input
            label=${localize('settings.height')}
            .value=${this.lib.getValue(ConfigEntry.Height)}
            .configValue=${'height'}
            @value-changed=${this.lib.valueChanged}
          ></paper-input>
        </div>
        <div>
          <paper-input
            label=${localize('settings.country_code')}
            .value=${this.lib.getValue(ConfigEntry.Country_Code)}
            .configValue=${'country_code'}
            @value-changed=${this.lib.valueChanged}
          ></paper-input>
        </div>
        <div>
          <ha-switch
            .checked=${this.lib.getValue(ConfigEntry.Always_Play_Random_Song)}
            .configValue=${'always_play_random_song'}
            @change=${this.lib.valueChanged}
            .id=${'always_play_random_song'}
          ></ha-switch>
          <label for=${'always_play_random_song'}>${localize('settings.always_play_random_song')}</label>
        </div>
        <div>
          <paper-input
            label=${localize('settings.default_device')}
            .value=${this.lib.getValue(ConfigEntry.Default_Device)}
            .configValue=${'default_device'}
            @value-changed=${this.lib.valueChanged}
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
            .checked=${this.lib.getValue(ConfigEntry.Hide_Warning)}
            .configValue=${'hide_warning'}
            @change=${this.lib.valueChanged}
            .id=${'hide_warning'}
          ></ha-switch>
          <label for=${'hide_warning'}>${localize('settings.hide_warning')}</label>
        </div>
        <div>
          <paper-input
            label=${localize('settings.title')}
            .value=${this.lib.getValue(ConfigEntry.Name)}
            .configValue=${'name'}
            @value-changed=${this.lib.valueChanged}
          ></paper-input>
        </div>
        <div>
          <paper-dropdown-menu
            label=${localize('settings.display_style')}
            @value-changed=${this.lib.valueChanged}
            .configValue=${'display_style'}
            class="dropdown"
          >
            <paper-listbox
              slot="dropdown-content"
              .selected=${(Object.values(DisplayStyle) as Array<string>).indexOf(
                this.lib.getValue(ConfigEntry.Display_Style)
              )}
            >
              ${(Object.values(DisplayStyle) as Array<string>).map((item) => html` <paper-item>${item}</paper-item> `)}
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
        <div>
          <div>${localize('settings.grid_covers_per_row')}</div>
          <paper-slider
            .value=${this.lib.getValue(ConfigEntry.Grid_Covers_Per_Row)}
            .configValue=${'grid_covers_per_row'}
            @value-changed=${this.lib.valueChanged}
            max="10"
            min="1"
            editable
            pin
          ></paper-slider>
        </div>
        <div>
          <ha-switch
            .checked=${this.lib.getValue(ConfigEntry.Grid_Center_Covers)}
            .configValue=${'grid_center_covers'}
            @change=${this.lib.valueChanged}
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
            .value=${this.lib.getValue(ConfigEntry.Filter_Devices)}
            .configValue=${'filter_devices'}
            @value-changed=${this.lib.valueChanged}
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
