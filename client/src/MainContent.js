import React, {useEffect} from 'react';

import LogInLogOutButton from './LogInLogOutButton';
import SearchAndPreferences from './SearchAndPreferences';
import UserProfile from './UserProfile';

import logo from './images/logo512.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from "@fortawesome/free-solid-svg-icons";

  class Display extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        pageState: 'mainPage'
      }
    }

    gotoUserProfile = () => {
      this.setState({
        pageState: 'userProfile'
      });
    }

    gotoMainPage = () => {
      this.setState({
        pageState: 'mainPage'
      });
    }

    getPageContent() {
      switch (this.state.pageState) {
        case 'mainPage': return <SearchAndPreferences authState={this.props.authState}/>;
        case 'userProfile': return <UserProfile gotoMainPage={this.gotoMainPage} user={this.props.user}/> ;
        default: return <div> SOMETHING IS WRONG! <SearchAndPreferences authState={this.props.authState}/> </div>
      }
    }

    render() {
      return (
          <div>
            <div id="mainPageHeader">
              <img src={logo} id="mainPageLogo"/>
              <LogInLogOutButton authState={this.props.authState} user={this.props.user} gotoUserProfile={this.gotoUserProfile}/>
              <div className="col text-center pb-3 font-weight-bold font-size-large gold-text" id="title">Welcome to FSU Dining!</div>
            </div>
              {this.getPageContent()}
              <div className="text-center copyright-text"><FontAwesomeIcon icon={Icons.faCopyright}/> Kevin Patlis 2020</div>
          </div>
      );
    }
  }

  export default Display;