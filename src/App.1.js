import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createStore, applyMiddleware } from 'redux'
import { connect, Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

const EXECUTE = 'EXECUTE'

const execute = (argument) => {
  return {
    type: EXECUTE,
    argument
  }
};

const RESPONSE = 'RESPONSE'
const response = (argument) => {
  return {
    type: RESPONSE,
    argument
  }
};

const fetchResponse = (argument) => {
  return (dispatch) => {
    dispatch(execute(argument))

    fetch('https://jsonplaceholder.typicode.com/todos/'+argument)
      .then(response => response.json())
      .then(json =>
        dispatch(response(json))
      )
  }
}

const reducer = (state = {title: 'Initial'}, action) => {
  switch (action.type) {
    case EXECUTE:
      return action.argument
    case RESPONSE:
      
    default:
      return state;
  }
};


const store = createStore(
   reducer,
   applyMiddleware(thunkMiddleware)
)

const mapStateToProps = (state) => {
  return {stateProp: state}
};

const mapExecuteToProps = (dispatch) => {
  return {
    executeProp: (argument) => {
      dispatch(execute(argument))
    }
  }
};

const AppRouter = () => (
  <Router>
    <div>
      <Header />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);


const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
// const Topic = ({ match }) => <h3>Requested Param: {match.params.id}</h3>;
class Topic extends Component {
  fetch() {
    fetch('https://jsonplaceholder.typicode.com/todos/'+this.props.match.params.id)
  .then(response => response.json())
  .then(json => this.props.executeProp(json))

  }

  componentDidMount() {
    this.fetch()
  }
  componentDidUpdate(prevProps, prevState) {
    if(this.props.match.params.id !== prevProps.match.params.id) {
      this.fetch()
    }
  }
  render() {
  return <h3>Requested Param: {this.props.stateProp.title}</h3>
  }
}

const Container = connect(mapStateToProps, mapExecuteToProps)(Topic);


const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>

    <ul>
      <li>
        <Link to={`${match.url}/1`}>Components</Link>
      </li>
      <li>
        <Link to={`${match.url}/2`}>Props v. State</Link>
      </li>
    </ul>

    <Route path={`${match.path}/:id`} component={Container} />
    <Route
      exact
      path={match.path}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
);
const Header = () => (
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/about">About</Link>
    </li>
    <li>
      <Link to="/topics">Topics</Link>
    </li>
  </ul>
);

const App = () => (
      <Provider store={store}>
        <AppRouter/>
      </Provider>
);

export default App;