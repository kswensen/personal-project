import React, { Component } from 'react';
import axios from 'axios';
import './Tracks.css';

export default class Tracks extends Component {
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
        axios.get(`/api/getPlaylistsTracks?id=${this.props.location.query}`).then(res => {
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
            return <ul key={i} className='song'>
                <img src={track.track.album.images[2].url} />
                <div className='titleContainer'>
                    <p>Title: {track.track.name}</p>
                </div>
                <div className='albumContainer'>
                    <p>Album: {track.track.album.name}</p>
                </div>
                <div className='artistContainer'>
                    <p>Artist: {splitArtists}</p>
                </div>
            </ul>
        });
        return (
            <div>
                <h2 onClick={() => window.history.back()}>&lt;</h2>
                <div className='header'>
                    <div className='headerLeft'>
                        <img src={this.state.image} />
                    </div>
                    <div className='headerRight'>
                        <h2>{this.state.name}</h2>
                        <p>{this.state.description}</p>
                    </div>
                </div>
                {mappedTracks}
            </div>
        )
    }
}