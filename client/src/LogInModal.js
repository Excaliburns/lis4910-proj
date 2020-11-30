import React from 'react';

import Modal from 'react-bootstrap/Modal';
import SigninFlow from './SigninFlow';

class LogInModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        }
    }

    handleClose = () => this.setState({ show: false });
    handleShow = () => this.setState({ show: true });

    render() {
        return (
            <div className="d-flex justify-content-end">
                <div id="logInButton" className="header text-right font-weight-bold btn" onClick={this.handleShow}>Log In</div>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Log In</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="signInModalBody">
                        <SigninFlow />
                    </Modal.Body>
                </Modal>
            </div>
        )
    };
}

export default LogInModal;