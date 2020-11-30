import React from 'react';
import { AuthState } from '@aws-amplify/ui-components'

import FilteredList from './FilteredList';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function search(filters) {
    let url = new URL('api/searchFood', window.location.href);

    url.searchParams.append('date', new Date());
    if (filters) url.searchParams.append('restrictions', filters);

    console.log('fetching:' + url);

    return fetch(url)
        .then(response => response.json())
        .then(response => { return response });
}

function collectFilters() {
    const milk = cookies.get('milkPref');
    const nut = cookies.get('nutPref');
    const wheat = cookies.get('wheatPref');
    const gluten = cookies.get('glutenPref');
    const egg = cookies.get('eggPref');
    const fish = cookies.get('fishPref');
    const peanuts = cookies.get('peanutsPref');
    const shellfish = cookies.get('shellfishPref');
    const soy = cookies.get('soyPref');
    const vegan = cookies.get('veganExtra');
    const vegetarian = cookies.get('vegetarianExtra');
    const mindful = cookies.get('mindfulExtra');


    const filters = [milk, nut, wheat, gluten, egg, fish, peanuts, shellfish, soy, vegan, vegetarian, mindful].filter(Boolean).filter(each => typeof each !== 'undefined' && each !== 'null').map(each => { return (each.charAt(0).toUpperCase() + each.slice(1)) });

    return filters;
}

class PreferencesMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menu: new Map()
        }

        const menu = search(collectFilters()).then(response => {
            console.log (`here ${response}`);
            this.setState({ menu: response });
        });
    }

    render() {
        return this.props.authState === AuthState.SignedIn ? (
            <div className="menu col-4 garnet-border text-center font-weight-bold pt-3 ml-5">
                Some food options that match your preference for today:

                <FilteredList foodList={this.state.menu} filters={collectFilters()} />
            </div>
        ) : (
                null
            )
    }
}

export default PreferencesMenu;