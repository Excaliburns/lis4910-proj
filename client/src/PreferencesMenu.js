import React from 'react';
import { AuthState } from '@aws-amplify/ui-components'


const PreferencesMenu = (props) => {
    return props.authState === AuthState.SignedIn ? (
    <div className="col-3 border">
        Your Preferences
    </div>
    ) : (
        null
    )
}

export default PreferencesMenu;