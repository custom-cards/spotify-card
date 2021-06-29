import { LovelaceCardConfig } from 'custom-card-helpers';
import { TemplateResult } from 'lit-element';

export enum DisplayStyle {
  Grid = 'grid',
  List = 'list',
}

export enum PlaylistType {
  default = 'default',
  featured = 'featured',
  discover_weekly = 'discover-weekly',
}

export enum ConfigEntry {
  Name,
  Account,
  Spotify_Entity,
  Country_Code,
  Limit,
  Playlist_Type,
  Always_Play_Random_Song,
  Height,
  Display_Style,
  Grid_Covers_Per_Row,
  Grid_Center_Covers,
  Grid_Show_Title,
  Hide_Warning,
  Default_Device,
  Filter_Devices,
  Known_Connect_Devices,
  Include_Playlists,
  Hide_Connect_Devices,
  Hide_Chromecast_Devices,
  Hide_Top_Header,
  Hide_Currently_Playing,
  Hide_Playback_Controls,
}

export interface SpotifyCardConfig extends LovelaceCardConfig {
  //card type
  type: string;
  // name of the spotify entity
  spotify_entity?: string;
  //optinal account
  account?: string;
  //optinal card title
  name?: string;
  //displayed playlist type
  playlist_type: string;
  //country code for featured playlist
  country_code?: string;
  //optional height of the card
  height?: number;
  //amount of playlist shown
  limit?: number;
  //hide warnings if some are present
  hide_warning?: boolean;
  //display style of playlist e.g. list or grid
  display_style?: string;
  //start always random when clicking a playlist. usefull especially in grid-view mode
  always_play_random_song?: boolean;
  //number of covers per row in grid
  grid_covers_per_row?: number;
  //Show album title in grid
  grid_show_title?: boolean;
  //preselected device
  default_device?: string;
  //filter the devices based on regex
  filter_devices?: Array<string>;
  //known spotify connect devices which not show by default (e.g. Sonos)
  known_connect_devices?: Array<KnownConnectDevice>;
  //select the playlists based on regex
  include_playlists?: Array<string>;
  //hide all Spotify Connect devices
  hide_connect_devices?: boolean;
  //hide all Chromecast devices
  hide_chromecast_devices?: boolean;
  //hide the top header row and display the spotify icon at the bottom
  hide_top_header?: boolean;
  //hide the currently playing row
  hide_currently_playing?: boolean;
  //hide the playback controls
  hide_playback_controls?: boolean;
  // locale
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isConnectDevice(object: any): object is ConnectDevice {
  return 'name' in object;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function isCurrentPlayer(object: any): object is CurrentPlayer {
  return 'currently_playing_type' in object;
}

export interface PlaybackOptions {
  uri: string;
  force_playback: boolean;
  random_song: boolean;
  account?: string;
  device_name?: string;
  spotify_device_id?: string;
}

export interface ConnectDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface KnownConnectDevice {
  id: string;
  name: string;
  entity_id?: string;
}

export interface ChromecastDevice {
  id: string;
  friendly_name: string;
}

export interface CurrentPlayer {
  device: ConnectDevice;
  shuffle_state: boolean;
  repeat_state: string;
  timestamp: number;
  context: Context;
  progress_ms: number;
  item: Item;
  currently_playing_type: string;
  actions: Actions;
  is_playing: boolean;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color?: any;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Context {
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Image {
  height?: number;
  url: string;
  width?: number;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface ExternalIds {
  isrc: string;
}

export interface Item {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  tags: any[];
  track_number: number;
  type: string;
  uri: string;
}

export interface Disallows {
  resuming: boolean;
}

export interface Actions {
  disallows: Disallows;
}

export interface Owner {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface Tracks {
  href: string;
  total: number;
}

export interface ValueChangedEvent extends Event {
  target: any;
  timeStamp: number;
}

export interface DeviceList {
  html: TemplateResult;
  count: number;
}

export interface PlaylistFilter {
  key: string;
  pattern: RegExp;
}
