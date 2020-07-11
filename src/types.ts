import { LovelaceCardConfig } from 'custom-card-helpers';

export interface SpotifyCardConfig extends LovelaceCardConfig {
  //card type
  type: string;
  //optinal card title
  name?: string;
  //displayed playlist type
  playlist_type: string;
  //country code for featured playlist
  country_code?: string;
  //optional height of the card
  height?: string;
  //amount of playlist shown
  limit?: number;
  //hide warnings if some are present
  hide_warning?: boolean;
  //display style of playlist e.g. list or grid
  display_style?: string;
  //start always random when clicking a playlist. usefull especially in grid-view mode
  always_play_random_song?: boolean;
  //size of covers in grid view
  grid_cover_size?: number;
  //center the covers in grid view
  grid_center_covers?: boolean;
  //TODO implement preselected device
  device?: string;
  // locale
  // used for development
  show_warning?: boolean;
  show_error?: boolean;
}

export interface SpotifyConnectDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export interface CurrentPlayer {
  device: SpotifyConnectDevice;
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

export interface ExternalUrls {
  spotify: string;
}

export interface Context {
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

export interface ExternalUrls2 {
  spotify: string;
}

export interface Artist {
  external_urls: ExternalUrls2;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalUrls3 {
  spotify: string;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls3;
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

export interface ExternalUrls4 {
  spotify: string;
}

export interface Artist2 {
  external_urls: ExternalUrls4;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface ExternalIds {
  isrc: string;
}

export interface ExternalUrls5 {
  spotify: string;
}

export interface Item {
  album: Album;
  artists: Artist2[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls5;
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
