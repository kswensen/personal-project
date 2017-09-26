import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Browse.css';
import axios from 'axios';

class Browse extends Component{
    constructor(){
        super();

        this.state = {
            categories: []
        }
    }

    componentDidMount(){
        axios.get('/api/getCategories').then(res => {
            this.setState({
                categories: res.data
            })
        });
    }

    render(){
        const mappedCategories = this.state.categories.map((category, i) => {
            return <ul key={i} className='album'>
                <Link to={{ pathname: '/browse/playlists/', query: category.id }} className='link'>
                    <img src={category.icons[0].url}/>
                    <p>{category.name}</p>
                </Link>
            </ul>
        });
        return(
            <div className='color'>
                {
                    this.props.user !== undefined
                    ?
                    <h4>Welcome back, {this.props.user.first_name} {this.props.user.last_name}</h4>
                    :
                    null
                }
                <h2>Browse</h2>
                <h4>Categories</h4>
                {mappedCategories}
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        user: state.user
    }
}

export default connect(mapStateToProps)(Browse);