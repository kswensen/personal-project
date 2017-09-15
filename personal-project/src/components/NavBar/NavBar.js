import React, { Component } from 'react';
import './NavBar.css';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { search, updateSearchID, updateFireRedirect } from '../../ducks/reducer';
let id = 0;

class NavBar extends Component {
    constructor(){
        super();

        this.state = {
            searchInput: ""
        }
    }

    searchMusic(){
        this.setState({
            searchInput: ""
        })
    }

    searchAll = (e) => {
        e.preventDefault();
        this.props.updateSearchID(id);
        this.props.search(this.state.searchInput);
        id++;
        this.searchMusic();
        this.props.updateFireRedirect(true);
        setTimeout(() => {
            this.props.updateFireRedirect(false);
        }, 2000);
    }

    render() {
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
                    {this.props.fireRedirect && (
                        <Redirect to={`/search`} />
                    )}
                </div>
            </div>
        )
    }
}
function mapStateToProps(state){
    return{
        searchTerm: state.searchTerm,
        searchID: state.searchID,
        fireRedirect: state.fireRedirect
    }
}

export default connect(mapStateToProps, { search, updateSearchID, updateFireRedirect })(NavBar);