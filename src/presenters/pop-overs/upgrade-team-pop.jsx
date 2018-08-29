import React from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

import {StaticUsersList} from "../users-list.jsx";

const STRIPE_PUBLIC_API_KEY="pk_test_WIJxKl0T1xT8zSb2StHu8zlo";
const GLITCH_STRIPE_LOGO_URL="https://cdn.glitch.com/41bc522e-d971-486e-b08e-7c12034743f9%2Fglitch-square-stripe-logo.png?1528914311237";
const PRICE_PER_USER = 10;

/*
const Billing = ({user, userSubscriptions, userSubscription, changeUserSubscription}) => {
  
  function clickTest() {
    onToken(null);
  }
  function onToken(token) {
    const plan = userSubscription.toLowerCase();
    const id = user.id;
    const persistentToken = window.application.currentUser().persistentToken();
    
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

  return (

      <StripeCheckout 
        stripeKey={STRIPE_API_KEY}
        token={onToken}
        amount={999} // this should be dynamic depending on the plan
        name="Glitch"
        description={userSubscription}
        image={GLITCH_STRIPE_LOGO_URL}
        locale="auto"
        zipCode={true}
        allowRememberMe={true}
        email={user.email} 
      >
        <button>
        Add Payment Information
        </button>
      </StripeCheckout>
      <StripeCheckout 
        stripeKey={STRIPE_API_KEY}
        token={onToken}
        amount={999} // this should be dynamic depending on the plan
        name="Glitch"
        description={userSubscription}
        image={GLITCH_STRIPE_LOGO_URL}
        locale="auto"
        zipCode={true}
        allowRememberMe={true}
        email={user.email} 
      >
        <button>
        Update Payment Information
        </button>
      </StripeCheckout>
    </section>
  );
};

Billing.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
};


*/

export class UpgradeTeamPop extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {
      monthlyCost: 0
    };
  }
  
  componentDidMount() {
    // get billing user
    // update state / loading
    
    let monthlyCost = this.props.users.length * PRICE_PER_USER;
    this.setState({
      monthlyCost: monthlyCost
    });
  }
 
  onToken(token) {
    const plan = "pyrite";
    const id = user.id; // current user id
    const persistentToken = window.application.currentUser().persistentToken();
    
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
          {/* Temporary: remove this once billing is ready */}
          { /* https://github.com/azmenak/react-stripe-checkout */
          <StripeCheckout 
            stripeKey={STRIPE_PUBLIC_API_KEY}
            token={this.onToken}
            amount={parseInt(this.state.monthlyCost + '00')} // this should be dynamic depending on the plan , is int (999 = 9.99)
            name="Glitch"
            description={userSubscription}
            image={GLITCH_STRIPE_LOGO_URL}
            locale="auto"
            zipCode={true}
            allowRememberMe={true}
            email={user.email} 
          >
            <button className="button buttom-small button-cta has-emoji opens-pop-over" onClick={this.clickTest()}>
              <span>Upgrade {this.props.teamName} </span>
              <span className="emoji credit_card"/>
            </button>
          </StripeCheckout>
          
          <p className="action-description">
            Paid teams are coming soon. In the meantime, feel free to add as many projects as you want, they won't go away.
          </p>

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
};


export default UpgradeTeamPop;
