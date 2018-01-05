import React from 'react';
import PropTypes from 'prop-types';
import ExerciseSet from './ExerciseSet';
import {connect} from 'react-redux';

import {deleteExercise, addSet, fetchSets} from '../actions';

class Exercise extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onFetchSets(this.props.exrc.id);
  }

  render() {
    return (
      <li>
        {`${this.props.exrc.name} `}
        <button onClick={() => {
          this.props.onAddSet(this.props.exrc.id, 0, 0)
        }}>
          +
        </button>

        <button onClick={() => {
          this.props.onDeleteExercise(this.props.exrc.id, this.props.exrcIndex)
        }}>
          Delete Exercise
        </button>

        <ul>
          {this.props.exrc.exerciseSets.sort((set1, set2) => {
            return set1.id > set2.id;
          })
          .map((set, index) => (
            <ExerciseSet key={set.id} index={index} workoutId={this.props.workoutId} exerciseId={this.props.exrc.id} setId={set.id}
              weight={set.weight} repetitions={set.repetitions} />
          ))}
        </ul>
      </li>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteExercise: (exerciseId, exrcIndex) => {
      dispatch(deleteExercise(exerciseId, exrcIndex))
    },
    onAddSet: (exerciseId, weight, repetitions) => {
      dispatch(addSet(exerciseId, weight, repetitions))
    },
    onFetchSets: (exerciseId) => {
      dispatch(fetchSets(exerciseId))
    }
  };
};

/*Exercise.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};*/

export default connect(mapStateToProps, mapDispatchToProps)(Exercise);
