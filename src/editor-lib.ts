import { SpotifyCardEditor } from './editor';
import { HomeAssistant, fireEvent } from 'custom-card-helpers';
import { ChromecastDevice, ConfigEntry, ValueChangedEvent } from './types';

export interface ISpotifyCardEditorLib {
  hass: HomeAssistant;
  accounts: Array<string>;
  chromecast_devices: Array<string>;
  connectedCallback(): Promise<void>;
  getMediaPlayerEntities(): Array<string>;
  valueChangedFunction(editor: SpotifyCardEditor, ev: ValueChangedEvent): void;
  getValue(value: ConfigEntry): any;
}

export class SpotifyCardEditorLib {
  public hass!: HomeAssistant;
  public accounts: Array<string> = [];
  public chromecast_devices: Array<string> = [];

  public _parent: SpotifyCardEditor;

  constructor(parent: SpotifyCardEditor) {
    this._parent = parent;
  }

  public async connectedCallback(): Promise<void> {
    this.hass = this.hass || this._parent.hass;
    const res: any = await this.hass.callWS({
      type: 'spotcast/accounts',
    });
    this.accounts = res;

    const casts: any = await this.hass.callWS({
      type: 'spotcast/castdevices',
    });

    this.chromecast_devices = casts?.map((c: ChromecastDevice) => c.friendly_name);
    this._parent.requestUpdate();
  }

  public getMediaPlayerEntities(): Array<string> {
    return Object.values(this.hass.states)
      .filter((ent) => ent.entity_id.match('media_player[.]'))
      .map((e) => e.entity_id);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public valueChangedFunction(editor: SpotifyCardEditor, ev: ValueChangedEvent): void {
    // ev.target.offsetParent checks if editor visible or freetext input is used
    if (!editor.config || !editor.hass || ev.target.offsetParent === null) {
      return;
    }
    const { target } = ev;
    if (target.value && editor[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      // Delete item if false or empty
      if (target.checked === false || target.value === '') {
        const clone = { ...editor.config };
        delete clone[target.configValue];
        editor.config = clone;
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
        editor.config = {
          ...editor.config,
          [target.configValue]: target.checked !== undefined ? target.checked : target_value,
        };
      }
    }
    fireEvent(editor, 'config-changed', { config: editor.config });
    editor.requestUpdate(target.configValue);
  }

  public getValue(value: ConfigEntry): any {
    switch (value) {
      case ConfigEntry.Name:
        return this._parent.config?.name ?? '';
      case ConfigEntry.Account:
        return this._parent.config?.account ?? 'default';
      case ConfigEntry.Spotify_Entity:
        // eslint-disable-next-line no-case-declarations
        const auto_detected = this.getMediaPlayerEntities().filter((e) => e.includes('spotify'));
        return this._parent.config?.spotify_entity ?? (auto_detected.length > 0 ? auto_detected[0] : '');
      case ConfigEntry.Country_Code:
        return this._parent.config?.country_code ?? '';
      case ConfigEntry.Limit:
        return this._parent.config?.limit ?? 10;
      case ConfigEntry.Playlist_Type:
        return this._parent.config?.playlist_type ?? 'default';
      case ConfigEntry.Always_Play_Random_Song:
        return this._parent.config?.always_play_random_song ?? false;
      case ConfigEntry.Height:
        return this._parent.config?.height ?? '';
      case ConfigEntry.Display_Style:
        return this._parent.config?.display_style ?? 'list';
      case ConfigEntry.Grid_Covers_Per_Row:
        return this._parent.config?.grid_covers_per_row ?? 5;
      case ConfigEntry.Grid_Center_Covers:
        return this._parent.config?.grid_center_covers ?? false;
      case ConfigEntry.Hide_Warning:
        return this._parent.config?.hide_warning ?? false;
      case ConfigEntry.Default_Device:
        return this._parent.config?.default_device ?? '';
      case ConfigEntry.Filter_Devices:
        return this._parent.config?.filter_devices?.toString() ?? '';

      default:
        break;
    }
  }
}
