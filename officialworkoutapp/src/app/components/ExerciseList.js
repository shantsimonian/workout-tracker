import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import Exercise from './Exercise';
import { addExercise, fetchExercises, clearExercises } from '../actions';

class ExerciseList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exercises: [],
    };

    this.onAddExercise = this.onAddExercise.bind(this);
    this.onUpdateExerciseName = this.onUpdateExerciseName.bind(this);
    this.onDeleteExercise = this.onDeleteExercise.bind(this);
  }

  componentWillMount() {
    if (!this.props.cookies.get('token')) {
      this.props.history.push('/');
    }
  }

  componentDidMount() {
    this.props.client.query({
      query: gql`
        query FetchExercises($workoutId: Int!) {
          getExercises(workoutId: $workoutId) {
            id,
            name,
            sets {
              id,
              weight,
              repetitions
            }
          }
        }
      `,
      variables: {
        workoutId: this.props.match.params.workoutId,
      },
      options: {
        fetchPolicy: 'cache-and-network',
      },
    })
      .then((response) => {
        this.setState({
          exercises: response.data.getExercises,
        });
      });
  }

  onAddExercise(name, workoutId) {
    this.props.client.mutate({
      mutation: gql`
        mutation AddExercise($name: String!, $workoutId: Int!) {
          addExercise(name: $name, workoutId: $workoutId) {
            id,
            name,
            sets {
              id,
              weight,
              repetitions
            }
          }
        }
      `,
      variables: {
        name,
        workoutId,
      },
    })
      .then((response) => {
        this.setState({
          exercises: [
            ...this.state.exercises,
            response.data.addExercise,
          ],
        });
      });
  }

  onDeleteExercise(workoutId, exerciseId, exrcIndex) {
    this.props.client.mutate({
      mutation: gql`
        mutation DeleteExercise($workoutId: Int!, $exerciseId: Int!) {
          deleteExercise(workoutId: $workoutId, exerciseId: $exerciseId)
        }
      `,
      variables: {
        workoutId,
        exerciseId,
      },
    })
      .then((response) => {
        if (response.data.deleteExercise === 'Success') {
          this.setState({
            exercises: [
              ...this.state.exercises.slice(0, exrcIndex),
              ...this.state.exercises.slice(exrcIndex + 1),
            ],
          });
        }
      });
  }

  onUpdateExerciseName(workoutId, exerciseId, exrcIndex, name) {
    this.props.client.mutate({
      mutation: gql`
        mutation UpdateExerciseName($workoutId: Int!, $exerciseId: Int!, $name: String!) {
          updateExerciseName(workoutId: $workoutId, exerciseId: $exerciseId, name: $name) {
            name
          }
        }
      `,
      variables: {
        workoutId,
        exerciseId,
        name,
      },
    })
      .then((response) => {
        if (response.data.updateExerciseName.name === name) {
          this.setState({
            exercises: [
              ...this.state.exercises.slice(0, exrcIndex),
              {
                ...this.state.exercises[exrcIndex],
                name,
              },
              ...this.state.exercises.slice(exrcIndex + 1),
            ],
          });
        }
      });
  }

  renderFooterExerciseNameInput() {
    if (this.state.exercises.length > 0) {
      return (
        <div>
          <div className="grid-x grid-margin-x">
            <div className="medium-10 medium-offset-1 cell">
              <input
                className="input-margin-top"
                type="text"
                placeholder="Enter a name"
                maxLength="30"
                ref={(node) => {
                this.footerExrcName = node;
              }}
              />
            </div>
          </div>
          <div className="grid-x grid-margin-x">
            <div className="medium-10 medium-offset-1 cell">
              <button
                className="hollow button"
                onClick={() => {
                if (this.footerExrcName.value !== '') {
                  this.onAddExercise(this.footerExrcName.value, this.props.match.params.workoutId);
                  this.footerExrcName.value = '';
                }
              }}
              >
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="grid-container">

        <div className="grid-x grid-margin-x">
          <div className="medium-10 medium-offset-1 cell">
            <button
              className="hollow button float-right"
              onClick={() => {
              this.props.cookies.remove('token');
              this.props.cookies.remove('name');
              this.props.history.push('/');
            }}
            >
              Logout
            </button>
            <Link to="/workoutlist">
              <button className="hollow button float-left">Back to Workout List</button>
            </Link>
          </div>
        </div>

        <div className="grid-x grid-margin-x">
          <div className="medium-10 medium-offset-1 cell">
            <h4 className="exrc-name-label">Exercise Name: </h4>
          </div>
        </div>

        <div className="grid-x grid-margin-x">
          <div className="medium-10 medium-offset-1 cell">
            <input
              className=""
              type="text"
              placeholder="Enter a name"
              maxLength="30"
              ref={(node) => {
              this.exrcName = node;
            }}
            />
          </div>
        </div>

        <div className="grid-x grid-margin-x">
          <div className="medium-10 medium-offset-1 cell">
            <button
              className="hollow button"
              onClick={() => {
              if (this.exrcName.value !== '') {
                this.onAddExercise(this.exrcName.value, this.props.match.params.workoutId);
                this.exrcName.value = '';
              }
            }}
            >
              Add Exercise
            </button>
          </div>
        </div>

        <div className="grid-x grid-margin-x">
          <div className="medium-10 medium-offset-1 cell">
            <ul className="list-group">
              {this.state.exercises.map((exrc, index) => (
                <Exercise
                  key={exrc.id}
                  workoutId={Number(this.props.match.params.workoutId)}
                  exrcIndex={index}
                  exrc={exrc}
                  onUpdateExerciseName={this.onUpdateExerciseName}
                  onDeleteExercise={this.onDeleteExercise}
                />
              ))}
            </ul>
          </div>
        </div>

        {this.renderFooterExerciseNameInput()}

      </div>
    );
  }
}

ExerciseList.propTypes = {
  history: PropTypes.object.isRequired,
  cookies: PropTypes.object.isRequired,
};

export default withApollo(withRouter(withCookies(ExerciseList)));
