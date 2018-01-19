import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {withCookies, Cookies} from 'react-cookie';

import WorkoutList from './WorkoutList';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      fname: '',
      lname: '',
      createAccount: false,
      loginError: false,
      loginErrorMessage: '',
      loading: false
    };
  }

  componentWillMount() {
    if (this.props.cookies.get('token')) {
      this.props.history.push('/workoutlist');
    }
  }

  onCreateAccountForm() {
    this.setState({
      createAccount: true
    })
  }

  onLoginForm() {
    this.setState({
      createAccount: false
    })
  }

  onChangeUsername(event) {
    this.setState({
      username: event.target.value
    });
  }

  onChangePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  onChangeFirstName(event) {
    this.setState({
      fname: event.target.value
    })
  }

  onChangeLastName(event) {
    this.setState({
      lname: event.target.value
    })
  }

  onLoginSubmit() {
    fetch('/api/login',
      {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          type: 'LOGIN_AUTH',
          username: this.state.username,
          password: this.state.password
        })
      }
    ).then(response => response.json())
    .then(json => {
      if (json.message === 'ok') {
        this.props.cookies.set('token', json.token);
        this.props.history.push('/workoutlist');
      } else {
        this.setState({
          loginError: true,
          loginErrorMessage: json.message,
          loading: false
        });
      }
    })

    this.setState({
      loading: true
    });
  }

  onCreateAccountSubmit() {
    fetch('/api/createaccount',
      {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          type: 'CREATE_ACCOUNT',
          username: this.state.username,
          password: this.state.password,
          fname: this.state.fname,
          lname: this.state.lname
        })
      }
    )
    .then(response => response.json())
    .then(() => {
      this.onLoginSubmit();
    });

    this.setState({
      loading: true
    });
  }

  renderLoginProgressBar() {
    if (this.state.loading) {
      return (
        <div className='progress'>
          <div className='progress-bar progress-bar-striped progress-bar-animated prog-bar-width' role='progressbar'
            aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'></div>
        </div>
      );
    }
  }

  renderLoginErrorAlert() {
    if (this.state.loginError) {
      return (
        <div className='alert alert-danger' role='alert'>
          <strong>Oops!</strong> {this.state.loginErrorMessage}
        </div>
      );
    }
  }

  renderCreateAccountForm() {
    if (this.state.createAccount) {
      return (
        <div className='form-group'>
          <input className='form-control' type='text' placeholder='username'
            onChange={(e) => this.onChangeUsername(e)} />
          <input className='form-control input-margin-top' type='password' placeholder='password'
            onChange={(e) => this.onChangePassword(e)} />
          <input className='form-control input-margin-top' type='text' placeholder='first name' onChange={(e) => this.onChangeFirstName(e)} />
          <input className='form-control input-margin-top' type='text' placeholder='last name' onChange={(e) => this.onChangeLastName(e)} />
          <input className='btn btn-primary btn-block btn-margin-top no-gutters' type='button' value='Create my account!'
            onClick={() => this.onCreateAccountSubmit()} />
          <input className='btn btn-secondary btn-block btn-margin-top no-gutters' type='button' value='Already have an account?'
            onClick={() => this.onLoginForm()} />
        </div>
      );
    }
  }

  renderLoginForm() {
    if (!this.state.createAccount) {
      return (
        <div className='form-group'>
          <input className='form-control' type='text' placeholder='username'
            onChange={(e) => this.onChangeUsername(e)} />
          <input className='form-control input-margin-top' type='password' placeholder='password'
            onChange={(e) => this.onChangePassword(e)} />
          <input className='btn btn-primary btn-block btn-margin-top no-gutters' type='button' value='Login'
            onClick={() => this.onLoginSubmit()} />
          <input className='btn btn-secondary btn-block btn-margin-top no-gutters' type='button' value='Create Account'
            onClick={() => this.onCreateAccountForm()} />
        </div>
      );
    }
  }

  render() {
    return (
      <div className='row justify-content-center'>
        <div className='col-md-8'>
          {this.renderLoginErrorAlert()}
          {this.renderLoginForm()}
          {this.renderCreateAccountForm()}
          {this.renderLoginProgressBar()}
        </div>
      </div>
    );
  }
};

LoginForm.propTypes = {
  history: PropTypes.object.isRequired,
  cookies: PropTypes.object.isRequired
};

export default withRouter(withCookies(LoginForm));