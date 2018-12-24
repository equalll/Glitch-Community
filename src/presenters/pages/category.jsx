import React from 'react';
import PropTypes from 'prop-types';

import Helmet from 'react-helmet';
import Layout from '../layout.jsx';

import {AnalyticsContext} from '../analytics';
import {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import Categories from '../categories.jsx';

import CollectionEditor from '../collection-editor.jsx';
import {CurrentUserConsumer} from '../current-user.jsx';


const CategoryPageWrap = ({
  addProjectToCollection, 
  api, 
  category, 
  currentUser,
  ...props
}) => (
  <>
    <Helmet>
      <title>{category.name}</title>
    </Helmet>
    <main className="collection-page">
      <article className="projects" style={{backgroundColor: category.backgroundColor}}>
        <header className="collection">
          <h1 className="collection-name">
            {category.name}
          </h1>
          <div className="collection-image-container">
            <img src={category.avatarUrl} alt=""/>
          </div>
          
          <p className="description">
            {category.description}
          </p>

          
        </header>
        
        <ProjectsLoader api={api} projects={category.projects}>
          {projects =>
            <div className="collection-contents">
              <div className="collection-project-container-header">
                <h3>Projects ({category.projects.length})</h3>
              </div>

              {(currentUser.login ? 
                <ProjectsUL {...{projects, currentUser, api, addProjectToCollection}} category={true}
                  projectOptions={{
                    addProjectToCollection
                  }} 
                  {...props}/>
                :
                <ProjectsUL {...{projects, currentUser, api, addProjectToCollection}} category={true}
                  projectOptions={{}} {...props}/>
              )}
            </div>
          }
        </ProjectsLoader>
        
      </article>
      
    </main>
    <Categories/>
  </>
);

CategoryPageWrap.propTypes = {
  category: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
  }).isRequired,
  api: PropTypes.any.isRequired,
  addProjectToCollection: PropTypes.func.isRequired,
};

async function loadCategory(api, id) {
  const {data} = await api.get(`categories/${id}`);
  return data;
}  

const CategoryPage = ({api, category, ...props}) => (
  <Layout api={api}>
    <AnalyticsContext properties={{origin: 'category'}}>
      <DataLoader get={() => loadCategory(api, category.id)}>
        {category => (
          <CollectionEditor api={api} initialCollection={category} >
            {(category, funcs) => (
              <CurrentUserConsumer>
                {(currentUser) => (
                  <CategoryPageWrap category={category} api={api} userIsAuthor={false} currentUser={currentUser} {...funcs} {...props}/>
                )}
              </CurrentUserConsumer>
            )}
          </CollectionEditor>
        )}
      </DataLoader>
    </AnalyticsContext>
  </Layout>
);

CategoryPage.propTypes = {
  api: PropTypes.any.isRequired,
  category: PropTypes.object.isRequired,
};

export default CategoryPage;