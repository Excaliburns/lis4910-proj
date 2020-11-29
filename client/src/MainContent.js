import React from 'react';

import LogInLogOutButton from './LogInLogOutButton';
import SearchAndPreferences from './SearchAndPreferences';
import UserProfile from './UserProfile';

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
        case 'mainPage': return <SearchAndPreferences />;
        case 'userProfile': return <UserProfile gotoMainPage={this.gotoMainPage}/> ;
        default: return <div> SOMETHING IS WRONG! <SearchAndPreferences /> </div>
      }
    }

    render() {
      return (
          <div>
              <LogInLogOutButton authState={this.props.authState} user={this.props.user} gotoUserProfile={this.gotoUserProfile}/>
              <div className="col text-center pt-3 font-weight-bold font-size-large" id="title">Welcome to FSU Dining!</div>
              {this.getPageContent()}
          </div>
      );
    }
  }

  export default Display;