import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';

import Loader from './loader.jsx';
import TeamAnalyticsTimePop from '../pop-overs/team-analytics-time-pop.jsx'
import TeamAnalyticsProjectPop from '../pop-overs/team-analytics-project-pop.jsx'

// todo: remove c3 from package.json
// import ("c3").then(c3 => {
//   console.log('c3 loaded', c3);
// })

// 🗑: analytics.js, analytics.jade, analytics.styl, analytics-time-pop.jsx, analytics-project-pop.jsx, clean up team.js/jade

// unused yet
// const timeFrames = [
//   {
//     name: "Last 4 Weeks",
//     time: moment().subtract(4, 'weeks').valueOf(),
//   },
//   {
//     name: "Last 2 Weeks",
//     time: moment().subtract(2, 'weeks').valueOf(),
//   },
//   {
//     name: "Last 24 Hours",
//     time: moment().subtract(24, 'hours').valueOf(),
//   },
// ];

const getAnalytics = async ({id, api}) => {
  let path = `analytics/${id}/team`
  try {
    return await api().get(path)     
  } catch (error) {
    console.error('getAnalytics', error)
  }
}

// layout:
  // Controls
  // Activity (TeamAnalyticsActivity)
  // Referrers

class TeamAnalytics extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      currentTimeFrame: 'Last 2 Weeks',
      currentProjectDomain: 'All Projects',
      analytics: [],
      isLoading: true,
    }
  }

  updateTimeFrame(newTime) {
    this.setState({
      currentTimeFrame: newTime
    })
  }

  updateProjectdomain(newDomain) {
    this.setState({
      currentProjectDomain: newDomain
    })
  }

  updateAnalytics() {
    this.setState({
      isLoading: true,
    })
    getAnalytics(this.props)
    .then(({data}) => {
      this.setState({
        isLoading: false,
        analytics: data,
      });
      console.log('🚒', this.state, this.state.analytics)
    })
  }
  
  componentDidMount() {
    this.updateAnalytics()
  }

  render() {
    return (
      <section>
        <h2>Analytics</h2>
        <p>{this.state.currentTimeFrame}</p>
        <p>{this.state.currentProjectDomain}</p>
        <section className="controls">
          <TeamAnalyticsTimePop 
            updateTimeFrame = {this.updateTimeFrame.bind(this)}
            currentTimeFrame = {this.state.currentTimeFrame}
          />
          <TeamAnalyticsProjectPop
            updateProjectdomain = {this.updateProjectdomain.bind(this)}
            currentProjectDomain = {this.state.currentProjectDomain}
            projects = {this.props.projects}
          />
        </section>
      </section>
    );
  }
}

TeamAnalytics.propTypes = {
  id: PropTypes.number.isRequired,
  api: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
};

export default TeamAnalytics;
