import React from 'react';
import DatePicker from 'react-datepicker';
import { Typeahead } from 'react-bootstrap-typeahead';
import Spinner from 'react-bootstrap/Spinner'

import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

import Amplify from "aws-amplify";
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import awsExports from "./aws-exports";
import { AmplifySignOut } from '@aws-amplify/ui-react'
import MainContent from "./MainContent"

Amplify.configure(awsExports);

const AuthStateApp = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
      console.log(authState);

      return onAuthUIStateChange((nextAuthState, authData) => {
          setAuthState(nextAuthState);
          setUser(authData)
      });
    }, []);

    return (
      <div className="App">
          <div>
            ;[]\<MainContent authState={authState}> </MainContent>
          </div>
      </div>
  );
}

export default AuthStateApp;
