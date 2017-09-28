import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'underscore';
import './Search.css';
import { updateSongOffset, updateArtistOffset, updateAlbumOffset } from '../../ducks/reducer';

class Search extends Component {
    constructor() {
        super();

        this.state = {
            songs: [],
            artists: [],
            albums: [],
            userSongs: []
        }
    }

    componentWillMount() {
        axios.get('/api/getUserSongs').then(res => {
            this.setState({
                userSongs: res.data
            });
        });
        axios.get('/api/filterBySong?song=' + this.props.searchTerm).then(res => {
            if (res.status === 200) {
                this.setState({
                    songs: res.data
                })
            }
        });
        axios.get('/api/filterByAlbum?album=' + this.props.searchTerm).then(res => {
            if (res.status === 200) {
                this.setState({
                    albums: res.data
                })
            }
        });
        axios.get('/api/filterByArtist?artist=' + this.props.searchTerm).then(res => {
            if (res.status === 200) {
                var artistArr = [];
                for (var i = 0; i < res.data.length; i++) {
                    artistArr.push(res.data[i].artist)
                }
                if (artistArr[0]) {
                    var allArtists = artistArr.reduce((prev, curr) => {
                        return [...prev, ...curr];
                    });
                }
                this.setState({
                    artists: allArtists
                })
            }
        });
    }

    componentWillReceiveProps(props) {
        var songs;
        var albums;
        axios.get('/api/filterBySong?song=' + props.searchTerm).then(res => {
            if (res.status === 200) {
                songs = res.data;
            }
        }).then(response2 => {
            axios.get('/api/filterByAlbum?album=' + props.searchTerm).then(res => {
                if (res.status === 200) {
                    albums = res.data;
                }
            }).then(response3 => {
                axios.get('/api/filterByArtist?artist=' + props.searchTerm).then(res => {
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

    getSongs() {
        axios.get(`/api/getSongs?searchTerm=${this.props.searchTerm}&offset=${this.props.songOffset}`).then(res => {
            let newSongs = [...this.state.songs, res.data];
            newSongs = _.flatten(newSongs);
            this.setState({
                songs: newSongs
            })
        });
        this.props.updateSongOffset(this.props.songOffset + 20);
    }

    getArtists() {
        axios.get(`/api/getArtists?searchTerm=${this.props.searchTerm}&offset=${this.props.artistOffset}`).then(res => {
            let newArtists = [...this.state.artists, res.data];
            newArtists = _.flatten(newArtists);
            this.setState({
                artists: newArtists
            });
        });
        this.props.updateArtistOffset(this.props.artistOffset + 20);
    }

    getAlbums() {
        axios.get(`/api/getAlbums?searchTerm=${this.props.searchTerm}&offset=${this.props.albumOffset}`).then(res => {
            let newAlbums = [...this.state.albums, res.data];
            newAlbums = _.flatten(newAlbums);
            this.setState({
                albums: newAlbums
            });
        });
        this.props.updateAlbumOffset(this.props.albumOffset + 20);
    }

    addSong(songid) {
        const config = {
            songid: songid
        }
        axios.post('/api/addToFavorites', config).then(res => {
            alert(res.data);
        });
    }

    render() {
        // Songs

        if (typeof this.state.songs === 'object') {
            var filteredSongs = this.state.songs.map((song, i) => {
                const splitArtists = song.artist.toLocaleString().replace(',', ', ');
                let existingSong = false;
                for (var j = 0; j < this.state.userSongs.length; j++) {
                    if (song.songuri === this.state.userSongs[j].songuri) {
                        existingSong = true;
                    }
                }
                return <ul key={i} className='song'>
                    <img src={song.song_artwork} />
                    <div className='titleContainer'>
                        {
                            existingSong
                                ?
                                <p className='addSong'>X</p>
                                :
                                <p className='addSong' onClick={() => this.addSong(song.songid)}>+</p>
                        }
                        <p>Title: {song.title}</p>
                    </div>
                    <div className='albumContainer'>
                        <p>Album: {song.album}</p>
                    </div>
                    <div className='artistContainer'>
                        <p>Artist: {splitArtists}</p>
                    </div>
                </ul>
            });
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
            if (!this.state.albums[0]) {
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
            if (!this.state.artists[0]) {
                filteredArtists = `No Artists Match: ${this.props.searchTerm}`
            }
        } else {
            filteredArtists = `No Artists Match: ${this.props.searchTerm}`;
        }
        return (
            <div className='background'>
                <h4>Search Results</h4>
                <h1>Songs</h1>
                {filteredSongs}
                <button onClick={() => this.getSongs()}>Want more songs?</button>
                <h1>Albums</h1>
                {filteredAlbums}
                <button onClick={() => this.getAlbums()}>Want more albums?</button>
                <h1>Artists</h1>
                {filteredArtists}
                <button onClick={() => this.getArtists()}>Want more artists?</button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        searchTerm: state.searchTerm,
        fireRedirect: state.fireRedirect,
        songOffset: state.songOffset,
        artistOffset: state.artistOffset,
        albumOffset: state.albumOffset
    }
}

export default connect(mapStateToProps, { updateSongOffset, updateArtistOffset, updateAlbumOffset })(Search);