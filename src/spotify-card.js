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
import '@babel/polyfill';
// impport 'https://unpkg.com/babel-polyfill@6.26.0/dist/polyfill.min.js';

// import { html, h, Component, render } from 'https://unpkg.com/htm/preact/standalone.mjs';
import { h, Component, render } from 'preact';
import htm from 'htm';

const html = htm.bind(h);

class PlayerSelect extends Component {
  constructor() {
    super();
    this.state = {
      selectedDevice: '-- choose mediaplayer --',
      chromecastDevices: [],
    };
  }

  componentWillReceiveProps(props, state) {
    if (props.selectedDevice) {
      this.setState({ selectedDevice: props.selectedDevice.name });
    }

    if (props.hass) {
      const chromecastSensor = props.hass.states['sensor.chromecast_devices'];
      if (chromecastSensor) {
        const chromecastDevices = JSON.parse(chromecastSensor.attributes.devices_json);
        this.setState({chromecastDevices});
      }
    }
  }

  selectDevice(device) {
    this.setState({ selectedDevice: device.name });
    this.props.onMediaplayerSelect(device);
  }

  selectChromecastDevice(device) {
    this.props.onChromecastDeviceSelect(device);
  }

  render() {
    const { devices } = this.props;
    const { chromecastDevices } = this.state;
    return html`
      <div class="dropdown">
        <div class="mediaplayer_select">
          <svg
            class="mediaplayer_speaker_icon"
            width="220"
            height="220"
            viewBox="0 0 220 220"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#c9c9c9"
              d="M197.766 112.275q0 56.608-34.867 105.006l-8.157-6.984q32.743-44.355 32.743-98.022 0-52.565-32.632-97.9l8.158-6.984q34.755 48.398 34.755 104.884zm-24.586 0q0 46.928-28.831 88.22l-8.158-6.74q26.708-38.228 26.708-81.48 0-43.13-26.708-81.359l8.158-6.74q28.831 40.435 28.831 88.099zm-24.585 0q0 37.126-22.908 71.434l-8.27-6.617q20.897-30.632 20.897-64.817 0-33.573-20.897-64.818l8.27-6.616q22.908 34.308 22.908 71.434zm-54.646 89.2l-52.634-53.3H8.125V76.374h33.302l52.522-53.177v178.278z"
              stroke="null"
            />
          </svg>
          ${this.state.selectedDevice}
        </div>
        <div class="dropdown-content">
          <a onClick=${() => {}}><i>Spotify Connect devices</i></a>
          ${devices.map(
            (device, idx) => html`
              <a onClick=${() => this.selectDevice(device)} style="margin-left: 15px">${device.name}</a>
            `
          )}
          <a onClick=${() => {}}><i>Chromecast devices</i></a>
          ${chromecastDevices.map(
             chromecastDevice => html`
              <a onClick=${() => this.selectChromecastDevice(chromecastDevice)} style="margin-left: 15px">${chromecastDevice.name + ' (' + chromecastDevice.cast_type + ')'}</a>
            `
          )}
        </div>
      </div>
    `;
  }
}

class SpotifyCard extends Component {
  constructor(props) {
    super(props);
    this.dataRefreshToken = null;
    this.state = {
      user: {},
      playlists: [],
      devices: [],
      selectedPlaylist: null,
      selectedDevice: null,
      playingPlaylist: null,
      authenticationRequired: true
    };
    this.scopes = [
      'playlist-read-private',
      'user-read-playback-state',
      'user-modify-playback-state',
    ];
  }

  async componentDidMount() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get('access_token') || localStorage.getItem('access_token');
    const token_expires_ms = localStorage.getItem('token_expires_ms');

    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    const userResp = await fetch('https://api.spotify.com/v1/me', { headers }).then(r => r.json());

    if (userResp.error) {
      if (userResp.error.status === 401) {
        // Have a token but it is old
        if (access_token && 0 + token_expires_ms - new Date().getTime() < 0) {
          return this.authenticateSpotify();
        }
        // no token - show login button
        this.setState({ authenticationRequired: true });
        return;
      }
      console.error('This should never happen:', response);
      return this.setState({ error: response.error });
    }

    if (hashParams.get('access_token')) {
      const expires_in = hashParams.get('expires_in');
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('token_expires_ms', new Date().getTime() + expires_in * 1000);

      // Auth success, remove the parameters from spotify
      const newurl = window.location.href.split('#')[0];
      window.history.pushState({ path: newurl }, '', newurl);
    }

    this.setState({ user: userResp, authenticationRequired: false });

    await this.refreshPlayData();

    this.dataRefreshToken = setInterval(async () => {
      await this.refreshPlayData();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.dataRefreshToken);
  }

