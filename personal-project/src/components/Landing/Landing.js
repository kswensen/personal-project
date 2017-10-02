import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateNewRelease, updateNewReleaseImage, updateNewReleaseTitle } from '../../ducks/reducer';
import axios from 'axios';
import './Landing.css';

class Landing extends Component {
    constructor() {
        super();

        this.state = {
            newReleases: []
        }
    }

    componentDidMount() {
        axios.get('/api/getNewReleases').then(res => {
            this.setState({
                newReleases: res.data
            });
        });
    }

    render() {
        let mappedNewReleases = this.state.newReleases.map((album, i) => {
            let artistArray = [];
            for (var j = 0; j < album.artists.length; j++) {
                artistArray.push(album.artists[j].name);
            }
            const splitArtists = artistArray.toLocaleString().replace(',', ', ');
            return <ul key={i} className='album'>
                <Link to='/newReleases' className='albumLink'>
                    <div onClick={() => { this.props.updateNewRelease(album.id), this.props.updateNewReleaseImage(album.images[1].url), this.props.updateNewReleaseTitle(album.name) }}>
                        <img src={album.images[1].url} />
                        <div className='albumDetails'>
                            <p className='albumTitle'>{album.name}</p>
                            <p className='albumArtists'>{splitArtists}</p>
                        </div>
                    </div>
                </Link>
            </ul>
        });
        return (
            <div>
                {
                    this.props.user !== undefined
                        ?
                        <div className='loggedInLanding'>
                            <h4 className='welcome'>Welcome back, {this.props.user.first_name} {this.props.user.last_name}</h4>
                            <h3 className='title'>New Releases</h3>
                            <div className='filteredAlbumsContainer'>
                                {mappedNewReleases}
                            </div>
                        </div>
                        :
                        <div>
                            <div className='noUserContainer'>
                                <h4 className='noUser'>Your music, all in one location</h4>
                                <a href={process.env.REACT_APP_LOGIN}><button className='noUserLogin'>Sign Up</button></a>
                            </div>
                            <footer className='bottom'></footer>
                        </div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { updateNewRelease, updateNewReleaseImage, updateNewReleaseTitle })(Landing);