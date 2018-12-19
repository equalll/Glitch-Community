import React from 'react';
import dayjs from 'dayjs';

export default class Logo extends React.PureComponent {
  
  constructor(props) {
    super(props);
    this.state = {
      hour: (new Date()).getHours(),
    };
  }
  
  componentDidMount() {
    this.interval = window.setInterval(() => {
      this.setState({
        hour: (new Date()).getHours(),
      });
    }, dayjs.convert(5, 'minutes', 'ms'));
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    const {hour} = this.state;
    
    const LOGO_DAY = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-day.svg";
    const LOGO_SUNSET = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-sunset.svg";
    const LOGO_NIGHT = "https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Flogo-night.svg";

    let logo = LOGO_DAY;
    if ((hour >= 16) && (hour <= 18)) {
      logo = LOGO_SUNSET;
    } else if ((hour > 18) || (hour <= 8)) {
      logo = LOGO_NIGHT;
    }

    return <img className="logo" src={logo} alt="Glitch" />;
  }
}