  async refreshPlayData() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    };

    const playlists = await fetch('https://api.spotify.com/v1/me/playlists?limit=' + this.props.limit, { headers })
      .then(r => r.json())
      .then(p => p.items);
    const devices = await fetch('https://api.spotify.com/v1/me/player/devices', { headers })
      .then(r => r.json())
      .then(r => r.devices);

    const currentPlayerRes = await fetch('https://api.spotify.com/v1/me/player', { headers });

    let selectedDevice,
      playingPlaylist = null;
    // 200 is returned when something is playing. 204 is ok status without body.
    if (currentPlayerRes.status === 200) {
      const currentPlayer = await currentPlayerRes.json();
      if (currentPlayer.is_playing) {
        selectedDevice = currentPlayer.device;
        if (currentPlayer.context && currentPlayer.context.external_urls) {
          // console.log('Currently playing:', currentPlayer);
          const currPlayingHref = currentPlayer.context.external_urls.spotify;
          playingPlaylist = playlists.find(pl => currPlayingHref === pl.external_urls.spotify);
        }
      }
    }
    this.setState({ playlists, devices, selectedDevice, playingPlaylist });
  }

  authenticateSpotify() {
    const redirectUrl = window.location.href.split('?')[0];
    const { clientId } = this.props;
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${this.scopes.join(
      '%20'
    )}&response_type=token`;
  }

  playPlaylist() {
    const { selectedPlaylist, selectedDevice } = this.state;
    if (!selectedPlaylist || !selectedDevice) {
      console.error('Will not play because there is no playlist or device selected');
      return;
    }
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + selectedDevice.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({ context_uri: selectedPlaylist.uri }),
    }).then(() => this.setState({ playingPlaylist: selectedPlaylist }));
  }

  onPlaylistSelect(playlist) {
    this.setState({ selectedPlaylist: playlist });
    this.playPlaylist();
  }

  onMediaPlayerSelect(device) {
    this.setState({ selectedDevice: device });
  }

  onChromecastDeviceSelect(device) {
    const playlist = this.state.playingPlaylist ? this.state.playingPlaylist : this.state.playlists[0];
    if (!playlist) {
      console.error('Nothing to play, skipping starting chromecast device');
      return;
    }
    // console.log('Starting:', playlist.uri, ' on ', device.name);
    this.props.hass.callService('spotcast', 'start', {
      device_name: device.name,
      uri: playlist.uri
    });
  }

  getHighlighted(playlist) {
    const { selectedPlaylist } = this.state;
    const selectedPlaylistId = selectedPlaylist ? selectedPlaylist.id : '';
    return playlist.id === selectedPlaylistId ? 'highlight' : '';
  }

  getIsPlayingClass(playlist) {
    const { playingPlaylist } = this.state;
    const playingPlaylistId = playingPlaylist ? playingPlaylist.id : '';
    return playlist.id === playingPlaylistId ? 'playing' : '';
  }

  render() {
    const { authenticationRequired, playlists, devices, selectedDevice } = this.state;
    if (authenticationRequired) {
      return html`
        <div class="spotify_container">
          <${Header} />
          <div class="login__box">
            <button class="greenButton" onClick=${() => this.authenticateSpotify()}>AUTHENTICATE</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="spotify_container">
        <${Header} />
        <div class="playlists">
          ${playlists.map(
            (playlist, idx) => 
            {
              const image = playlist.images[0] 
                  ? playlist.images[0].url 
                  : 'https://via.placeholder.com/150x150.png?text=No+image';
              return html`
              <div
                class="${`playlist ${this.getHighlighted(playlist)}`}"
                onClick=${event => this.onPlaylistSelect(playlist, idx, event, this)}
              >
                <div class="playlist__cover_art"><img src="${image}" /></div>
                <div class="playlist__number">${idx + 1}</div>
                <div class="${`playlist__playicon ${this.getIsPlayingClass(playlist)}`}">►</div>
                <div class="playlist__title">${playlist.name}</div>
              </div>
            `}
          )}
        </div>
        <div class="controls">
          <${PlayerSelect}
            devices=${devices}
            selectedDevice=${selectedDevice}
            hass=${this.props.hass}
            onMediaplayerSelect=${device => this.onMediaPlayerSelect(device)}
            onChromecastDeviceSelect=${device => this.onChromecastDeviceSelect(device)}
          />
        </div>
      </div>
    `;
  }
}

const Header = () => html`
  <div class="header">
    <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" />
  </div>
`;

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
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: ${styles.lightBlack};
      min-width: 250px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
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
    .dropdown:hover .dropdown-content {
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
        <${SpotifyCard} clientId=${this.config.client_id} limit=${this.config.limit || 10} hass=${this.savedHass}/>
      `,
      mountPoint
    );
  }
}
customElements.define('spotify-card', SpotifyCardWebComponent);
