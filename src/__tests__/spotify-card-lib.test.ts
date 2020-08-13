import { SpotifyCard } from '../spotify-card';
import { SpotcastConnector } from '../spotcast-connector';
import { SpotifyCardLib, DisplayStyle } from '../spotify-card-lib';
import { SpotifyCardConfig, CurrentPlayer } from '../types';
import { HassEntity } from 'home-assistant-js-websocket';

jest.mock('../spotify-card');
jest.mock('../spotcast-connector');
jest.mock('../editor');

let spotify_card!: SpotifyCard;
let spotify_card_lib!: SpotifyCardLib;

describe('SpotifyCardLib', () => {
  beforeEach(() => {
    spotify_card = new SpotifyCard();
    spotify_card_lib = new SpotifyCardLib(spotify_card);
  });

  describe('getDisplayStyle', () => {
    beforeEach(() => {
      spotify_card_lib.config = jest.genMockFromModule<SpotifyCardConfig>('../types');
    });
    test('grid', () => {
      spotify_card_lib.config.display_style = 'grid';
      expect(spotify_card_lib.getDisplayStyle()).toEqual(DisplayStyle.Grid);
    });
    test('list', () => {
      spotify_card_lib.config.display_style = 'list';
      expect(spotify_card_lib.getDisplayStyle()).toEqual(DisplayStyle.List);
    });
    test('other', () => {
      spotify_card_lib.config.display_style = 'other';
      expect(spotify_card_lib.getDisplayStyle()).toEqual(DisplayStyle.List);
    });
    test('undefined', () => {
      expect(spotify_card_lib.getDisplayStyle()).toEqual(DisplayStyle.List);
    });
  });

  describe('getPlayingState', () => {
    test('playing', () => {
      spotify_card_lib.spotify_state = jest.genMockFromModule<HassEntity>('home-assistant-js-websocket');
      spotify_card_lib.spotify_state.state = 'playing';
      expect(spotify_card_lib.getPlayingState()).toBeTruthy();
    });
    test('not_playing', () => {
      spotify_card_lib.spotify_state = jest.genMockFromModule<HassEntity>('home-assistant-js-websocket');
      spotify_card_lib.spotify_state.state = 'not_playing';
      expect(spotify_card_lib.getPlayingState()).toBeFalsy();
    });
    test('undefined', () => {
      expect(spotify_card_lib.getPlayingState()).toBeFalsy();
    });
  });

  describe('getShuffleState', () => {
    beforeEach(() => {
      spotify_card_lib._spotcast_connector = jest.genMockFromModule<SpotcastConnector>('../spotcast-connector');
    });
    test('undefined', () => {
      expect(spotify_card_lib.getShuffleState()).toBeFalsy();
    });
    test('true', () => {
      spotify_card_lib._spotcast_connector.player = jest.genMockFromModule<CurrentPlayer>('../types');
      spotify_card_lib._spotcast_connector.player.shuffle_state = true;
      expect(spotify_card_lib.getShuffleState()).toBeTruthy();
    });
    test('false', () => {
      spotify_card_lib._spotcast_connector.player = jest.genMockFromModule<CurrentPlayer>('../types');
      spotify_card_lib._spotcast_connector.player.shuffle_state = false;
      expect(spotify_card_lib.getShuffleState()).toBeFalsy();
    });
  });

  describe('getSpotifyEntityState', () => {
    test('undefined', () => {
      expect(spotify_card_lib.getSpotifyEntityState()).toBe('');
    });
    test('playing', () => {
      spotify_card_lib.spotify_state = jest.genMockFromModule<HassEntity>('home-assistant-js-websocket');
      spotify_card_lib.spotify_state.state = 'playing';
      expect(spotify_card_lib.getSpotifyEntityState()).toBe('playing');
    });
    test('not_playing', () => {
      spotify_card_lib.spotify_state = jest.genMockFromModule<HassEntity>('home-assistant-js-websocket');
      spotify_card_lib.spotify_state.state = 'not_playing';
      expect(spotify_card_lib.getSpotifyEntityState()).toBe('not_playing');
    });
  });
});
