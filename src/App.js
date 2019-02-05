import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { connect, Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

const REQUEST = 'REQUEST'

const request = (argument) => {
  return {
    type: REQUEST,
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

const fetchData = (argument) => {
  return (dispatch) => {
    dispatch(request(argument))

    fetch('https://jsonplaceholder.typicode.com/todos/'+argument)
      .then(response => response.json())
      .then(json =>
        dispatch(response(json))
      )
  }
}

const reducer = (state = {isFetching: false, isEmpty: true, data: {}}, action) => {
  switch (action.type) {
    case REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isEmpty: true,
        data: {}
      });
    case RESPONSE:
      return Object.assign({}, state, {
        isFetching: false,
        isEmpty: false,
        data: action.argument
      })
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  reducer
})

const store = createStore(
   rootReducer,
   applyMiddleware(thunkMiddleware)
)

const mapStateToProps = (state) => {
  return {stateProp: state}
};

const mapExecuteToProps = (dispatch) => {
  return {
    executeProp: (argument) => {
      dispatch(fetchData(argument))
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
    this.props.executeProp(this.props.match.params.id)
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
    console.log(this.props.stateProp)
  return <h3>Requested Param: {this.props.stateProp.reducer.isEmpty ? 'Fetching...' : this.props.stateProp.reducer.data.title}</h3>
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