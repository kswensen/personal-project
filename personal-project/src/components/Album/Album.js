import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './Album.css';

class Album extends Component {
    constructor() {
        super();

        this.state = {
            image: '',
            artist: '',
            album: [],
            userSongs: []
        }
    }

    componentDidMount() {
        axios.get(`/api/getAlbum?album=${this.props.album_artwork}`).then(res => {
            this.setState({
                album: res.data,
                image: res.data[0].album_artwork,
                artist: res.data[0].artist
            });
        });
        axios.get('/api/getUserSongs').then(res => {
            this.setState({
                userSongs: res.data
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

    render() {
        let mappedAlbum = this.state.album.map((song, i) => {
            const splitArtists = song.artist.toLocaleString().replace(',', ', ');
            let existingSong = false;
            for (var j = 0; j < this.state.userSongs.length; j++) {
                if (song.songuri === this.state.userSongs[j].songuri) {
                    existingSong = true;
                }
            }
            return <ul key={i} className='albumSong'>
                <p className='songNumber'>{i + 1}</p>
                {
                    existingSong
                        ?
                        <p className='deleteAlbumSong' onClick={() => this.removeSong(song.songid)}>&#10010;</p>
                        :
                        <p className='addAlbumSong' onClick={() => this.addSong(song.songid)}>&#10010;</p>
                }
                <div className='titleContainer'>
                    <p>{song.title}</p>
                </div>
                {
                    song.explicit
                        ?
                        <h1 className='explicit'>EXPLICIT</h1>
                        :
                        null
                }
                <div className='time'>
                    <p>{this.standardTime(song.duration_ms)}</p>
                </div>
            </ul>
        });
        return (
            <div className='albumBackground'>
                <h2 onClick={() => window.history.back()} className='back'>&lt; Back</h2>
                <div className='header'>
                    <div className='headerLeft'>
                        <img src={this.state.image} />
                    </div>
                    <div className='headerRight'>
                        <div className='playlistTitle'>
                            <h2 className='propAlbum'>{this.props.album}</h2>
                        </div>
                        <p>By {this.state.artist}</p>
                    </div>
                </div>
                <div className='table'>
                    <p className='tableTitle'>Title</p>
                    <p className='time'>Duration</p>
                </div>
                {mappedAlbum}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        album: state.album,
        album_artwork: state.album_artwork
    }
}

export default connect(mapStateToProps)(Album);