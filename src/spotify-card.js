/**
 * @license
 * Copyright 2019 Niklas Fondberg<niklas.fondberg@gmail.com>. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import 'core-js/stable';
import { h, Component, render } from 'preact';
import htm from 'htm';
const html = htm.bind(h);
import SpotifyCard from './SpotifyCard';

const styleElement = document.createElement('style');
const styles = {
  green: 'rgb(30, 215, 96)',
  lightBlack: 'rgb(40, 40, 40)',
  black: 'rgb(24, 24, 24)',
  grey: 'rgb(170, 170, 170)',
  sand: 'rgb(200, 200, 200)',
  white: 'rgb(255, 255, 255)',
  blue: '#4688d7',
};

styleElement.textContent = `
    .spotify_container {
      background-color: ${styles.lightBlack};
      font-family: 'Roboto', sans-serif;
      color:  ${styles.white};
      font-size: 14px;
      padding: 25px;
      height:auto;
      overflow-y:auto;
      position: relative;
    }
    .spotify_container *:focus {outline:none}
    .header img {
      height: 30px;
      margin-bottom: 10px;
    }
    .login__box {
      width: 100%;
      text-align: center;
    }
    .playlists {
      display: flex;
      flex-flow: column nowrap;
      margin-bottom: 15px;
      overflow: auto;
      background-color: ${styles.black};
    }
    .playlist {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      border-top: 1px solid ${styles.lightBlack};
      height: 42px;
    }
    .playlist:active {
      background-color: rgb(200, 200, 240);
    }
    .playlist:last-child {
      border-bottom: 1px solid ${styles.lightBlack};
    }
    .playlist:hover {
      background: ${styles.lightBlack};
      cursor: pointer;
    }
    .highlight {
      background: ${styles.lightBlack};
    }

    .playlist__cover_art img {
      width: 42px;
      height: 42px;
    }
    .playlist__number {
      margin-left: 10px;
      color:  ${styles.grey};
      width: 12px;
    }

    .playlist__playicon {
      color: ${styles.white};
      margin-left: 10px;
    }
    .playlist__playicon:hover {
      color: rgb(216, 255, 229);
      text-shadow: 0 0 20px rgb(216, 255, 229);
    }
    .playing {
      color: ${styles.green}
    }

    .playlist__title {
      margin-left: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 75vw;
    }
    .controls {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      bottom: 0.5em;
      position: absolute;
    }
    .greenButton {
      border-radius: 15px;
      padding: 0 20px 0 20px;
      font-size: 14px;
      height: 27px;
      color: white;
      border: none;
      background: ${styles.green};
      cursor: pointer;
      margin-right: 10px;
    }
    .greenButton:hover {
      background-color: #43e57d;
    }
    .playButton::before {
      content: "\\25B6  "
    }

    .dropdown {
      position: relative;
      display: inline-block;
      color: ${styles.sand};
    }
    .mediaplayer_select {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mediaplayer_speaker_icon {
      display: inline-block;
      padding: 3px;
      width: 17px;
      height: 17px;
      margin-right: 10px;
      border: thin solid ${styles.sand};
      border-radius: 50%;
    }
    .dropdown-wrapper {
      display: contents;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .dropdown-content {
      display: none;
      position: absolute;
      left: 1em;
      bottom: 0.5em;
      max-height: calc(100% - 1em);
      overflow-y: auto;
      background-color: ${styles.lightBlack};
      min-width: 250px;
      box-shadow: black 0 0 16px 0px;
      z-index: 1;
    }
    .dropdown-content a {
      color: ${styles.sand};
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
    .dropdown-content a:hover {
      box-shadow: inset 0 0 100px 100px rgba(255, 255, 255, 0.07);
    }
    .controls:hover+.dropdown-content, .dropdown-content:hover {
      display: block;
    }
`;

class SpotifyCardWebComponent extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.config = {};
  }

  set hass(hass) {
    // console.log('HASS:', hass);
    if (!this.savedHass) {
      this.savedHass = hass;
    }
  }

  setConfig(config) {
    if (!config.client_id) {
      throw new Error('No client ---- id');
    }
    this.config = config;
  }

  getCardSize() {
    return 10;
  }

  disconnectedCallback() {
    this.shadow.innerHTML = '';
  }

  connectedCallback() {
    if (!this.config.client_id) {
      this.config.client_id = this.getAttribute('client_id');
    }
    const mountPoint = document.createElement('div');
    this.shadow.appendChild(styleElement);
    this.shadow.appendChild(mountPoint);
    render(
      html`
        <${SpotifyCard}
          clientId=${this.config.client_id}
          limit=${this.config.limit || 10}
          player=${this.config.device || '*'}
          hass=${this.savedHass}
          featuredPlaylists=${this.config.featuredPlaylists || false}
          featuredPlaylistsCountryCode=${this.config.featuredPlaylistsCountryCode || ""}
          dailyMixes=${this.config.dailyMixes || false}
          account=${this.config.account || ''}
          height=${this.config.height || ''}
          random_song=${this.config.random_song || false}
        />
      `,
      mountPoint
    );
  }
}
customElements.define('spotify-card', SpotifyCardWebComponent);
