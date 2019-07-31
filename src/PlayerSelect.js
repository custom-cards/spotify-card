import { h, Component } from 'preact';
import htm from 'htm';

const html = htm.bind(h);

export default class PlayerSelect extends Component {
  constructor() {
    super();
    this.state = {
      selectedDevice: '-- choose mediaplayer --',
      castEntities: [],
    };
  }

  componentWillUnmount() {
    typeof this.unsubscribeEntitites === 'function' && this.unsubscribeEntitites();
  }

  async componentDidMount() {
    await this.refreshCastEntities();
    this.dataRefreshToken = setInterval(async () => {
      await this.refreshCastEntities();
    }, 5000); // TODO: check if we can use the mp.spotify state instead?
  }

  async refreshCastEntities() {
    const res = await this.props.hass.callWS({
      type: 'config/entity_registry/list',
    });
    const castEntities = res
      .filter(e => e.platform == 'cast')
      .map(e => this.props.hass.states[e.entity_id])
      .filter(e => e != null);
    this.setState({ castEntities });
  }

  componentWillUnmount() {
    clearInterval(this.dataRefreshToken);
  }

  componentWillReceiveProps(props, state) {
    if (props.selectedDevice) {
      this.setState({ selectedDevice: props.selectedDevice.name });
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
    const { castEntities } = this.state;
    const choice_form = html`
      <div class="dropdown-content">
        <a onClick=${() => {}}><i>Spotify Connect devices</i></a>
        ${devices.map(
          (device, idx) => html`
            <a onClick=${() => this.selectDevice(device)} style="margin-left: 15px">${device.name}</a>
          `
        )}
        <a onClick=${() => {}}><i>Chromecast devices</i></a>
        ${castEntities.map(
          entitiy => html`
            <a onClick=${() => this.selectChromecastDevice(entitiy.attributes.friendly_name)} style="margin-left: 15px"
              >${entitiy.attributes.friendly_name}</a
            >
          `
        )}
      </div>
    `;

    let form = '';
    if (this.props.player && this.props.player == this.state.selectedDevice) {
      form = ''; // We have selected the player already
    } else if (this.props.player && this.props.player != this.state.selectedDevice) {
      const selected = devices.filter(d => d.name == this.props.player);
      if (selected.length == 1) {
        form = '';
        this.selectDevice(selected[0]);
      } else {
        // console.log(`Was not able to find player ${this.props.player} within ${JSON.stringify(devices)}`);
        form = choice_form;
      }
    } else {
      form = choice_form;
    }

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
        ${form}
      </div>
    `;
  }
}
