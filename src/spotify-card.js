
import { html, h, Component, render } from 'https://unpkg.com/htm/preact/standalone.mjs';


const svg = `<svg width="220" height="220" xmlns="http://www.w3.org/2000/svg"><path fill="#c9c9c9" d="M197.766 112.275q0 56.608-34.867 105.006l-8.157-6.984q32.743-44.355 32.743-98.022 0-52.565-32.632-97.9l8.158-6.984q34.755 48.398 34.755 104.884zm-24.586 0q0 46.928-28.831 88.22l-8.158-6.74q26.708-38.228 26.708-81.48 0-43.13-26.708-81.359l8.158-6.74q28.831 40.435 28.831 88.099zm-24.585 0q0 37.126-22.908 71.434l-8.27-6.617q20.897-30.632 20.897-64.817 0-33.573-20.897-64.818l8.27-6.616q22.908 34.308 22.908 71.434zm-54.646 89.2l-52.634-53.3H8.125V76.374h33.302l52.522-53.177v178.278z" stroke="null"/></svg>`;
////////////////////////////////////////
// SpotifyCard<img class="mediaplayer_speaker_img" src='data:image/svg+xml,${encodeURI(svg)}' />
////////////////////////////////////////
console.log('PPP', svg.replace(/"/g, "'"));
class PlayerSelect extends Component {
  state = {
    selectedDevice: '-- choose mediaplayer --'
  };

  selectDevice(device) {
    this.setState({selectedDevice: device.name});
    this.props.onMediaplayerSelect(device);
  }

  render() {
    const { devices } = this.props;

    return html`
            <div class="dropdown">
              	<div class="mediaplayer_select">
                    <svg class='mediaplayer_speaker_icon' width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'><path fill='#c9c9c9' d='M197.766 112.275q0 56.608-34.867 105.006l-8.157-6.984q32.743-44.355 32.743-98.022 0-52.565-32.632-97.9l8.158-6.984q34.755 48.398 34.755 104.884zm-24.586 0q0 46.928-28.831 88.22l-8.158-6.74q26.708-38.228 26.708-81.48 0-43.13-26.708-81.359l8.158-6.74q28.831 40.435 28.831 88.099zm-24.585 0q0 37.126-22.908 71.434l-8.27-6.617q20.897-30.632 20.897-64.817 0-33.573-20.897-64.818l8.27-6.616q22.908 34.308 22.908 71.434zm-54.646 89.2l-52.634-53.3H8.125V76.374h33.302l52.522-53.177v178.278z' stroke='null'/></svg>
                    ${this.state.selectedDevice}<button class="mediaplayer_button">…</button>
                </div>
              <div class="dropdown-content">
                ${devices.map((device, idx) => html`
                    <a onClick=${() => this.selectDevice(device)}>${device.name}</a>
                `)}
              </div>
            </div>
        `;
  }
}

class SpotifyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      playlists: [],
      devices: [],
      selectedPlaylist: null,
      selectedDevice: null,
      playingPlaylist: null
    };
    this.scopes = ['user-read-private', 'user-read-email', 'playlist-read-private', 'user-read-birthdate', 'user-read-playback-state', 'user-modify-playback-state'];
  }

  async componentDidMount() {
    const { clientId } = this.props;

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get('access_token') || localStorage.getItem('access_token');

    const headers = {
      'Authorization': `Bearer ${access_token}`
    };
    const userResp = await fetch('https://api.spotify.com/v1/me', {headers}).then(r => r.json());

    if (userResp.error) {
      if (userResp.error.status === 401) {
        const redirectUrl = window.location.href.split('?')[0];
        window.location.href = `https://accounts.spotify.com/sv/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${this.scopes.join('%20')}&response_type=token`;
        return;
      }
      return this.setState({ error: response.error });
    } else {
      localStorage.setItem('access_token', access_token);
      if(hashParams.get('access_token')) {
        window.location.href = window.location.href.split('#')[0];
      }
    }

    const playlists = await fetch('https://api.spotify.com/v1/me/playlists?limit=10', {headers}).then(r => r.json()).then(p => p.items)
    const devices = await fetch('https://api.spotify.com/v1/me/player/devices', {headers}).then(r => r.json()).then(r => r.devices);
    this.setState({ user: userResp, playlists, devices });
  }

  playPlaylist() {
    const {selectedPlaylist, selectedDevice} = this.state;
    if(!selectedPlaylist || !selectedDevice) {
      return;
    }
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + selectedDevice.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({context_uri: selectedPlaylist.uri }),
    })
    .then(() => this.setState({ playingPlaylist: selectedPlaylist }));
  }

  onPlaylistSelect(playlist) {
    this.setState({ selectedPlaylist: playlist});
  }

  getHighlighted(playlist) {
    const { selectedPlaylist } = this.state;
    const selectedPlaylistId = selectedPlaylist ? selectedPlaylist.id : '';
    return (playlist.id === selectedPlaylistId) ? 'highlight' : '';
  }

  getIsPlayingIcon(playlist) {
    const { playingPlaylist } = this.state;
    const playingPlaylistId = playingPlaylist ? playingPlaylist.id : '';
    return (playlist.id === playingPlaylistId) ? '►' : '';
  }

  render() {
    const { user, playlists, devices } = this.state;
    console.log('render', this.state);
    return html`
          <div class="spotify_container">
            <${Header} />
            <div class="playlists">
              ${playlists.map((playlist, idx) => html`
                <div class="${`playlist ${this.getHighlighted(playlist)}`}" onClick=${(event) => this.onPlaylistSelect(playlist, idx, event, this)}>
                    <div class="playlist__cover_art"><img src="${playlist.images[0].url}"/></div>
                    <div class="playlist__number">${idx + 1}</div>
                    <div class="playlist__playicon">${this.getIsPlayingIcon(playlist)}</div>
                    <div class="playlist__title">${playlist.name}</div>
                </div>
              `)}
            </div>
            <div class="controls">
                <${PlayerSelect} devices=${devices} onMediaplayerSelect=${device => this.setState({selectedDevice: device})}/>
                <button class="greenButton playButton" onClick=${() => this.playPlaylist()}>PLAY</button>
            </div>
          </div>
        `;
  }
}

