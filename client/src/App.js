import React from 'react';
import DatePicker from 'react-datepicker';
import { Typeahead } from 'react-bootstrap-typeahead';

import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

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

class Display extends React.Component {
  getFoodTypeaheadData() {
    let url = new URL('api/allFood', window.location.href);
  
    return fetch(url)
      .then(response => response.json())
      .then(response => { return response } );
  }

  // accepts Date
  selectChange(date) {
    console.log('requesting for: ' + date.toLocaleDateString());

    this.setState({
      loading: true,
      loadingText: 'loading....',
      selectedDate: date,
    });

    getMenu(date).then(menuResponse => {
      if (menuResponse.status && menuResponse.status === 503) {
        this.setState({
          loading: true,
          loadingText: 'webserver is still initializing! give us a moment...'
        })
      }
      else {
        this.menu = menuResponse;
        this.setState({ loading: false });
      }
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date(),
      loading: true
    }

    this.getFoodTypeaheadData().then (
      response =>  {
        this.setState({ food: response })
      }
    )

    this.menu = this.selectChange(new Date());
  }

  render() {
    return (
      <div>
        <div class="col text-center pt-3 font-weight-bold font-size-large" id="title">Welcome to FSU Dining!</div>
        <div className="App pt-4 row">
          <ConditionalTypeahead class="col-6 pl-5" isLoaded={(!this.state.loading)} food={this.state.food} />
          <DatePicker
            selected={this.state.selectedDate}
            onChange={date => this.selectChange(date)}>
          </DatePicker>
        </div>
        <pre id='menu' className="p-5">
          {
            this.state.loading ? this.state.loadingText : JSON.stringify(this.menu, null, 2)
          }
        </pre>
      </div>
    );
  }
}

function ConditionalTypeahead(props) {
  if (props.isLoaded) {
    return <Typeahead
      id="foodTypeahead"
      className={props.class}
      onChange={(selected) => { console.log(selected) }}
      options={props.food}
      labelKey="name"
      placeholder="Search your favorite foods here...">
    </Typeahead>
  }
  else {
    return null;
  }
}

function App() {
  return (
    <Display />
  )
}

export default App;
