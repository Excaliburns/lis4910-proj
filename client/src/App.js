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

    this.props.onHAAA(val);
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
  constructor(props) {
    super(props);

    this.style = {
      display: 'flex', 
      paddingTop: '5rem',
      justifyContent: 'center',
      alignItems: 'middle'
    }

    this.menu = [];

    this.state = {
      select: 1
    }
  }

  async selectChange(i) {
    const menu = await getMenu(null, i);

    console.log(menu);

    this.menu = menu;

    this.setState({
      select: i,
    });
  }

  render () {
    return (
      <div>
        <div className="App" style={this.style}>
          <Select 
          onHAAA = {(i) => this.selectChange(i)}/>
        </div>
        <pre id='menu'>{JSON.stringify(this.menu, null, 2)}</pre>
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