const Header = () => html`<div class="header">
        <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" />
    </div>`

const styleElement = document.createElement('style');
const  styles = {
  green: 'rgb(30, 215, 96)',
  lightBlack: 'rgb(40, 40, 40)',
  black: 'rgb(24, 24, 24)',
  grey: 'rgb(170, 170, 170)',
  sand: 'rgb(200, 200, 200)',
  white: 'rgb(255, 255, 255)',
  blue: '#4688d7'
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
        height: 40px;
        margin-bottom: 10px;
    }

    .playlists {
        display: flex;
        flex-flow: column nowrap;
        margin-bottom: 50px;
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
        color: ${styles.green};
        margin-left: 10px;    }
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
        padding: 5px;
        width: 20px;
        height: 20px;
        margin-right: 5px;
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
    // console.log('Hass set:', hass);
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

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 6;
  }
  attributeChangedCallback() {
    console.log('attributeChangedCallback()');
  }
  disconnectedCallback() {
    console.log('disconnectedCallback');
  }
  connectedCallback() {
    if(!this.config.client_id) {
      this.config.client_id = this.getAttribute('client_id');
    }
    console.log('connectedCallback', this.savedHass);
    const mountPoint = document.createElement('div');
    this.shadow.appendChild(styleElement);
    this.shadow.appendChild(mountPoint);
    render(html`<${SpotifyCard} clientId=${this.config.client_id}/>`, mountPoint);
  }
}
customElements.define('spotify-card', SpotifyCardWebComponent);