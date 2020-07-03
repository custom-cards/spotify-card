import { h, Component } from 'preact';
import htm from 'htm';
import PlayerSelect from './PlayerSelect';

const html = htm.bind(h);

export default class SpotifyCard extends Component {
  constructor(props) {
    super(props);
    this.dataRefreshToken = null;
    this.state = {
      playlists: [],
      devices: [],
      playlists: [],
      selectedDevice: null,
      selectedPlaylist: null,
      currentPlayer: null,
      playingPlaylist: null,
      authenticationRequired: true,
    };
    this.scopes = [
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-read-playback-state',
      'user-modify-playback-state',
    ];
  }

  async componentDidMount() {
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden) {
        await this.refreshPlayData();
      }
    });
    await this.checkAuthentication();
    await this.refreshPlayData();

    this.dataRefreshToken = setInterval(async () => {
      await this.refreshPlayData();
    }, 5000); // TODO: check if we can use the mp.spotify state instead?
  }

  componentWillUnmount() {
    clearInterval(this.dataRefreshToken);
  }

  getLocalStorageTokenName() {
    const account = this.props.account ? this.props.account : 'default';
    return 'spotify-access_token-' + account;
  }

  async checkAuthentication() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get('access_token') || localStorage.getItem(this.getLocalStorageTokenName());
    const token_expires_ms = localStorage.getItem(this.getLocalStorageTokenName() + '-expires_ms');

    if (access_token && 0 + token_expires_ms - new Date().getTime() > 30000 && !this.state.authenticationRequired) {
      console.log(
        'CheckAuth no check required: authenticationRequired, expires in:',  token_expires_ms - new Date().getTime()
      );
      return;
    }

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
        return this.setState({ authenticationRequired: true });
      }
      console.error('This should never happen:', response);
      return this.setState({ error: response.error });
    }

    if (hashParams.get('access_token')) {
      const expires_in = hashParams.get('expires_in');
      localStorage.setItem(this.getLocalStorageTokenName(), access_token);
      localStorage.setItem(this.getLocalStorageTokenName() + '-expires_ms', new Date().getTime() + expires_in * 1000);

      // Auth success, remove the parameters from spotify
      const newurl = window.location.href.split('#')[0];
      window.history.pushState({ path: newurl }, '', newurl);
    }

    this.setState({ authenticationRequired: false });
  }

  async refreshPlayData() {
    if (document.hidden || this.state.authenticationRequired) {
      return;
    }
    await this.checkAuthentication();

    const headers = {
      Authorization: `Bearer ${localStorage.getItem(this.getLocalStorageTokenName())}`,
    };

    let playlists;
    if (this.state.playlists.length > 0) {
      playlists = this.state.playlists;
    } else {
      if (this.props.featuredPlaylists) {
        let url = 'https://api.spotify.com/v1/browse/featured-playlists?limit=' + this.props.limit;
        if (this.props.featuredPlaylistsCountryCode !== "") {
          url += "&country=" + this.props.featuredPlaylistsCountryCode;
        }
        playlists = await fetch(url, {
          headers,
        })
          .then(r => r.json())
          .then(r => r.playlists.items);
      } else if (this.props.dailyMixes) {
        const res = await this.props.hass.callWS({
          type: 'spotcast/playlists',
        });
        playlists = res.content.items;
      } else {
        playlists = await fetch('https://api.spotify.com/v1/me/playlists?limit=' + this.props.limit, { headers })
          .then(r => r.json())
          .then(p => p.items);
      }
    }

    const devices = await fetch('https://api.spotify.com/v1/me/player/devices', { headers })
      .then(r => r.json())
      .then(r => r.devices);

    const currentPlayerRes = await fetch('https://api.spotify.com/v1/me/player', { headers });

    let selectedDevice,
      playingPlaylist = null,
      currentPlayer = null;
    // 200 is returned when something is playing. 204 is ok status without body.
    if (currentPlayerRes.status === 200) {
      currentPlayer = await currentPlayerRes.json();
      // console.log('Currently playing:', currentPlayer);
      selectedDevice = currentPlayer.device;
      if (currentPlayer.context && currentPlayer.context.external_urls) {
        const currPlayingHref = currentPlayer.context.external_urls.spotify;
        playingPlaylist = playlists.find(pl => currPlayingHref === pl.external_urls.spotify);
      }
    }

    this.setState({ playlists, devices, selectedDevice, playingPlaylist, currentPlayer });
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
      console.error('Will not play because there is no playlist or device selected,', selectedPlaylist, selectedDevice);
      return;
    }
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + selectedDevice.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(this.getLocalStorageTokenName())}`,
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

    if (this.state.currentPlayer) {
      fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem(this.getLocalStorageTokenName())}`,
        },
        body: JSON.stringify({ device_ids: [device.id], play: true }),
      });
    }
  }

  onChromecastDeviceSelect(device) {
    const playlist = this.state.playingPlaylist ? this.state.playingPlaylist : this.state.playlists[0];
    if (!playlist) {
      console.error('Nothing to play, skipping starting chromecast device');
      return;
    }
    console.log('onChromecastDeviceSelect', device);
    const options = {
      device_name: device,
      uri: playlist.uri,
      force_playback: this.state.currentPlayer != null,
      random_song: (this.props.random_song?this.props.random_song : false),
    };

    if (this.props.account) {
      options.account = this.props.account;
    }

    this.props.hass.callService('spotcast', 'start', options);
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

    const playlistStyle = { height: this.props.height ? parseInt(this.props.height) : 'auto' };

    return html`
      <div class="spotify_container">
        <${Header} />
        <div class="playlists" style=${playlistStyle}>
          ${playlists.map((playlist, idx) => {
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
            `;
          })}
        </div>
          <${PlayerSelect}
            devices=${devices}
            selectedDevice=${selectedDevice}
            hass=${this.props.hass}
            player=${this.props.player}
            onMediaplayerSelect=${device => this.onMediaPlayerSelect(device)}
            onChromecastDeviceSelect=${device => this.onChromecastDeviceSelect(device)}
          />
        </div>
    `;
  }
}

const Header = () => html`
  <div class="header">
    <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" />
  </div>
`;
