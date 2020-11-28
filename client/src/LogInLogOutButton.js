import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';

import Modal from 'react-bootstrap/Modal';
import SigninFlow from './SigninFlow';

async function handleSignOut() {
    await Auth.currentAuthenticatedUser().then(user => user.signOut());
}

function signOutAndRefresh() {
    handleSignOut().then( () => {
        window.location.reload(false);
    });
}


const LogInLogOutButton = ({authState}) => {
    console.log(authState)
    return authState === AuthState.SignedIn ? (
        <div className="header text-right pr-5 pt-4 font-weight-bold" onClick={signOutAndRefresh}> Log Out</div>     
    ) : (
        LogInModal()
    )
}


function LogInModal() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <div className="header text-right pr-5 pt-4 font-weight-bold" onClick={handleShow}>Log In</div>

            <Modal show={show}>
                <Modal.Header closeButton>
                    <Modal.Title>Log In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SigninFlow />
                </Modal.Body>
            </Modal>
        </div>
    );

}

export default LogInLogOutButton;