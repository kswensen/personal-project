import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './Tracks.css';

class Tracks extends Component {
    constructor() {
        super();

        this.state = {
            description: '',
            image: '',
            name: '',
            tracks: []
        }
    }

    componentDidMount() {
        axios.get(`/api/getPlaylistsTracks?id=${this.props.playlist_id}`).then(res => {
            this.setState({
                description: res.data[0],
                image: res.data[1],
                name: res.data[2],
                tracks: res.data[3].items
            });
        });
    }

    render() {
        const mappedTracks = this.state.tracks.map((track, i) => {
            let artistArray = [];
            for(var j = 0; j < track.track.artists.length; j++){
                artistArray.push(track.track.artists[j].name);
            }
            const splitArtists = artistArray.toLocaleString().replace(',', ', ');
            return <ul key={i} className='track'>
                <img src={track.track.album.images[2].url} />
                <div className='titleContainer'>
                    <p>{track.track.name}</p>
                </div>
                <div className='albumContainer'>
                    <p>{track.track.album.name}</p>
                </div>
                <div className='artistContainer'>
                    <p>{splitArtists}</p>
                </div>
            </ul>
        });
        return (
            <div className='tracksBackground'>
                <h2 onClick={() => window.history.back()} className='back'>&lt; Back</h2>
                <div className='header'>
                    <div className='headerLeft'>
                        <img src={this.state.image} />
                    </div>
                    <div className='headerRight'>
                        <div className='playlistTitle'>
                            <h2>{this.state.name}</h2>
                        </div>
                        <p>{this.state.description}</p>
                    </div>
                </div>
                <div className='table'>
                    <p className='tableTitle'>Title</p>
                    <p className='tableAlbum'>Album</p>
                    <p className='tableArtist'>Artist</p>
                </div>
                {mappedTracks}
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        playlist_id: state.playlist_id
    }
}

export default connect(mapStateToProps)(Tracks);