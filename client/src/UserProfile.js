import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';

import Cookies from 'universal-cookie';

const cookies = new Cookies();

class UserProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userRestrictions: [],
            userPreferences: []
        }
    }

    updateRestrictionState = (e) => {
        this.setState ({userRestrictions: [...this.state.userRestrictions, e.target.value]});
        
        this.updatePreferences();
    }

    updatePreferenceState = (e) => {
        this.setState ({userPreferences: [...this.state.userPreferences, e.target.value]});

        this.updatePreferences();
    }

    gotoMainPage = () => {
        this.props.gotoMainPage();
    }

    render() {
        return (
            <div className="p-5">
                <div className="d-flex">
                    <div className="cursor-pointer d-flex align-items-center" onClick={this.gotoMainPage}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <div className="pl-3">
                            Back to main page
                        </div>
                    </div>
                </div>



                <div className="w-100 text-center">
                    <div className="">
                        <p className="font-size-large">Change your dieteary preferences:</p>
                        <div className="font-125">Allergens</div>
                        <div className="d-flex justify-content-center pt-4">
                            <PrefCheckbox name='milk' />
                            <PrefCheckbox name='nut' />
                            <PrefCheckbox name='wheat' />
                            <PrefCheckbox name='gluten' />
                            <PrefCheckbox name='egg' />
                            <PrefCheckbox name='fish' />
                            <PrefCheckbox name='peanuts' />
                            <PrefCheckbox name='shellfish' />
                            <PrefCheckbox name='soy' />
                        </div>
                        <div className="font-125 pt-4">Preferences</div>
                        <div className="d-flex justify-content-center pt-4">
                            <ExtraCheckbox name='vegan' />
                            <ExtraCheckbox name='vegetarian' />
                            <ExtraCheckbox name='mindful' />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserProfile;


function PrefCheckbox(props) {
    const name = props.name.replace(/\s+/g, '');
    const [checked, setChecked] = useState(cookies.get(props.name));

    const handleClick = (event)  => {
        event.target.checked ? setChecked(true) : setChecked(false);

        if (event.target.checked) {
            cookies.set(`${name}Pref`, name );
        }
        else {
            cookies.remove(`${name}Pref`);
        }
    }

    return (
            <div className="d-block text-center pl-3">
                <input type="checkbox" id={`${name}Pref`} name={`${name}Pref`} defaultChecked={!!cookies.get(`${name}Pref`)} value={name} onClick={handleClick} />
                <br></br>
                <label htmlFor={`${name}Pref`}>{name.charAt(0).toUpperCase() + name.slice(1)}-Free</label>
            </div>
        )
}

function ExtraCheckbox(props) {
    const name = props.name.replace(/\s+/g, '');
    const [checked, setChecked] = useState(cookies.get(props.name));

    const handleClick = (event)  => {
        event.target.checked ? setChecked(true) : setChecked(false);

        if (event.target.checked) {
            cookies.set(`${name}Extra`, name );
        }
        else {
            cookies.remove(`${name}Extra`);
        }
    }

    return (
            <div className="d-block text-center pl-3">
                <input type="checkbox" id={`${name}Extra`} name={`${name}Extra`} defaultChecked={!!cookies.get(`${name}Extra`)} value={name} onClick={handleClick} />
                <br></br>
                <label htmlFor={`${name}Extra`}>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
            </div>
        )
}