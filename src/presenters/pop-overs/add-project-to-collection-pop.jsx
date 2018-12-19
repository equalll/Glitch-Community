import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import randomColor from 'randomcolor';
import {captureException} from '../../utils/sentry';

import {getLink, defaultAvatar} from '../../models/collection';
import {getAvatarUrl} from '../../models/project';
import {getCollectionPair} from '../../models/words';

import Loader from '../includes/loader.jsx';

import CollectionResultItem from '../includes/collection-result-item.jsx';

import {NestedPopoverTitle} from './popover-nested.jsx';
import {PureEditableField} from '../includes/editable-field.jsx';

import _ from 'lodash';

class AddProjectToCollectionPop extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      working: false,
      error: null, //null or string
      query: '', //The actual search text
      collectionPair: 'wondrous-collection',
      maybeCollections: null, //null means still loading
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  async loadCollections() {
    const collections = await this.props.api.get(`collections/?userId=${this.props.currentUser.id}`);
    this.setState({maybeCollections: _.orderBy(collections.data, collection => collection.updatedAt).reverse()});
  }
  
  async componentDidMount() {
    this.loadCollections();
    try {
      const collectionPair = await getCollectionPair();
      this.setState(prev => ({query: prev.query || collectionPair, collectionPair}));
    } catch (error) {
      // it's ok rocky. you go when you feel like it
    }
  }
  
  handleChange(newValue) {
    this.setState({ query: newValue, error: null });
  }

  async handleSubmit(event){
    event.preventDefault();
    this.setState({working: true});
    // get text from input field
    const newCollectionName = this.state.query;
    
    // create a new collection
    try{
      const name = newCollectionName;
      const url = _.kebabCase(newCollectionName);
      const collectionPair = this.state.collectionPair.split('-');
      const description = `A ${collectionPair[1]} of projects that does ${collectionPair[0]} things`;
      const avatarUrl = defaultAvatar;
      const coverColor = randomColor({luminosity: 'light'});
      
      const {data} = await this.props.api.post('collections', {
        name,
        description,
        url,
        avatarUrl,
        coverColor,
      });

      const newCollection = {user: this.props.currentUser, ...data};

      // add the selected project to the collection
      await this.props.api.patch(`collections/${newCollection.id}/add/${this.props.project.id}`);         
      
      // redirect to that collection
      const newCollectionUrl = getLink(newCollection);
      this.setState({newCollectionUrl});
    }catch(error){
      if (error && error.response && error.response.data && error.response.data.message) {
        this.setState({error: error.response.data.message});
      } else {
        captureException(error);
      }
    }
  }
    
  render() {
    const placeholder = 'New Collection Name';
    const {error, maybeCollections, query} = this.state;
    let queryError = this.state.error;
    if (!!maybeCollections && !!query && maybeCollections.some(c => c.url === _.kebabCase(query))) {
      queryError = 'You already have a collection with this url';
    }
    if(this.state.newCollectionUrl){
      return <Redirect to={this.state.newCollectionUrl}/>;
    }
    return (
      <dialog className="pop-over add-project-to-collection-pop wide-pop">
        {( !this.props.fromProject ?
          <NestedPopoverTitle>
            <img src={getAvatarUrl(this.props.project.id)} alt={`Project avatar for ${this.props.project.domain}`}/> Add {this.props.project.domain} to collection
          </NestedPopoverTitle>
          : null
        )}
        
        {maybeCollections ? (
          maybeCollections.length ? (
            <section className="pop-over-actions results-list">
              <ul className="results">
                {maybeCollections.map(collection =>   
                  // filter out collections that already contain the selected project
                  (collection.projects.every(project => project.id !== this.props.project.id) && 
                    <li key={collection.id}>
                      <CollectionResultItem 
                        addProjectToCollection={this.props.addProjectToCollection}
                        currentUserLogin={this.props.currentUser.login}
                        project={this.props.project}
                        collection={collection}                         
                        togglePopover={this.props.togglePopover} 
                      />
                    </li>
                  )
                )
                }
              </ul>
            </section>
          ) : (<section className="pop-over-info">
            <p className="info-description">
              Organize your favorite projects in one place
            </p>
          </section>)
        ) : <Loader/>}
        
        <section className="pop-over-info">
          <div className="pop-title collection-title">Add to a new collection</div>
          <form onSubmit={this.handleSubmit}>
            <PureEditableField
              id="collection-name"
              className="pop-over-input create-input"
              value={query} 
              update={this.handleChange}
              placeholder={placeholder}
              error={error || queryError}
            />
            {!this.state.working ? (
              <button type="submit" className="create-collection button-small" disabled={!!queryError}>
                Create
              </button>
            ) : <Loader/>}       
          </form>         
        </section>
      </dialog>
    );
  }
}

AddProjectToCollectionPop.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  togglePopover: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  fromProject: PropTypes.bool,
};

export default AddProjectToCollectionPop;
