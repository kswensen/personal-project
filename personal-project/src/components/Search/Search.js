import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'underscore';
import './Search.css';
import { updateSongOffset, updateArtistOffset, updateAlbumOffset, updateAlbum, updateAlbumArtwork, updateArtist } from '../../ducks/reducer';

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
            });
        });
    }

    getArtists() {
        axios.get(`/api/getArtists?searchTerm=${this.props.searchTerm}&offset=${this.props.artistOffset}`).then(res => {
            let newArtists = [...this.state.artists, res.data];
            newArtists = _.flatten(newArtists);
            this.setState({
                artists: newArtists
            });
        });
    }

    getAlbums() {
        axios.get(`/api/getAlbums?searchTerm=${this.props.searchTerm}&offset=${this.props.albumOffset}`).then(res => {
            let newAlbums = [...this.state.albums, res.data];
            newAlbums = _.flatten(newAlbums);
            this.setState({
                albums: newAlbums
            });
        });
    }

    addSong(songid) {
        const config = {
            songid: songid
        }
        axios.post('/api/addToFavorites', config).then(res => {
            alert(res.data);
        }).then(done => {
            axios.get('/api/getUserSongs').then(res => {
                this.setState({
                    userSongs: res.data
                });
            });
        });
    }

    removeSong(songid) {
        axios.delete(`/api/removeFavorite?songid=${songid}`).then(res => {
            alert(res.data);
        }).then(deleted => {
            axios.get('/api/getUserSongs').then(res => {
                this.setState({
                    userSongs: res.data
                })
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
                return <ul key={i} className='track'>
                    <img src={song.song_artwork} />
                    {
                        existingSong
                            ?
                            <p className='deleteSong' onClick={() => this.removeSong(song.songid)}>&#10010;</p>
                            :
                            <p className='addSong' onClick={() => this.addSong(song.songid)}>&#10010;</p>
                    }
                    <div className='titleContainer'>
                        <p>{this.truncateString(song.title, 52)}</p>
                    </div>
                    {
                        song.explicit
                            ?
                            <h1 className='searchExplicit'>EXPLICIT</h1>
                            :
                            null
                    }
                    <div className='artistContainer'>
                        <Link to='/artist' className='albumLink'>
                            <p onClick={() => this.props.updateArtist(splitArtists)}>{this.truncateString(splitArtists, 50)}</p>
                        </Link>
                    </div>
                    <div className='albumContainer'>
                        <Link to='/album' className='albumLink'>
                            <p onClick={() => {this.props.updateAlbum(song.album), this.props.updateAlbumArtwork(song.album_artwork)}}>{this.truncateString(song.album, 30)}</p>
                        </Link>
                    </div>
                    <div className='time'>
                        <p>{this.standardTime(song.duration_ms)}</p>
                    </div>
                </ul>
            });
            if (!this.state.songs[0]) {
                filteredSongs = `No Songs Match: ${this.props.searchTerm}`
            }
        } else {
            filteredSongs = `No Songs Match: ${this.props.searchTerm}`;
        }

        // Albums

        if (typeof this.state.albums === 'object') {
            var filteredAlbums = this.state.albums.map((album, i) => {
                const splitArtists = album.artist.toLocaleString().replace(',', ', ');
                return <ul key={i} className='album'>
                    <Link to='/album' className='albumLink'>
                        <div onClick={() => {this.props.updateAlbum(album.album), this.props.updateAlbumArtwork(album.album_artwork)}}>
                            <img src={album.album_artwork} />
                            <div className='albumDetails'>
                                <p className='albumTitle'>{album.album}</p>
                                <p className='albumArtists'>{splitArtists}</p>
                            </div>
                        </div>
                    </Link>
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
                return <ul key={i} className='artistList'>
                    <Link to='/artist' className='albumLink'>
                        <p onClick={() => this.props.updateArtist(artist)}>{artist}</p>
                    </Link>
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
                <div className='resultsContainer'>
                    <h4 className='results'>Search Results</h4>
                </div>
                <h1 className='sectionHeader'>Songs</h1>
                {
                    filteredSongs === `No Songs Match: ${this.props.searchTerm}`
                        ?
                        <div className='noMatch'>{filteredSongs}</div>
                        :
                        <div>
                            <div className='table'>
                                <p className='tableTitle'>Title</p>
                                <p className='tableAlbum'>Album</p>
                                <p className='tableArtist'>Artist</p>
                                <p className='time'>Duration</p>
                            </div>
                            {filteredSongs}
                        </div>
                }
                <div className='spotifyButtonContainer'>
                    <button onClick={() => {this.props.updateSongOffset(this.props.songOffset + 20), setTimeout(() => {this.getSongs()}, 1000)}} className='spotifyButton'>Want more songs?</button>
                </div>
                <h1 className='sectionHeader'>Albums</h1>
                <div className='filteredAlbumsContainer'>
                    {
                        filteredAlbums === `No Albums Match: ${this.props.searchTerm}`
                            ?
                            <div className='noAlbumMatch'>{filteredAlbums}</div>
                            :
                            filteredAlbums
                    }
                </div>
                <div className='spotifyButtonContainer'>
                    <button onClick={() => {this.props.updateAlbumOffset(this.props.albumOffset + 20), setTimeout(() => {this.getAlbums()}, 1000)}} className='spotifyButton'>Want more albums?</button>
                </div>
                <h1 className='sectionHeader'>Artists</h1>
                {
                    filteredArtists === `No Artists Match: ${this.props.searchTerm}`
                        ?
                        <div className='noMatch'>{filteredArtists}</div>
                        :
                        filteredArtists
                }
                <div className='spotifyButtonContainerBottom'>
                    <button onClick={() => {this.props.updateArtistOffset(this.props.artistOffset + 20), setTimeout(() => {this.getArtists()}, 1000)}} className='spotifyButton'>Want more artists?</button>
                </div>
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

export default connect(mapStateToProps, { updateSongOffset, updateArtistOffset, updateAlbumOffset, updateAlbum, updateAlbumArtwork, updateArtist })(Search);