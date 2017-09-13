import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './Search.css';

class Search extends Component {
    constructor(){
        super();

        this.state = {
            songs: []
        }
    }

    componentDidMount(){
        axios.get('http://localhost:3010/api/getAll').then(res => {
            this.setState({
                songs: res.data
            })
        })
    }

    render() {
        const filteredSongs = this.state.songs.map((song, i) => {
            return <ul key={i} className='song'>
                <img src={song.song_artwork} />
                <div className='titleContainer'>
                    <p>Title: {song.title}</p>
                </div>
                <div className='albumContainer'>
                    <p>Album :{song.album}</p>
                </div>
                <div className='artistContainer'>
                    <p>Artist: {song.artist}</p>
                </div>
            </ul>
        })
        return (
            <div>
                <h4>Search Results</h4>
                <p>{this.props.searchTerm}</p>
                {filteredSongs}
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