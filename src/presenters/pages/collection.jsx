import React from 'react';
import PropTypes from 'prop-types';

import {Redirect} from 'react-router-dom';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';
import {getContrastTextColor, getLink, getOwnerLink, hexToRgbA} from '../../models/collection';

import {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import NotFound from '../includes/not-found.jsx';

import {AuthDescription} from '../includes/description-field.jsx';
import CollectionEditor from '../collection-editor.jsx';

import EditCollectionColor from '../includes/edit-collection-color.jsx';
import EditCollectionNameAndUrl from '../includes/edit-collection-name-and-url.jsx';
import AddCollectionProject from '../includes/add-collection-project.jsx';

import CollectionAvatar from '../includes/collection-avatar.jsx';
import {TeamTile} from '../teams-list';
import {UserTile} from '../users-list';

import {CurrentUserConsumer} from '../current-user.jsx';

function syncPageToUrl(collection, url) {
  history.replaceState(null, null, getLink({...collection, url}));
}

class DeleteCollectionBtn extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      done: false,
    };
  } 
  render(){
    if(this.state.done){
      return <Redirect to={getOwnerLink(this.props.collection)} />;
    }
    return (
      <button className={`button delete-collection button-tertiary`} 
        onClick={() => 
        { 
          console.log('clicked delete collection');
          if(!window.confirm(`Are you sure you want to delete your collection?`)){
            return;
          }
          console.log('delete collection');
          this.props.deleteCollection();
          this.setState({done: true});
        }} >
        Delete Collection
      </button>
    );
    
  }
}

DeleteCollectionBtn.propTypes = {
  collection: PropTypes.shape({
    team: PropTypes.object,
    user: PropTypes.object,
    url: PropTypes.string.isRequired,
  }).isRequired,
  deleteCollection: PropTypes.func.isRequired,
};

const CollectionPageContents = ({
  api, 
  collection, 
  currentUser,
  deleteCollection,
  isAuthorized,
  updateNameAndUrl,
  updateDescription, 
  addProjectToCollection, 
  removeProjectFromCollection,
  updateColor,
  ...props}) => (
  
  <>  
    <Helmet>
      <title>{collection.name}</title>
    </Helmet>
    <main className="collection-page">
      <article className="projects" style={{backgroundColor: collection.coverColor}}>
        <header className={"collection " + (getContrastTextColor(collection.coverColor) == "white" ? "dark" : "")}>
          <div className="collection-image-container">
            <CollectionAvatar backgroundColor={hexToRgbA(collection.coverColor)}/>
          </div>
          
          <EditCollectionNameAndUrl isAuthorized={isAuthorized}
            name={collection.name} url={collection.url}
            update={data => updateNameAndUrl(data).then(() => syncPageToUrl(collection, data.url))}
          />
          
          {collection.team && <TeamTile team={collection.team}/>}
          {collection.user && <UserTile {...collection.user}/>}
          
          <div className="collection-description">
            <AuthDescription
              authorized={isAuthorized} description={collection.description}
              update={updateDescription} placeholder="Tell us about your collection"
            />
          </div>
          
          {isAuthorized && <EditCollectionColor
            update={updateColor}
            initialColor={collection.coverColor}
          />}
          
        </header>
        
        {!!collection &&
           <ProjectsLoader api={api} projects={collection.projects}>
             {projects => 
               <>
                 <div className="collection-contents">
                   <div className="collection-project-container-header">
                     <h3>Projects ({collection.projects.length})</h3>
                
                     {!!isAuthorized && (
                       <AddCollectionProject
                         addProjectToCollection={addProjectToCollection}
                         collection={collection}
                         api={api}
                         currentUserIsOwner={isAuthorized}
                         currentUser={currentUser}
                       />
                     )}
                
                   </div>
          
                   {(collection.projects.length > 0 ?
                     (isAuthorized
                       ? <ProjectsUL {...{projects, currentUser, api}}
                         projectOptions={{
                           removeProjectFromCollection,
                           addProjectToCollection,
                         }} 
                         {...props}/>

                       : 
                       (currentUser && currentUser.login 
                         ? <ProjectsUL {...{projects, currentUser, api}} 
                           projectOptions={{
                             addProjectToCollection
                           }} 
                           {...props}/>
                         :
                         <ProjectsUL {...{projects, currentUser, api}} 
                           projectOptions={{}} 
                           {...props}/>
                       )
                     )
                     :
                     (isAuthorized
                       ?
                       <div className="empty-collection-hint">
                         <img src="https://cdn.glitch.com/1afc1ac4-170b-48af-b596-78fe15838ad3%2Fpsst-pink.svg?1541086338934" alt=""/>
                         <p>You can add any project, created by any user</p>
                       </div>
                       :  <div className="empty-collection-hint">
                         No projects to see in this collection just yet.
                       </div>
                     )
                   )}
                 </div>
          
               </>
             }
           </ProjectsLoader>
        }
        
      </article>
      
    </main>
   {isAuthorized && <DeleteCollectionBtn collection={collection} deleteCollection={deleteCollection}/>}
  </>
);

CollectionPageContents.propTypes = {
  addProjectToCollection: PropTypes.func,
  api: PropTypes.any.isRequired,
  collection: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
  }).isRequired,
  children: PropTypes.node,
  currentUser: PropTypes.object,
  deleteCollection: PropTypes.func.isRequired,
  isAuthorized: PropTypes.any.isRequired,  
  removeProjectFromCollection: PropTypes.func,
  uploadAvatar: PropTypes.func,
};

const getOrNull = async(api, route) => {
  try {
    const {data} = await api.get(route);
    return data;
  } catch (error) {
    if (error && error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

async function getUserIdByLogin(api, userLogin){
  const {data} = await api.get(`userid/byLogin/${userLogin}`);
  if(data === "NOT FOUND"){
    return null;
  }
  return data;
}

async function loadCollection(api, ownerName, collectionName){
  let collections = [];
  
  // get team by url
  const team = await getOrNull(api, `teams/byUrl/${ownerName}`);
  if (team) {
    const {data} = await api.get(`collections?teamId=${team.id}`);
    collections = data;
  } else {
    
    // get userId by login name
    const userId = await getUserIdByLogin(api, ownerName);
    if (userId) {
      const {data} = await api.get(`collections?userId=${userId}`);
      collections = data;
    }
  }
  
  // pick out the correct collection, then load the full data
  const collectionMatch = collections.find(c => c.url == collectionName);
  const collection = collectionMatch && await getOrNull(api, `collections/${collectionMatch.id}`);
  if (!collection) return null;
  
  // inject the full team so we get their projects and members
  if (team) {
    collection.team = team;
  }
  
  return collection;
}  

const CollectionPage = ({api, ownerName, name, ...props}) => (
  <Layout api={api}>
    <DataLoader get={() => loadCollection(api, ownerName, name)}>
      {collection => collection ? (
        <CurrentUserConsumer>
          {(currentUser) => (
            <CollectionEditor api={api} initialCollection={collection} >
              {(collection, funcs, userIsAuthor) =>(
                <CollectionPageContents collection={collection} api={api} currentUser={currentUser} isAuthorized={userIsAuthor} {...funcs} {...props}/>
              )}
            </CollectionEditor>
          )}
        </CurrentUserConsumer>
      ) : <NotFound name={name}/>}
    </DataLoader>
  </Layout>
);

export default CollectionPage;