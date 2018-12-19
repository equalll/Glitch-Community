import React from 'react';
import PropTypes from 'prop-types';
import {UserPref} from '../includes/user-prefs.jsx';
const {Provider, Consumer} = React.createContext();

//  Dev Toggles!
//
//   Use dev toggles to parts of the site that are still in development.
//   This site is open source, there's no utility here, this is just a way to help us
//   ship things _extra_ early without impacting customer UX
//


// Define your dev toggles here.
// We can only have three.
// Users can enable them with the /secret page.
const toggleData = [
  {name: "Email Invites", description: "Enables invite-by-email behavior on the team page."},
  {name: "Everybody Dance!", description: "Placeholder for a new toggle."},
  {name: "Team Collections", description: "Co-op mode for collections"},
].splice(0,3); // <-- Yeah really, only 3.  If you need more, clean up one first.


// Usage:
// Import Devtoggles into your scope:

// import DevToggles from '../includes/dev-toggles.jsx`

// Use the DevToggles from inside of a DevTogglesProvider
// (Which in turn must be inside of a UserPrefProvider,
// both of which are provided by the Client.jsx)

// Fetch the array enabledToggles and test for features with [].includes:
/*
  <DevToggles>
    {(enabledToggles) => (
      <div> I could sure go for some:
        { enabledToggles.includes("fishsticks") && <FishSticks/> }
      </div>
    )}
  </DevToggles>
*/

export const DevTogglesProvider = ({children}) => (
  <UserPref name="devToggles" default={[]}>
    {(enabledToggles, setEnabledToggles) => (
      <Provider value={{enabledToggles, toggleData, setEnabledToggles}}>
        {children}
      </Provider>
    )}
  </UserPref>
);
DevTogglesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DevToggles = ({children}) => (
  <Consumer>
    {({enabledToggles, toggleData, setEnabledToggles}) => children(
      enabledToggles||[], toggleData, setEnabledToggles
    )}
  </Consumer>
);
DevToggles.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DevToggles;