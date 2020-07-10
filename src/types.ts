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
