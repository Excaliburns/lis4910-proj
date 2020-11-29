import React from 'react';
import { AuthState } from '@aws-amplify/ui-components';

import LogOutDropdown from './LogOutDropdown';
import LogInModal from './LogInModal';

class LogInLogOutButton extends React.Component {

    gotoUserProfile = () => {
        this.props.gotoUserProfile();
    }

    render() {
        return this.props.authState === AuthState.SignedIn ? (
            <div className="d-flex pr-5 pt-4 logoutDropdownButton">
                <LogOutDropdown gotoUserProfile={this.gotoUserProfile} />
            </div>
        ) : (
            <div className="pr-5 pt-4">
                 <LogInModal />
            </div>
        )
    }
}

export default LogInLogOutButton;