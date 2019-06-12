import React, {Component} from 'react';
import './App.css';
import Menu from './Menu';
import ExibeMapa from './ExibeMapa';

const FS_CLIENT = "SLBP0YO2YHBJ4JOCSUDL214ZJDC24OWZ5AJRR0L5D5L4MNWR";
const FS_SECRET = "ZIYJ403NKDXVWHMA3DCPWMW3WDED35R2AJVEUS54XXJ4BBEY";
const FS_CAT = "hotel";

class App extends Component {
  //enviando dados via state (dinâmico)
  state = {
    lat: -15.795092,
    lon: -47.885115,
    zoom: 15,
    all: [],
    filtered: null,
    open: false,
    selectedId: null,
    activeMarker: null
  };

  realMarkers = [];

  styles = {
    menuButton: {
      marginLeft: 10,
      marginRight: 20,
      position: "absolute",
      left: 10,
      top: 20,
      background: "white",
      padding: 10
    },
    hide: {
      display: 'none'
    },
    header: {
      marginTop: "0px"
    }
  };

  componentDidMount = () => {
    // Carrega a API do Foursquare
    let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=20180323&radius=5000&ll=${this.state.lat},${this.state.lon}&intent=browse&query=${FS_CAT}`;
    let headers = new Headers();
    let request = new Request(url, {
      method: 'GET',
      headers
    });
    fetch(request)
      .then(response => response.json())
      .then(json => {
        const all = json.response.venues;
        this.setState({
          all,
          filtered: this.filterVenues(all, "")
        });
      })
      .catch(error => {
        alert("FourSquare não pode ser carregado");
      });
  }

  saveRealMarker = marker => {
    if (this.realMarkers.indexOf(marker) === -1 && marker !== null)
      this.realMarkers.push(marker);
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    });
  }

  updateQuery = (query) => {
    // Atualiza o valor da query e filtra os resultados
    this.setState({
      selectedIndex: null,
      filtered: this.filterVenues(this.state.all, query)
    });
  }

  filterVenues = (venues, query) => {
    return venues.filter(venue => venue.name.toLowerCase().includes(query.toLowerCase()));
  }

  clickMarker = (id) => {
    const marker = this.realMarkers.filter(marker => marker.marker.id === id)[0];
    this.setState({
      selectedId: id,
      activeMarker: marker
    })
  }

  render = () => {
    return (
      <div className="App">
        <div>
          <button onClick={this.toggleDrawer} style={this.styles.menuButton}>
            Menu
          </button>
          <h1>Hotéis em Brasília</h1>
        </div>
        <ExibeMapa
          lat={this.state.lat}
          lon={this.state.lon}
          zoom={this.state.zoom}
          venues={this.state.filtered}
          saveRealMarker={this.saveRealMarker}
          clickMarker={this.clickMarker}
          activeMarker={this.state.activeMarker} />
        <Menu
          venues={this.state.filtered}
          open={this.state.open}
          toggleDrawer={this.toggleDrawer}
          filterVenues={this.updateQuery}
          clickMarker={this.clickMarker}/>
      </div>
    );
  }
}

export default App;