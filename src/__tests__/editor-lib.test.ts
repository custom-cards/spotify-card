
import { SpotifyCardConfig, ChromecastDevice, ValueChangedEvent } from '../types';
import { HomeAssistant } from 'custom-card-helpers';
import { SpotifyCardEditor } from '../editor';
import { SpotifyCardEditorLib } from '../editor-lib';
import { HassEntity } from 'home-assistant-js-websocket';

jest.mock('../editor');

let editor!: SpotifyCardEditor;
let editor_lib!: SpotifyCardEditorLib;

describe.only('SpotifyCardEditorLib', () => {
  beforeEach(() => {
    editor = new SpotifyCardEditor();
    editor_lib = new SpotifyCardEditorLib(editor);
  });
  describe('connectedCallback', () => {
    test('all functions called', async () => {
        editor_lib._parent.requestUpdate = jest.fn();
        editor_lib._parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
        editor_lib.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
        const chromecast = jest.genMockFromModule<ChromecastDevice>('../types');
        chromecast.friendly_name = "test";
        editor_lib.hass.callWS = jest.fn().mockResolvedValue([chromecast]);
        await editor_lib.connectedCallback();
        expect(editor_lib.hass.callWS).toHaveBeenCalledWith({
            type: 'spotcast/accounts',
          });
        expect(editor_lib.hass.callWS).toHaveBeenCalledWith({
            type: 'spotcast/castdevices',
          });
        expect(editor_lib.chromecast_devices).toStrictEqual(["test"]);
        expect(editor_lib._parent.requestUpdate).toBeCalled();
    });
  });
  describe('getMediaPlayerEntities', () => {
    test('returns filtered array', () => {
        editor_lib.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
        const entity1 = jest.genMockFromModule<HassEntity>('home-assistant-js-websocket');
        entity1.entity_id = "sensor.test";
        const entity2 = jest.genMockFromModule<HassEntity>('home-assistant-js-websocket');
        entity2.entity_id = "media_player.test";
        const entity3 = jest.genMockFromModule<HassEntity>('home-assistant-js-websocket');
        entity3.entity_id = "media_player.test2";
        editor_lib.hass.states = {
            entity1,
            entity2,
            entity3,
        }
        expect(editor_lib.getMediaPlayerEntities()).toStrictEqual(["media_player.test","media_player.test2"]);
    });
  });
  describe.only('valueChangedFunction', () => {
    beforeEach(() => {
        editor.requestUpdate = jest.fn();
      });
    test('returns with no config', () => {
        const ev = jest.genMockFromModule<ValueChangedEvent>('../types');
        editor_lib.valueChangedFunction(editor, ev);
        expect(editor.requestUpdate).not.toBeCalled();
    });
    test('returns with no hass', () => {
        editor.config = jest.genMockFromModule<SpotifyCardConfig>('home-assistant-js-websocket');
        const ev = jest.genMockFromModule<ValueChangedEvent>('../types');
        editor_lib.valueChangedFunction(editor, ev);
        expect(editor.requestUpdate).not.toBeCalled();
    });
    test('returns with no focus', () => {
        editor.config = jest.genMockFromModule<SpotifyCardConfig>('home-assistant-js-websocket');
        editor.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
        const ev = jest.genMockFromModule<ValueChangedEvent>('../types');
        ev.target = jest.fn();
        ev.target.offsetParent = null;
        editor_lib.valueChangedFunction(editor, ev);
        expect(editor.requestUpdate).not.toBeCalled();
    });
    test('returns if unchanged', () => {
        editor.config = jest.genMockFromModule<SpotifyCardConfig>('home-assistant-js-websocket');
        editor.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
        const ev = jest.genMockFromModule<ValueChangedEvent>('../types');
        ev.target = jest.fn();
        ev.target.offsetParent = jest.fn();
        ev.target.configValue = "test";
        ev.target.value = "test";
        editor["_test"] = "test";
        editor_lib.valueChangedFunction(editor, ev);
        expect(editor.requestUpdate).not.toBeCalled();
    });
  });
});
