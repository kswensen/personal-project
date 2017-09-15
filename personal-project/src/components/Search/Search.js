import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'underscore';
import './Search.css';


class Search extends Component {
    constructor() {
        super();

        this.state = {
            songs: [],
            artists: [],
            albums: []
        }
    }

    componentWillMount() {
        axios.get('http://localhost:3010/api/filterBySong?song=' + this.props.searchTerm).then(res => {
            if (res.status === 200) {
                this.setState({
                    songs: res.data
                })
            }
        });
        axios.get('http://localhost:3010/api/filterByAlbum?album=' + this.props.searchTerm).then(res => {
            if (res.status === 200) {
                this.setState({
                    albums: res.data
                })
            }
        });
        axios.get('http://localhost:3010/api/filterByArtist?artist=' + this.props.searchTerm).then(res => {
            if (res.status === 200) {
                var artistArr = [];
                for (var i = 0; i < res.data.length; i++) {
                    artistArr.push(res.data[i].artist)
                }
                if(artistArr[0]){
                    var allArtists = artistArr.reduce((prev, curr) => {
                        return [...prev, ...curr];
                    });
                }
                this.setState({
                    artists: allArtists
                })
            }
        })
    }

    componentWillReceiveProps(props) {
        var songs;
        var albums;
        axios.get('http://localhost:3010/api/filterBySong?song=' + props.searchTerm).then(res => {
            if (res.status === 200) {
                songs = res.data;
            }
        }).then(response2 => {
            axios.get('http://localhost:3010/api/filterByAlbum?album=' + props.searchTerm).then(res => {
                if (res.status === 200) {
                    albums = res.data;
                }
            }).then(response3 => {
                axios.get('http://localhost:3010/api/filterByArtist?artist=' + props.searchTerm).then(res => {
                    if (res.status === 200) {
                        var artistArr = [];
                        var allArtists = [];
                        for (var i = 0; i < res.data.length; i++) {
                            artistArr.push(res.data[i].artist);
                        }
                        if (artistArr[0]) {
                            allArtists = artistArr.reduce((prev, curr) => {
                                return [...prev, ...curr];
                            });
                        }
                        this.setState({
                            artists: allArtists,
                            albums: albums,
                            songs: songs
                        })
                    }
                })
            })
        })


    }

    render() {

        // Songs

        if (typeof this.state.songs === 'object') {
            var filteredSongs = this.state.songs.map((song, i) => {
                const splitArtists = song.artist.toLocaleString().replace(',', ', ');
                return <ul key={i} className='song'>
                    <img src={song.song_artwork} />
                    <div className='titleContainer'>
                        <p>Title: {song.title}</p>
                    </div>
                    <div className='albumContainer'>
                        <p>Album: {song.album}</p>
                    </div>
                    <div className='artistContainer'>
                        <p>Artist: {splitArtists}</p>
                    </div>
                </ul>
            })
        } else {
            filteredSongs = `No Songs Match: ${this.props.searchTerm}`;
        }

        // Albums

        if (typeof this.state.albums === 'object') {
            var filteredAlbums = this.state.albums.map((album, i) => {
                const splitArtists = album.artist.toLocaleString().replace(',', ', ');
                return <ul key={i} className='album'>
                    <img src={album.album_artwork} />
                    <p>Album: {album.album}</p>
                    <p>Artist: {splitArtists}</p>
                </ul>
            })
            if(!this.state.albums[0]) {
                filteredAlbums = `No Albums Match: ${this.props.searchTerm}`
            }
        } else {
            filteredAlbums = `No Albums Match: ${this.props.searchTerm}`;
        }

        // Artists
        if (typeof this.state.artists === 'object' || typeof this.state.artists === 'array') {
            var filteredArtists = this.state.artists.filter((el, i, arr) => {
                if (arr[i].toLowerCase().includes(this.props.searchTerm.toLowerCase())) {
                    return arr.indexOf(el) === i;
                }
            })
            filteredArtists = filteredArtists.map((artist, i) => {
                return <ul key={i}>
                    <p>Artist: {artist}</p>
                </ul>
            })
            if(!this.state.artists[0]) {
                filteredArtists = `No Artists Match: ${this.props.searchTerm}`
            }
        } else {
            filteredArtists = `No Artists Match: ${this.props.searchTerm}`;
        }
        return (
            <div>
                <h4>Search Results</h4>
                <h3>Global State: {this.props.searchTerm}</h3>
                <h1>Songs</h1>
                {filteredSongs}
                <h1>Albums</h1>
                {filteredAlbums}
                <h1>Artists</h1>
                {filteredArtists}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        searchTerm: state.searchTerm,
        fireRedirect: state.fireRedirect
    }
}

export default connect(mapStateToProps)(Search);