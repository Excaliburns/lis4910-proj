import React from 'react';

function FilteredList(props) {

    const extras = ['Vegan', 'Vegetarian', 'Mindful']

    const includedExtras = []
    const nonExtras = (typeof props === 'undefined' || props.filters.length) ? (props.filters.filter ((each) =>  {
        if (extras.includes(each)) {
            includedExtras.push(each);
            return false;
        }
        else return true;
    })) : null;

    if (nonExtras == null) {
        return (
            <div className="font-125 pt-5">You have no preferences! Please go to your profile and add some!</div>
        )
    }

    const firstFilter = nonExtras.slice(0, nonExtras.length - 1);
    const lastFilter = nonExtras[nonExtras.length - 1]
    let result = (nonExtras.length) ? (nonExtras.length > 1 ? (firstFilter.join('-Free, ') + '-Free & ' + lastFilter + '-Free ') : nonExtras[0] + '-Free ') : '';

    includedExtras.forEach( (each) => { result += ` ${each}`})
    return (
        <div className="col-8 offset-2 meal">
            <div className="mt-4 font-125">
                <span className="font-weight-bold font-125">{result}</span> options will be available at <span className="font-weight-bold font-125">Seminole Cafe </span>on...
             </div>
            <RestrictedDay days={props.foodList} key={'foodList'}></RestrictedDay>
        </div>
    )
}

function RestrictedDay(props) {
    if (props.days) {
        let days = [];

        for (const [key, value] of Object.entries(props.days)) {
            const dayString = new Date(key).toLocaleDateString(undefined, { weekday: 'long' });
            const monthDayYearString = new Date(key).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

            if (dayString != 'Invalid Date' || monthDayYearString != 'Invalid Date') {
                days.push(
                    <div className="pt-2" key={key}>
                        <div className="font-weight-bold font-125">{dayString}, {monthDayYearString}</div>
                        <RestrictedMeal meal={value} />
                    </div>
                )
            }
        }

        return <div>{days}</div>
    }
    return null;
}

function RestrictedMeal(props) {
    if (props.meal) {
        let mealItems = [];

        for (const thing in props.meal) {
            mealItems.push (
                <div className="font-125 pb-4" key={'meal' + thing}>
                    {thing}
                    <RestrictedMealItems items={props.meal[thing]}/>
                </div>
            )
        }

        return mealItems;
    }

    return null;
}

function RestrictedMealItems(props) {
        let rejectedItems = [];

        for (let item of props.items) {
            rejectedItems.push (
                <div className="pt-2" key={'foodItem' + item.name}>{item.name}</div>
            )
        }

        return rejectedItems;
}

export default FilteredList;