import React, {useState} from 'react';

import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

import Amplify, { Auth } from "aws-amplify";
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsExports from "./aws-exports";
import MainContent from "./MainContent"

Amplify.configure(awsExports);

async function OnLoad() {
  await Auth.currentSession();
}

const AuthStateApp = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
      console.log(user);

      return onAuthUIStateChange((nextAuthState, authData) => {
          setAuthState(nextAuthState);
          setUser(authData);
      });
    }, []);

    return (
      <div className="App">
          <div>
            <MainContent authState={authState} user={user}> </MainContent>
          </div>
      </div>
  );
}

export default AuthStateApp;
