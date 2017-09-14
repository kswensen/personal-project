import React, { Component } from 'react';
import './NavBar.css';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { search } from '../../ducks/reducer';

class NavBar extends Component {
    constructor(){
        super();

        this.state = {
            fireRedirect: false,
            searchInput: ""
        }
    }

    searchMusic(){
        this.setState({
            fireRedirect: true,
            searchInput: ""
        })
    }

    changeFireRedirect(){
        this.setState({
            fireRedirect: false
        })
    }

    searchAll = (e) => {
        e.preventDefault();
        this.props.search(this.state.searchInput);
        this.searchMusic();
        setTimeout(() => {
            this.changeFireRedirect();
        }, 2000);
    }

    render() {
        const {fireRedirect} = this.state;
        return (
            <div className='navbarContainer'>
                <div className='logoContainer'>
                    <Link to='/' className='link'>
                        <div className='logo'></div>
                    </Link>
                </div>
                <div className='browse'>
                    <Link to='/browse' className='link'>
                        <h3>Browse</h3>
                    </Link>
                </div>
                <div className='myMusic'>
                    <Link to='myMusic' className='link'>
                        <h3>My Music</h3>
                    </Link>
                </div>
                <div className='search'>
                    <img src='../../images/search.svg' alt="" className='searchLogo' />
                    <form onSubmit={this.searchAll}>
                        <input value={this.state.searchInput} type='text' placeholder='Search' className='searchBar' onChange={(e) => this.setState({searchInput: e.target.value})} />
                        <button type="submit" className='invisible'/>
                    </form>
                    {fireRedirect && (
                        <Redirect to={'/search'} />
                    )}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        searchTerm: state.searchTerm
    }
}

export default connect(mapStateToProps, { search })(NavBar);