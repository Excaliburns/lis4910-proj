import React from 'react';

import Dropdown from 'react-bootstrap/Dropdown';

import { Auth } from 'aws-amplify';

async function handleSignOut() {
    await Auth.currentAuthenticatedUser().then(user => user.signOut());
}

function signOutAndRefresh() {
    handleSignOut().then( () => {
        window.location.reload(false);
    });
}

class LogOutDropdown extends React.Component {

    gotoUserProfile = () => {
        this.props.gotoUserProfile();
    }

    render() {
        return (
            <Dropdown>
                <Dropdown.Toggle id="dropdown-custom">
                    User Menu
            </Dropdown.Toggle>

                <Dropdown.Menu className="userMenuDropdown">
                    <Dropdown.Item onClick={this.gotoUserProfile}>User Profile</Dropdown.Item>
                    <Dropdown.Item className="border-top" onClick={signOutAndRefresh}>Log Out</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}

export default LogOutDropdown;