import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../layout.jsx';
import ProjectModel from '../../models/project';

import Loader, {DataLoader} from '../includes/loader.jsx';
import {ProjectsUL} from '../projects-list.jsx';
import ProjectsLoader from '../projects-loader.jsx';
import Categories from '../categories.jsx';

const CategoryPageWrap = ({category, categories, children}) => (
  <React.Fragment>
    <main className="category-page">
      <article className="projects" style={{backgroundColor: category.backgroundColor}}>
        <header className="category">
          <h2 className="category-name">{category.name}</h2>
          <span className="category-image-container">
            <img src={category.avatarUrl} alt=""/>
          </span>
          <p className="description">{category.description}</p>
        </header>
        {children}
      </article>
    </main>
    <Categories categories={categories}/>
  </React.Fragment>
);
CategoryPageWrap.propTypes = {
  category: PropTypes.shape({
    avatarUrl: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  categories: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
};

const CategoryPageLoader = ({...props}) => (
  <CategoryPageWrap {...props}>
    <Loader/>
  </CategoryPageWrap>
);

const CategoryPageError = ({...props}) => (
  <CategoryPageWrap {...props}>
    Something went wrong. Try refreshing?
  </CategoryPageWrap>
);

async function loadCategory(api, id) {
  const {data} = await api.get(`categories/${id}`);
  data.projects = data.projects.map(project => ProjectModel(project).update(project).asProps());
  return data;
}

const CategoryPage = ({api, category, ...props}) => (
  <DataLoader
    get={() => loadCategory(api, category.id)}
    renderLoader={() => <CategoryPageLoader category={category} {...props}/>}
    renderError={() => <CategoryPageError category={category} {...props}/>}
  >
    {category => (
      <CategoryPageWrap category={category} {...props}>
        <ProjectsLoader api={api} projects={category.projects}>
          {projects => <ProjectsUL projects={projects} categoryColor={category.color}/>}
        </ProjectsLoader>
      </CategoryPageWrap>
    )}
  </DataLoader>
);
CategoryPage.propTypes = {
  api: PropTypes.any.isRequired,
  category: PropTypes.object.isRequired,
};

const CategoryPageContainer = ({application, category}) => (
  <Layout application={application}>
    <CategoryPage api={application.api()} category={category} categories={application.categories}/>
  </Layout>
);

export default CategoryPageContainer;