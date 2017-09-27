import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCategoryID, updateCategoryName } from '../../ducks/reducer';
import axios from 'axios';
import './Browse.css';

class Browse extends Component{
    constructor(){
        super();

        this.state = {
            categories: []
        }
    }

    componentDidMount(){
        axios.get('/api/getCategories').then(res => {
            console.log(res.data);
            this.setState({
                categories: res.data
            })
        });
    }

    setCategory(name, id){
        this.props.updateCategoryName(name);
        this.props.updateCategoryID(id);
    }

    render(){
        const mappedCategories = this.state.categories.map((category, i) => {
            return <ul key={i} className='album'>
                <Link to='/browse/playlists/' className='link' onClick={() => this.setCategory(category.name, category.id)}>
                    <img src={category.icons[0].url}/>
                    <p>{category.name}</p>
                </Link>
            </ul>
        });
        return(
            <div className='browseBackground'>
                {
                    this.props.user !== undefined
                    ?
                    <h4>Welcome back, {this.props.user.first_name} {this.props.user.last_name}</h4>
                    :
                    null
                }
                <h2>Browse</h2>
                <h4>Categories</h4>
                <div className='categories'>
                    {mappedCategories}
                </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        user: state.user,
        category_id: state.category_id,
        category_name: state.category_name
    }
}

export default connect(mapStateToProps, { updateCategoryID, updateCategoryName })(Browse);