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

    standardTime(time) {
        let seconds = (time / 1000) % 60
        let minutes = (time / (1000 * 60)) % 60
        let hours = (time / (1000 * 60 * 60)) % 24
        if (Math.round(hours) >= 1) {
            return Math.round(hours) + ":" + Math.round(minutes) + ":" + Math.round(seconds);
        } else if (Math.round(seconds) < 10) {
            return Math.round(minutes) + ":0" + Math.round(seconds);
        } else {
            return Math.round(minutes) + ":" + Math.round(seconds);
        }
    }

    truncateString(str, num) {
        if (num >= str.length) {
            str = str.slice(str, num);
            return str;
        }
        else if (num <= 3) {
            str = str.slice(str, num) + "...";
            return str;
        }
        else {
            str = str.slice(str, num - 3) + "...";
            return str;
        }
    }

    render() {
        const mappedTracks = this.state.tracks.map((track, i) => {
            let artistArray = [];
            for (var j = 0; j < track.track.artists.length; j++) {
                artistArray.push(track.track.artists[j].name);
            }
            const splitArtists = artistArray.toLocaleString().replace(',', ', ');
            return <ul key={i} className='track'>
                <img src={track.track.album.images[2].url} />
                <div className='titleContainer'>
                    <p>{this.truncateString(track.track.name, 52)}</p>
                </div>
                {
                    track.track.explicit
                        ?
                        <h1 className='searchExplicit'>EXPLICIT</h1>
                        :
                        null
                }
                <div className='artistContainer'>
                    <p>{this.truncateString(splitArtists, 50)}</p>
                </div>
                <div className='albumContainer'>
                    <p>{this.truncateString(track.track.album.name, 30)}</p>
                </div>
                <div className='time'>
                    <p>{this.standardTime(track.track.duration_ms)}</p>
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
                    <p className='time'>Duration</p>
                </div>
                {mappedTracks}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        playlist_id: state.playlist_id
    }
}

export default connect(mapStateToProps)(Tracks);