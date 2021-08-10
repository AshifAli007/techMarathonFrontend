import {BrowserRouter, withRouter} from 'react-router-dom';
import Main from './containers/MainLayout/MainLayout'
import { connect } from 'react-redux';
import * as actions from './store/actions/index';
import {React, Component} from 'react';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignIn();
  }
  render() {
    return (
      <BrowserRouter>
            <Main></Main>
      </BrowserRouter>
    );
  }

}

const mapDispatchToProps = (dispatch) =>{
  return {
    onTryAutoSignIn: () => dispatch(actions.authCheckState()),  
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));
