import React from 'react';

import DatePicker from 'react-datepicker';
import { Typeahead } from 'react-bootstrap-typeahead';

import Spinner from 'react-bootstrap/Spinner';
import { AuthState } from '@aws-amplify/ui-components';
import PreferencesMenu from './PreferencesMenu';

function getMenu(date) {
    let url = new URL('api/menu', window.location.href)
    let params = {
        ...date && { date: date }
    }

    url.search = new URLSearchParams(params).toString();

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ date: date })
    })
        .then(response => {
            if (response.status === 503) {
                return { status: 503 }
            }
            else {
                return response.json()
            }
        })
        .then(response => {
            return response;
        })
        .catch(err => { console.log(err); });
}

function getFoodTypeaheadData() {
    const parseJson = async response => {
        const text = await response.text()
        try{
          const json = JSON.parse(text)
          return json
        } catch(err) {
            return [];
        }
      }

    let url = new URL('api/allFood', window.location.href);

    return fetch(url)
        .then(response => parseJson(response))
        .then(response => { 
            if(response)  {return response}
            else {return null }});
}

function searchForFood(food, filters, date) {
    if (typeof food[0] === 'undefined') {
        return getMenu(date)
    }
    else {
        console.log('fetching: api/searchFood?food=' + food[0].name);
        let url = new URL('api/searchFood?food=' + food[0].name, window.location.href);

        return fetch(url)
            .then(response => response.json())
            .then(response => { return response });
    }
}
function SpinnerWithText(props) {

    return (
        <div className="text-center py-4">
            <span>{props.text}</span>

            <div className="pt-4">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        </div>

    )
}

function FoodList(props) {
    if (props.foodList) {
        console.log(props.foodList)

        if (props.foodList.type === 'list') {
            return (
                <div className="col-8 offset-2 meal">
                    <FoodMeal foodMeals={props.foodList.menu} key={'foodList'}></FoodMeal>
                </div>
            )
        }
        else if (props.foodList.type === 'dated') {
            return (
                <div className="col-8 offset-2 meal">
                    <div className="mt-4 font-125">
                        <span className="font-weight-bold font-125">{Object.values(Object.values(props.foodList)[0])[0].name}</span> will be available at <span className="font-weight-bold font-125">Seminole Cafe </span>on...
            </div>
                    <DatedMeal foodMeals={props.foodList} key={'foodList'}></DatedMeal>
                </div>
            )
        }
    }

    return null;
}

function DatedMeal(props) {
    if (props.foodMeals) {

        delete (props.foodMeals.type);

        let days = [];

        for (const [key, value] of Object.entries(props.foodMeals)) {
            const dayString = new Date(key).toLocaleDateString(undefined, { weekday: 'long' });
            const monthDayYearString = new Date(key).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

            days.push(
                <div className="pt-3">
                    <div>
                        <h5 className="font-weight-bold d-inline">{dayString}, </h5><h5 className="d-inline">{monthDayYearString}</h5>
                    </div>
                    <DatedFood foods={value}></DatedFood>
                </div>
            )
        }

        return <div>{days}</div>;
    }

    return null;
}

function DatedFood(props) {
    if (props.foods) {
        const keys = Object.keys(props.foods);
        const first = keys.slice(0, keys.length - 1);
        const last = keys[keys.length - 1];
        const result = keys.length > 1 ? (first.join(', ') + ' & ' + last) : keys[0];
        return (
            <div className="pt-1">
                <p className="m-0">{result}</p>
                <p className="m-0">{Object.values(props.foods)[0].name}</p>
            </div>
        );
    }
}

function FoodMeal(props) {
    if (props.foodMeals) {
        let meals = [];

        for (let i = 0; i < props.foodMeals.length; i++) {
            meals.push(
                <div className="pt-4 base-font" key={'foodMeal' + i}>
                    <h2>{props.foodMeals[i].mealTitle}</h2>
                    <FoodItem foodItems={props.foodMeals[i].mealItems} />
                </div>
            )
        }

        return <div>{meals}</div>;
    }

    return null;
}


function FoodItem(props) {
    if (props.foodItems) {
        let items = [];

        for (let i = 0; i < props.foodItems.length; i++) {
            items.push(
                <div className="pt-2" key={'foodItem' + i}>{props.foodItems[i].name}</div>
            )
        }

        return <div>{items}</div>;
    }

    return null;
}

class SearchAndPreferences extends React.Component {
    // accepts Date
    selectChange(date) {
        console.log('requesting for: ' + date.toLocaleDateString());

        this.setState({
            loading: true,
            loadingText: 'loading....',
            selectedDate: date,
        });

        getMenu(date).then(menuResponse => {
            if (menuResponse && menuResponse.status && menuResponse.status === 503) {
                this.setState({
                    loading: true,
                    loadingText: 'webserver is still initializing! give us a moment...'
                })

                setTimeout(() => {this.selectChange(date)}, 5000)
            }
            else {
                this.menu = menuResponse;
                this.setState({ started: false, loading: false });
            }
        });
    }

    searchChange(selected) {
        if (selected[0]) {  
            this.setState({ loading: true, loadingText: 'loading....', selectedSearch: selected[0].name});
        }
        else {
            this.setState({ loading: true, loadingText: 'loading....' });
        }

        searchForFood(selected, null, this.state.selectedDate).then(
            response => {
                this.menu = response;
                this.setState({ loading: false });
            }
        )
    }

    constructor(props) {
        super(props);

        this.state = {
            selectedDate: new Date(),
            selectedSearch: '',
            loading: true,
            started: false,
            food: [new Map()]
        }

        getFoodTypeaheadData().then(
            response => { this.setState({ food: response }) }
        )

        this.menu = this.selectChange(new Date());
    }

    render() {
        return (
            <div className="p-5">
                <div className="pt-4 row">
                    <Typeahead
                        id="foodTypeahead"
                        className="col-3"
                        labelKey="name"
                        placeholder="Search your favorite foods here..."
                        isLoaded={(!this.state.started)}
                        onChange={selected => this.searchChange(selected)}
                        options={this.state.food}>
                    </Typeahead>
                    <Typeahead
                        id="dietaryTypeahead"
                        className="col-3"
                        placeHolder="Dietary restrictions?"
                        isLoaded={(!this.state.started)}
                        onChange={selected => this.searchChange(selected)}
                        options={dietaryRestrictions}>
                    </Typeahead>
                    <DatePicker
                        selected={this.state.selectedDate}
                        onChange={date => this.selectChange(date)}>
                    </DatePicker>
                </div>
                <div className="row mt-3" style={{ margin: 'auto' }}>
                    <div className="col-3 border">
                        Hours of Operation
              </div>
                    <div id='menu' className={"border" + this.props.authState === AuthState.SignedIn ? 'col-6' : 'col-9'} >
                        {
                            this.state.loading ? <SpinnerWithText text={this.state.loadingText} /> : <FoodList foodList={this.menu} />
                        }
                    </div>
                    <PreferencesMenu />
                </div>
            </div>
        )
    }
}

const dietaryRestrictions = [ 'Milk', 'Tree Nuts', 'Wheat', 'Gluten', 'Eggs', 'Fish', 'Peanuts', 'Shellfish', 'Soy', 'Mindful (low cal)', 'Vegan', 'Vegetarian' ]

export default SearchAndPreferences;