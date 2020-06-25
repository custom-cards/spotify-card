import { TemplateResult, html, css } from 'lit-element';
import { HomeAssistant, LovelaceCardEditor, getLovelace, LovelaceCard } from 'custom-card-helpers';
import { SpotifyCard } from './spotify-card';

import { SpotifyCardConfig } from './types';

export const listStyles = css`
  .blue-button {
    color: white;
    background-color: blue;
  }
  .blue-button:disabled {
    background-color: grey;
  }
`;

export class SpotcastConnector {
  playlists: any = {};
  parent: SpotifyCard;
  loading = false;

  constructor(parent: SpotifyCard) {
    this.parent = parent;
  }

  public is_loading(): boolean {
    return this.loading;
  }

  private set_loading_off() {
    this.loading = false;
  }

  public is_loaded(): boolean {
    if (this.playlists.length !== undefined) {
      return true;
    }
    return false;
  }

  public fetchPlaylists(limit?: number): void {
    //TODO implement limit
    if (!limit) {
      limit = 10;
    }
    console.log(limit);
    this.loading = true;
    this.parent.hass.connection
      .sendMessagePromise({
        type: 'spotcast/playlists',
        playlist_type: this.parent.config.playlist_type ? this.parent.config.playlist_type : '',
      })
      .then(
        (resp: any) => {
          console.log('Message success!', resp.items);
          this.playlists = resp.items;
          this.parent.requestUpdate();
          setTimeout(this.set_loading_off, 100);
        },
        (err) => {
          console.error('Message failed!', err);
        },
      );
  }

  public generatePlaylistHTML(): TemplateResult {
    if (this.is_loaded()) {
      const list = this.playlists.map((item) => {
        return html` <p>${item.name}</p>`;
      });

      return html`<div>${list}</div>`;
    }
    return html``;
  }
}
