import React, { Component } from 'react';
import './NavBar.css';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import Profile from '../Profile/Profile';
import { connect } from 'react-redux';
import { search, updateFireRedirect, resetOffset, getUserInfo, clearUser, toggleHidden } from '../../ducks/reducer';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchInput: "",
            loggedIn: false,
            hidden: true
        }
    }

    componentWillMount() {
        this.props.getUserInfo();
        axios.get('/auth/me').then(res => {
            if (res.data == 'User not found') {
                this.setState({
                    loggedIn: false
                })
            } else {
                this.setState({
                    loggedIn: true
                })
            }
        });
    }

    searchMusic() {
        this.setState({
            searchInput: ""
        })
    }

    searchAll = (e) => {
        e.preventDefault();
        this.props.search(this.state.searchInput);
        this.searchMusic();
        this.props.updateFireRedirect(true);
        this.props.resetOffset();
        setTimeout(() => {
            this.props.updateFireRedirect(false);
        }, 2000);
    }

    render() {
        return (
            <div className='navbarContainer'>
                <div className='logoContainer'>
                    <Link to='/' className='link'>
                        <h3 className='sway'>Sway</h3>
                    </Link>
                </div>
                <div className='browse'>
                    <Link to='/browse' className='link'>
                        <h3>Browse</h3>
                    </Link>
                </div>
                <div className='myMusic'>
                    <Link to='/myMusic' className='link'>
                        <h3>My Music</h3>
                    </Link>
                </div>
                <div>
                    {
                        this.state.loggedIn
                            ?
                            <div className='login'>
                                <div className='username'>
                                    <h4 onClick={() => this.props.toggleHidden()}>{this.props.user.first_name} {this.props.user.last_name}</h4>
                                </div>
                                <a href={process.env.REACT_APP_LOGOUT} onClick={() => this.props.clearUser()}><button className='logout'>Log Out</button></a>
                            </div>
                            :
                            <a href={process.env.REACT_APP_LOGIN}><button className='loginButton'>Login</button></a>
                    }
                    {
                        this.props.hidden
                        ?
                        null
                        :
                        <div>
                            <div className='arrowUp'></div>
                            <div className='profile'>
                                <Profile />
                            </div>
                        </div>
                    }
                </div>
                <div className='search'>
                    <img src='./images/search.svg' alt="" className='searchLogo' />
                    <form onSubmit={this.searchAll}>
                        <input value={this.state.searchInput} type='text' placeholder='Search' className='searchBar' onChange={(e) => this.setState({ searchInput: e.target.value })} />
                        <button type="submit" className='invisible' />
                    </form>
                    {this.props.fireRedirect && (
                        <Redirect to={`/search`} />
                    )}
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
        user: state.user,
        hidden: state.hidden
    }
}

export default connect(mapStateToProps, { search, updateFireRedirect, resetOffset, getUserInfo, clearUser, toggleHidden })(NavBar);