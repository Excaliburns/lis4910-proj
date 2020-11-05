import React from 'react';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css"

async function getMenu(date) {
  let url = new URL('api/menu', window.location.href)
  let params = {
                ...date && { date: date }
               }

  url.search = new URLSearchParams(params).toString();

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify( {date: date} )
  });
  const json = await resp.json();
  return json;
}

class Display extends React.Component {
  
  // accepts Date
  async selectChange(date) {
    console.log('requesting for: ' + date);

    this.setState({
      loading: true,
      selectedDate: date.toLocaleString(),
    });

    getMenu(date).then( (data) => {
      console.log(data);

      this.menu = data;
      this.setState({ loading: false });
    });
  }
  
  constructor(props) {
    super(props);

    this.style = {
      display: 'flex', 
      paddingTop: '5rem',
      justifyContent: 'center',
      alignItems: 'middle'
    }

    this.state = {
      selectedDate: new Date(),
      loading: true
    }

    this.menu = this.selectChange(new Date());
  }

  render () {
    return (
      <div>
        <div className="App" style={this.style}>
          <DatePicker
           selected={ this.state.selectedDate }
           onChange={date => this.selectChange(date)}>
          </DatePicker>
        </div>
        <pre id='menu'>
          {
            this.state.loading ? 'loading...' : JSON.stringify(this.menu, null, 2)
          }
          </pre>
      </div>
    );
  }
}

function App() {
  return(
    <Display />
  )
}

export default App;
