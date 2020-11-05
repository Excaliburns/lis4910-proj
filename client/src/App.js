import React from 'react';
import _ from 'lodash';

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 1
    };
  }

  displayMenu(val) {
    console.log(val);

    this.props.onChange(val);
    this.setState({value: val});
  }

  render() {
    return (
    <select style={{width: '250px'}} value={this.state.value} onChange={(event) => this.displayMenu(event.target.value)}>
      {
        _.range(1, 31).map(x => <option value={x} key={x}>{x}</option>)
      }
    </select>
    )
  }
}

async function getMenu(week, day) {
  let url = new URL('api/menu', window.location.href)
  let params = {
                ...week && { week: week },
                ...day  && { day: day}
               }

  url.search = new URLSearchParams(params).toString();

  const resp = await fetch(url);
  const json = await resp.json();
  return json;
}

class Display extends React.Component {
  
  async selectChange(i) {

    this.setState({
      loading: true,
      select: i,
    });

    const menu = getMenu(Math.floor(i / 7) + 1, i);

    menu.then( result => {
      this.menu = result;
      this.setState({
        loading: false
      })
    })
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
      select: 1,
      loading: true
    }

    this.menu = this.selectChange(1);
  }

  render () {
    return (
      <div>
        <div className="App" style={this.style}>
          <Select 
          onChange = {(i) => this.selectChange(i)}/>
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
