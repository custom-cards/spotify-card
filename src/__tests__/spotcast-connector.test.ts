import { SpotifyCardLib } from '../spotify-card-lib';
import { SpotifyCardConfig, ConnectDevice, ChromecastDevice, Playlist } from '../types';
import { SpotcastConnector } from '../spotcast-connector';
import { HomeAssistant } from 'custom-card-helpers';

jest.mock('../editor');

let spotify_card_lib!: SpotifyCardLib;
let spotcast_connector!: SpotcastConnector;

describe('SpotcastConnector', () => {
  beforeEach(() => {
    spotify_card_lib = jest.genMockFromModule<SpotifyCardLib>('../spotify-card-lib');
    spotcast_connector = new SpotcastConnector(spotify_card_lib);
  });
  describe('is_loaded', () => {
    test('false', () => {
      spotcast_connector.playlists = [jest.genMockFromModule<Playlist>('../types')];
      expect(spotcast_connector.is_loaded).toBeTruthy();
    });
  });
  describe('getPlaybackOptions', () => {
    test('returns PlaybackOptions', () => {
      spotcast_connector.parent.getSpotifyEntityState = jest.fn().mockReturnValueOnce('playing');
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
      spotcast_connector.parent.config.always_play_random_song = true;
      expect(spotcast_connector.getPlaybackOptions('test')).toHaveProperty('uri');
      expect(spotcast_connector.getPlaybackOptions('test')).toHaveProperty('force_playback');
      expect(spotcast_connector.getPlaybackOptions('test')).toHaveProperty('random_song');
      expect(spotcast_connector.getPlaybackOptions('test')).toHaveProperty('account');
    });
  });
  describe('playUri', () => {
    beforeEach(() => {
      spotcast_connector.playUriOnConnectDevice = jest.fn();
      spotcast_connector.playUriOnCastDevice = jest.fn();
      spotcast_connector.parent.getSpotifyEntityState = jest.fn().mockReturnValueOnce('playing');
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
    });
    test('play on current_player', () => {
      const connect_device = jest.genMockFromModule<ConnectDevice>('../types');
      connect_device.id = 'test_id';
      spotcast_connector.getCurrentPlayer = jest.fn().mockReturnValueOnce(connect_device);
      spotcast_connector.playUri('test_uri');
      expect(spotcast_connector.playUriOnConnectDevice).toBeCalledWith('test_id', 'test_uri');
    });
    test('throw Error', () => {
      spotcast_connector.getCurrentPlayer = jest.fn().mockReturnValueOnce(undefined);
      expect(() => {
        spotcast_connector.playUri('test_uri');
      }).toThrowError();
    });
    test('default device not found in connect devices', () => {
      spotcast_connector.getCurrentPlayer = jest.fn().mockReturnValueOnce(undefined);
      spotcast_connector.parent.config.default_device = 'test_device';
      spotcast_connector.devices = [];
      expect(() => {
        spotcast_connector.playUri('test_uri');
      }).toThrowError();
    });
    test('default device found in connect devices', () => {
      spotcast_connector.getCurrentPlayer = jest.fn().mockReturnValueOnce(undefined);
      spotcast_connector.parent.config.default_device = 'test_device';
      const connect_device = jest.genMockFromModule<ConnectDevice>('../types');
      connect_device.id = 'test_id';
      connect_device.name = 'test_device';
      spotcast_connector.devices = [connect_device];
      spotcast_connector.playUri('test_uri');
      expect(spotcast_connector.playUriOnConnectDevice).toBeCalledWith('test_id', 'test_uri');
    });
    test('default device found in cast devices', () => {
      spotcast_connector.getCurrentPlayer = jest.fn().mockReturnValueOnce(undefined);
      spotcast_connector.parent.config.default_device = 'test_device';
      spotcast_connector.devices = [];
      const cast_device = jest.genMockFromModule<ChromecastDevice>('../types');
      cast_device.friendly_name = 'test_device';
      spotcast_connector.chromecast_devices = [cast_device];
      spotcast_connector.playUri('test_uri');
      expect(spotcast_connector.playUriOnCastDevice).toBeCalledWith('test_device', 'test_uri');
    });
  });
  describe('transferPlaybackToCastDevice', () => {
    test('callService', () => {
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callService = jest.fn();
      spotcast_connector.transferPlaybackToCastDevice('test_id');
      expect(spotcast_connector.parent.hass.callService).toBeCalledWith('spotcast', 'start', {
        device_name: 'test_id',
        force_playback: true,
        account: spotcast_connector.parent.config.account,
      });
    });
  });
  describe('transferPlaybackToConnectDevice', () => {
    test('callService', () => {
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callService = jest.fn();
      spotcast_connector.transferPlaybackToConnectDevice('test_id');
      expect(spotcast_connector.parent.hass.callService).toBeCalledWith('spotcast', 'start', {
        spotify_device_id: 'test_id',
        force_playback: true,
        account: spotcast_connector.parent.config.account,
      });
    });
  });
  describe('playUriOnCastDevice', () => {
    test('callService', () => {
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callService = jest.fn();
      spotcast_connector.getPlaybackOptions = jest.fn().mockReturnValue({
        uri: 'test_uri',
        force_playback: true,
        random_song: false,
        account: undefined,
      });
      spotcast_connector.playUriOnCastDevice('test_name', 'test_uri');
      expect(spotcast_connector.parent.hass.callService).toBeCalledWith('spotcast', 'start', {
        uri: 'test_uri',
        force_playback: true,
        random_song: false,
        account: undefined,
        device_name: 'test_name',
      });
    });
  });
  describe('playUriOnConnectDevice', () => {
    test('callService', () => {
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callService = jest.fn();
      spotcast_connector.getPlaybackOptions = jest.fn().mockReturnValue({
        uri: 'test_uri',
        force_playback: true,
        random_song: false,
        account: undefined,
      });
      spotcast_connector.playUriOnConnectDevice('test_name', 'test_uri');
      expect(spotcast_connector.parent.hass.callService).toBeCalledWith('spotcast', 'start', {
        uri: 'test_uri',
        force_playback: true,
        random_song: false,
        account: undefined,
        spotify_device_id: 'test_name',
      });
    });
  });
  describe('updateState', () => {
    test('do no update', () => {
      spotcast_connector.fetchDevices = jest.fn();
      spotcast_connector.state_ttl = 9999999;
      spotcast_connector.last_state_update_time = new Date().getTime();
      spotcast_connector.updateState();
      expect(spotcast_connector.fetchDevices).not.toHaveBeenCalled();
    });
    test('do update', async () => {
      spotcast_connector.fetchDevices = jest.fn();
      spotcast_connector.fetchPlayer = jest.fn();
      spotcast_connector.fetchChromecasts = jest.fn();
      await spotcast_connector.updateState();
      expect(spotcast_connector.fetchDevices).toHaveBeenCalled();
      expect(spotcast_connector.fetchPlayer).toHaveBeenCalled();
      expect(spotcast_connector.fetchChromecasts).toHaveBeenCalled();
      expect(spotcast_connector.last_state_update_time).toBeGreaterThanOrEqual(new Date().getTime() - 10000);
    });
    test('error', async () => {
      spotcast_connector.fetchDevices = jest.fn().mockRejectedValue('Error');
      await expect(async () => {
        await spotcast_connector.updateState();
      }).rejects.toThrowError();
    });
  });
  describe('fetchPlayer', () => {
    test('callWS', async () => {
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callWS = jest.fn();
      spotcast_connector.parent.config.account = 'test_account';
      await spotcast_connector.fetchPlayer();
      expect(spotcast_connector.parent.hass.callWS).toHaveBeenCalledWith({
        type: 'spotcast/player',
        account: 'test_account',
      });
    });
    test('error', async () => {
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callWS = jest.fn().mockRejectedValue('Error');
      spotcast_connector.parent.config.account = 'test_account';
      await expect(async () => {
        await spotcast_connector.fetchPlayer();
      }).rejects.toThrowError();
    });
  });
  describe('fetchDevices', () => {
    test('callWS', async () => {
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callWS = jest.fn().mockResolvedValue([]);
      spotcast_connector.parent.config.account = 'test_account';
      await spotcast_connector.fetchDevices();
      expect(spotcast_connector.parent.hass.callWS).toHaveBeenCalledWith({
        type: 'spotcast/devices',
        account: 'test_account',
      });
    });
    test('error', async () => {
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callWS = jest.fn().mockRejectedValue('Error');
      spotcast_connector.parent.config.account = 'test_account';
      await expect(async () => {
        await spotcast_connector.fetchDevices();
      }).rejects.toThrowError();
    });
  });
  describe('fetchChromecasts', () => {
    test('callWS', async () => {
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callWS = jest.fn();
      await spotcast_connector.fetchChromecasts();
      expect(spotcast_connector.parent.hass.callWS).toHaveBeenCalledWith({
        type: 'spotcast/castdevices',
      });
    });
    test('error', async () => {
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callWS = jest.fn().mockRejectedValue('Error');
      await expect(async () => {
        await spotcast_connector.fetchChromecasts();
      }).rejects.toThrowError();
    });
  });
  describe('fetchPlaylists', () => {
    beforeEach(() => {
      spotcast_connector.parent.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
      spotcast_connector.parent.config.playlist_type = 'test_type';
      spotcast_connector.parent.config.account = 'test_account';
      spotcast_connector.parent.config.limit = 5;
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      //spotcast_connector.parent.hass.callWS = jest.fn().mockResolvedValue([]);
      const playlist1 = jest.genMockFromModule<Playlist>('../types');
      playlist1.name = 'name1';
      playlist1.uri = 'test_uri/id1';
      const playlist2 = jest.genMockFromModule<Playlist>('../types');
      playlist2.name = 'name2';
      const playlist3 = jest.genMockFromModule<Playlist>('../types');
      playlist3.name = 'name3';
      playlist3.description = 'description3';
      spotcast_connector.parent.hass.callWS = jest.fn().mockResolvedValue([playlist1, playlist2, playlist3]);
      //jest.genMockFromModule<ConnectDevice>('../types')
    });
    test('callWS', async () => {
      await spotcast_connector.fetchPlaylists();
      expect(spotcast_connector.loading).toBeTruthy();
      expect(spotcast_connector.parent.hass.callWS).toHaveBeenCalledWith({
        type: 'spotcast/playlists',
        playlist_type: 'test_type',
        account: 'test_account',
        limit: 5,
      });
    });
    test('callWS with country code', async () => {
      spotcast_connector.parent.config.country_code = 'test_code';
      await spotcast_connector.fetchPlaylists();
      expect(spotcast_connector.loading).toBeTruthy();
      expect(spotcast_connector.parent.hass.callWS).toHaveBeenCalledWith({
        type: 'spotcast/playlists',
        playlist_type: 'test_type',
        account: 'test_account',
        limit: 5,
        country_code: 'test_code',
      });
    });
    test('fetchPlaylists with empty filter', async () => {
      const playlist1 = jest.genMockFromModule<Playlist>('../types');
      playlist1.name = 'name1';
      playlist1.uri = 'test_uri/id1';
      const playlist2 = jest.genMockFromModule<Playlist>('../types');
      playlist2.name = 'name2';
      const playlist3 = jest.genMockFromModule<Playlist>('../types');
      playlist3.name = 'name3';
      playlist3.description = 'description3';
      await spotcast_connector.fetchPlaylists();
      expect(spotcast_connector.loading).toBeTruthy();
      expect(spotcast_connector.parent.hass.callWS).toHaveBeenCalledWith({
        type: 'spotcast/playlists',
        playlist_type: 'test_type',
        account: 'test_account',
        limit: 5,
      });
      expect(spotcast_connector.parent.playlists).toEqual([playlist1, playlist2, playlist3]);
      expect(spotcast_connector.is_loaded).toBeTruthy();
    });
    test('error', async () => {
      spotcast_connector.parent.hass = jest.genMockFromModule<HomeAssistant>('home-assistant-js-websocket');
      spotcast_connector.parent.hass.callWS = jest.fn().mockRejectedValue('Error');
      await expect(async () => {
        await spotcast_connector.fetchPlaylists();
      }).rejects.toThrowError();
    });
  });
});
