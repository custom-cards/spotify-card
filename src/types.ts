import { LovelaceCardConfig } from 'custom-card-helpers';

export interface SpotifyCardConfig extends LovelaceCardConfig {
  type: string;
  playlist_type: string;
  //TODO add
  // featuredPlaylistsCountryCode
  // random_song
  name?: string;
  hide_spotify_icon?: boolean;
  //TODO below not implemented in code
  display_style?: string;
  darkmode?: boolean;
  limit?: number;
  height?: string;

  //TODO: used for development
  show_warning?: boolean;
  show_error?: boolean;
}
