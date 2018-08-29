import React from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

import {StaticUsersList} from "../users-list.jsx";
import {CurrentUserConsumer} from "../current-user.jsx";
import DevToggles from '../includes/dev-toggles.jsx';

const STRIPE_PUBLIC_API_KEY="pk_test_WIJxKl0T1xT8zSb2StHu8zlo";
const GLITCH_STRIPE_LOGO_URL="https://cdn.glitch.com/41bc522e-d971-486e-b08e-7c12034743f9%2Fglitch-square-stripe-logo.png?1528914311237";
const PRICE_PER_USER = 10;

export class UpgradeTeamPop extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      monthlyCost: 0
    };
    
    this.onToken = this.onToken.bind(this);
  }
  
  
  componentDidMount() {    
    // get # of active users
    // update state / loading
    
    let monthlyCost = this.props.users.length * PRICE_PER_USER;
    this.setState({
      monthlyCost: monthlyCost
    });
  }
 
  onToken(token) {
    const plan = "pyrite";
    const persistentToken =this.props.currentUser.persistentToken;
    
    return axios({
      method: 'post',
      url: 'https://stripe-plans.glitch.me/billing/customer',
      params: {
        authorization: persistentToken,
      },
      data: {
        token,
        plan,
      }
    }).then((response)=>{
      console.log(response);
    });
  }
  
    
  render() {
    let users = () => {
      return this.props.users.map(user => {
        user.userLink = null;
        return user;
      });
    };
    
    const Checkout = ({usePlaceholder}) => {
      if(usePlaceholder) {
        return (
          <React.Fragment>
            <button className="button buttom-small button-cta has-emoji opens-pop-over" disabled>
              <span>Upgrade {this.props.teamName} </span>
              <span className="emoji credit_card"/>
            </button>
            <p className="action-description">
              Paid teams are coming soon. In the meantime, feel free to add as many projects as you want, they won't go away.
            </p>
          </React.Fragment>
        );
      }
      
      return (
        <StripeCheckout 
          stripeKey={STRIPE_PUBLIC_API_KEY}
          token={this.onToken}
          amount={parseInt(this.state.monthlyCost + '00')} // (1000 = 10.00)
          name="Glitch"
          description={"Glitch for teams, yo!"}
          image={GLITCH_STRIPE_LOGO_URL}
          locale="auto"
          zipCode={true}
          allowRememberMe={true}
          email={this.props.currentUser.email} 
        >
          <button className="button buttom-small button-cta has-emoji opens-pop-over">
            <span>Upgrade {this.props.teamName} </span>
            <span className="emoji credit_card"/>
          </button>
        </StripeCheckout>
      );
    };
    
    return (
      <dialog className="pop-over upgrade-team-pop">
        <section className="pop-over-info">
          <div className="pop-title">
            Upgrade {this.props.teamName}
          </div>
        </section>
        <section className="pop-over-actions">
          <div className="action-description">
            Glitch Teams cost ${PRICE_PER_USER} per active user a month
          </div>
          <StaticUsersList users={users()}/>
        </section>
        <section className="pop-over-actions">
          <DevToggles>
            {(enabledToggles) => (
              <Checkout usePlaceholder={!enabledToggles.includes("team-billing") }/>
            )}
          </DevToggles>
        </section>
        <section className="pop-over-info">
          <div className="info-description">
            We only bill you for team members who are actively using Glitch.
          </div>
        </section>

      </dialog>
    );
  }
}

UpgradeTeamPop.propTypes = {
  teamName: PropTypes.string.isRequired,
  teamId: PropTypes.number.isRequired,
  currentUserId: PropTypes.number.isRequired,
  togglePopover: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  currentUser: PropTypes.object.isRequired,
};

const UpgradeTeamPopWithUser = (props) => (
  <CurrentUserConsumer>
    {(currentUser) => <UpgradeTeamPop {...props} currentUser={currentUser}/>}
  </CurrentUserConsumer>
);


export default UpgradeTeamPopWithUser;
