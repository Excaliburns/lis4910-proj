import React, { Text } from 'react';
import { getUser } from './graphql/queries'
import { API, graphqlOperation } from 'aws-amplify';

async function fetchUserPreferencesAndDietaryRestrictions() {
    try {
        const userData = await API.graphql(graphqlOperation(getUser));
        const data = userData.data;
        console.log(data);
    } catch ( err ) {
        console.log('error getting user data: ' + err);
    }
}

class UserProfile extends React.Component {

    gotoMainPage = () => {
        this.props.gotoMainPage();
    }

    render() {
        return (
            <div className="p-5">
                <div onClick={this.gotoMainPage}> Back to main page </div>

                <div className="w-100">
                    <div className="d-flex justify-content-center">
                        <p onClick={fetchUserPreferencesAndDietaryRestrictions()}>Change your dieteary preferences:</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserProfile;