import React from 'react';
import PropTypes from 'prop-types';

const logo = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fcarp.svg";

const drawStar = (canvas, context, color) => {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  context.fillStyle = color;
  context.fillRect(x, y, 2, 2);
};

class Stars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
    this.canvas = React.createRef();
    this.handleResize = this.handleResize.bind(this);
    this.interval = null;
  }
  
  componentDidUpdate() {
    const {width, height} = this.state;
    const initialStars = Math.round((width * height) / 15000);
    const additionalStars = Math.round((width * height) / 3500);
    const context = this.canvas.current.getContext('2d');
    
    for (let i = 0; i < initialStars; ++i) {
      drawStar(this.canvas.current, context, 'white');
    }
    
    let remainingStars = additionalStars - initialStars;
    window.clearInterval(this.interval);
    this.interval = window.setInterval(() => {
      drawStar(this.canvas.current, context, '#CB82C0');
      if (--remainingStars <= 0) {
        window.clearInterval(this.interval);
      }
    }, 100);
  }
  
  handleResize() {
    const width = Math.max(window.innerWidth, screen.width);
    const height = Math.max(window.innerHeight, screen.height);
    if (width > this.state.width || height > this.state.height) {
      this.setState({width, height});
    }
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.clearInterval(this.interval);
    this.interval = null;
  }
  
  render() {
    return <canvas id="stars" {...this.state} ref={this.canvas}/>;
  }
}

const ErrorPage = ({title, description}) => (
  <div className="content error-page">
    <div className="container">
      <h1>{title}</h1>
      <h2>{description}</h2>
      <div className="actions">
        <a href="/">
          <img src={logo} width="80px" height="66px" alt="Glitch"/>
        </a>
      </div>
      <Stars/>
    </div>
  </div>
);
ErrorPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ErrorPage;