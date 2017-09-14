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

    componentDidMount() {
        axios.get('http://localhost:3011/api/filterBySong?song=' + this.props.searchTerm).then(res => {
            if (res.status === 200) {
                this.setState({
                    songs: res.data
                })
            }
        });
        axios.get('http://localhost:3011/api/filterByAlbum?album=' + this.props.searchTerm).then(res => {
            if (res.status === 200) {
                console.log('res.data: ', res.data)
                var albumArr = [];
                for(var i = 0; i < res.data.length; i++){
                    var tempObj = {
                         album: res.data[i].album,
                         artist: res.data[i].artist,
                         album_artwork: res.data[i].album_artwork
                    }
                    albumArr.push(tempObj);
                }
                console.log('albumArr: ', albumArr);
                for (var j = 0; j < i - 1; j++) {
                    let album = albumArr[j].album;
                    for (var i = albumArr.length - 1; i >= 0; i--) {
                      if(albumArr[i].album == album) {
                        albumArr.splice(i, 1)
                      }
                    }
                  }
                console.log('albumArr2: ', albumArr)
                // const allAlbums = albumArr.reduce((prev, curr, i, arr) => {
                //     let firstAlbum = arr[0].album
                //     if(arr[i].album != firstAlbum){
                //         firstAlbum = curr;
                //         return curr;
                //     } else {
                //         return prev;
                //     }
                // }, 1)
                // console.log('allAlbums: ', allAlbums)
                // this.setState({
                //     albums: albumArr
                // })
            }
        });
        axios.get('http://localhost:3011/api/filterByArtist?artist=' + this.props.searchTerm).then(res => {
            if (res.status === 200){
                var artistArr  = [];
                for(var i = 0; i < res.data.length; i++){
                    artistArr.push(res.data[i].artist)
                }
                console.log('artistArr: ', artistArr)
                var allArtists = artistArr.reduce((prev, curr) => {
                    return [...prev, ...curr];
                });
                console.log('allArtists: ', allArtists)
                this.setState({
                    artists: allArtists
                })
            }
        })
    }

    render() {

        // Songs

        if (this.state.songs.length > 0) {
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

        // if (this.state.albums.length > 0) {
        //     var filteredAlbums = this.state.albums.map((album, i) => {
        //         const splitArtists = album.artist.toLocaleString().replace(',', ', ');
        //         return <ul key={i}>
        //             <img src={album.album_artwork} />
        //             <p>Album: {album.album}</p>
        //             <p>Artist: {splitArtists}</p>
        //         </ul>
        //     })
        // } else {
        //     filteredAlbums = `No Albums Match: ${this.props.searchTerm}`;
        // }

        // Artists

        if (this.state.artists.length > 0){
            var filteredArtists = this.state.artists.filter((el, i, arr) => {
                if (arr[i].includes(this.props.searchTerm)){
                    return arr.indexOf(el) === i;
                }
            })
            filteredArtists = filteredArtists.map((artist, i) => {
                return <ul key={i}>
                    <p>Artist: {artist}</p>
                </ul>
            })
        } else {
            filteredArtists = `No Artists Match: ${this.props.searchTerm}`;
        }
        return (
            <div>
                <h4>Search Results</h4>
                <h1>Songs</h1>
                {filteredSongs}
                <h1>Albums</h1>
                {/* {filteredAlbums} */}
                <h1>Artists</h1>
                {filteredArtists}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        searchTerm: state.searchTerm
    }
}

export default connect(mapStateToProps)(Search);