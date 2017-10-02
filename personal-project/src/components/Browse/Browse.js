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
            return <ul key={i} className='browseAlbum'>
                <Link to='/browse/playlists/' className='link' onClick={() => this.setCategory(category.name, category.id)}>
                    <img src={category.icons[0].url}/>
                    <h3>{category.name}</h3>
                </Link>
            </ul>
        });
        return(
            <div className='browseBackground'>
                <h3 className='title'>Categories</h3>
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