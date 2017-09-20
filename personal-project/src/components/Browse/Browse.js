import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Browse.css';
import { getUserInfo } from '../../ducks/reducer';
import axios from 'axios';

class Browse extends Component{

    componentDidMount(){
    }

    render(){
        return(
            <div className='color'>
                <h1>loggedIn: {this.props.loggedIn}</h1>
                <h4>Browse</h4>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        loggedIn: state.loggedIn,
        user: state.user
    }
}

export default connect( mapStateToProps, { getUserInfo })(Browse);