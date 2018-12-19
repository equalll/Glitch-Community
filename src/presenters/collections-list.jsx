import React from 'react';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';
import CollectionItem from "./collection-item.jsx";
import {defaultAvatar, getLink} from '../models/collection';
import {getCollections, getPredicate} from '../models/words';
import Loader from './includes/loader.jsx';

import randomColor from 'randomcolor';

import {kebabCase, orderBy} from 'lodash';


class CollectionsList extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      deletedCollectionIds: [],
    };
    this.deleteCollection = this.deleteCollection.bind(this);
  }
     
  async deleteCollection(id) {
    this.setState( 
      ({deletedCollectionIds}) => ({
        deletedCollectionIds: [...deletedCollectionIds, id]
      })
    );
    await this.props.api.delete(`/collections/${id}`);
  }
  
  render() {
    const {title, api, isAuthorized, maybeCurrentUser, maybeTeam} = this.props;
    const deleteCollection = this.deleteCollection;
    const collections = this.props.collections.filter(({id}) => !this.state.deletedCollectionIds.includes(id));
    const hasCollections = !!collections.length;
    const canMakeCollections = isAuthorized && !!maybeCurrentUser;
    
    if(!hasCollections && !canMakeCollections) {
      return null;
    }
    return (
      <article className="collections">
        <h2>{title}</h2>
        {canMakeCollections &&
          <>
            <CreateCollectionButton {...{api, currentUser: maybeCurrentUser, maybeTeam}}/>
            {!hasCollections && <CreateFirstCollection {...{api, currentUser: maybeCurrentUser}}/>}
          </>
        }
        <CollectionsUL {...{collections, api, isAuthorized, deleteCollection}}/>
      </article>
    );
  }
}

CollectionsList.propTypes = {
  collections: PropTypes.array.isRequired,
  maybeCurrentUser: PropTypes.object,
  maybeTeam: PropTypes.object,
  title: PropTypes.node.isRequired,
  api: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
};

const CreateFirstCollection = () => (
  <div className="create-first-collection">
    <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt=""/>
    <p className="placeholder">Create collections to organize your favorite projects.</p><br/>
  </div>
);

export class CreateCollectionButton extends React.Component{
  constructor(props){
    super(props);
    this.state={
      shouldRedirect: false,
      error: false,
      loading: false,
      newCollectionUrl: "",
    };
    this.createCollection = this.createCollection.bind(this);
  }
  
  async postCollection(collectionSynonym, predicate){
    const name = [predicate, collectionSynonym].join('-');
    const description = `A ${collectionSynonym} of projects that does ${predicate} things`;
    const url = kebabCase(name);
    
    // defaults
    const avatarUrl = defaultAvatar;
    
    // get a random color
    const coverColor = randomColor({luminosity: 'light'});
    
    // set the team id if there is one
    const teamId = this.props.maybeTeam ? this.props.maybeTeam.id : undefined;

    const {data} = await this.props.api.post('collections', {
      name,
      description,
      url,
      avatarUrl,
      coverColor,
      teamId,
    });
    
    if(data && data.url){
      if (this.props.maybeTeam) {
        data.team = this.props.maybeTeam;
      } else {
        data.user = this.props.currentUser;
      }
      const newCollectionUrl = getLink(data);
      this.setState({newCollectionUrl, shouldRedirect: true});
      return true;
    }
    return false;
  }
  
  async generateNames() {
    let collectionSynonyms = ["mix","bricolage","playlist","assortment","potpourri","melange","album","collection","variety","compilation"];
    let predicate = "radical";

    try {
      // get collection names
      collectionSynonyms = await getCollections();
      predicate = await getPredicate();
    } catch(error) {
      // If there's a failure, we'll stick with our defaults.
    }
    
    return [collectionSynonyms, predicate];
  }
  
  async createCollection(){
    this.setState({loading: true});
    
    const [collectionSynonymns, predicate] = await this.generateNames();
    let creationSuccess = false;
    for(let synonym of collectionSynonymns){
      try{
        creationSuccess = await this.postCollection(synonym, predicate);
        if(creationSuccess) {
          break;
        }
      } catch(error){
        // Try again.
      }
    }
    if(!creationSuccess) {
      this.setState({error: "Unable to create collection :-("});
    }
  }
  
  render(){
    if(this.state.shouldRedirect){
      return <Redirect to={this.state.newCollectionUrl} push={true}/>;
    }
    if(this.state.loading){
      return (
        <div id="create-collection-container">
          <Loader />
        </div>
      );
    }
    return (
      <div id="create-collection-container">
        <button className="button" id="create-collection" onClick={() => this.createCollection()}>
            Create Collection
        </button>    
      </div>
    );
  }
}

CreateCollectionButton.propTypes = {
  api: PropTypes.any.isRequired,
  currentUser: PropTypes.object.isRequired,
  maybeTeam: PropTypes.object,
};  

export const CollectionsUL = ({collections, deleteCollection, api, isAuthorized}) => {
  // order by updatedAt date
  const orderedCollections = orderBy(collections, collection => collection.updatedAt).reverse();
  return (
    <ul className="collections-container">
      {/* FAVORITES COLLECTION CARD - note this currently references empty favorites category in categories.js
        <CollectionItem key={null} collection={null} api={api} isAuthorized={isAuthorized}></CollectionItem>
      */}
      
      { orderedCollections.map(collection => (
        <CollectionItem key={collection.id} {...{collection, api, isAuthorized, deleteCollection}}></CollectionItem>
      ))}
    </ul>
  );
};

CollectionsUL.propTypes = {
  api: PropTypes.func.isRequired,
  collections: PropTypes.array.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  deleteCollection: PropTypes.func,
};


export default CollectionsList;