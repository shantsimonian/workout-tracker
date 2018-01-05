/*
 * action creators
 */
const REQUEST_EXERCISES = 'REQUEST_EXERCISES';
const requestExercises = () => {
    return {
      type: REQUEST_EXERCISES
    }
}

const RECEIVE_EXERCISES = 'RECEIVE_EXERCISES';
const receiveExercises = (json, workoutId) => {
  console.log('RECEIVE EXERICSES', json);
  return {
    type: RECEIVE_EXERCISES,
    workoutId: workoutId,
    exercises: json.map(child => {
      return {
        id: child.id,
        name: child.name,
        exerciseSets: []
      }
    })
  }
}

const REQUEST_SETS = 'REQUEST_SETS';
const requestSets = () => {
  return {
    type: REQUEST_SETS
  }
}

const RECEIVE_SETS = 'RECEIVE_SETS';
const receiveSets = (json, workoutId, exerciseId) => {
  return {
    type: RECEIVE_SETS,
    workoutId: workoutId,
    exerciseId: exerciseId,
    sets: json.map(child => {
      return {
        id: child.id,
        weight: child.weight,
        repetitions: child.repetitions
      }
    })
  }
}

const UPDATE_SET_REQUEST = 'UPDATE_SET_REQUEST';
const updateSetRequest = () => {
  return {
    type: UPDATE_SET_REQUEST
  }
}

const UPDATE_SET_SUCCESS = 'UPDATE_SET_SUCCESS';
const updateSetSuccess = (json, workoutId, exerciseId) => {
  return {
    type: UPDATE_SET_SUCCESS,
    workoutId: workoutId,
    exerciseId: exerciseId,
    set: {
      id: json.id,
      weight: json.weight,
      repetitions: json.repetitions
    }
  }
}

export const updateSet = (workoutId, exerciseId, setId, weight, repetitions) => {
  return (dispatch) => {
    dispatch(updateSetRequest())
    return fetch('/api/updateset',
      {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          type: 'UPDATE_SET',
          exerciseId: exerciseId,
          setId: setId,
          weight: weight,
          repetitions: repetitions
        })
      }
    )
    .then(response => response.json())
    .then(json => dispatch(updateSetSuccess(json, workoutId, exerciseId)))
  }
}

export const fetchSets = (workoutId, exerciseId) => {
  return (dispatch) => {
    dispatch(requestSets())
    return fetch('/api/sets',
      {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          type: 'RETRIEVE_SETS',
          exerciseId: exerciseId
        })
      }
    )
    .then(response => response.json())
    .then(json => dispatch(receiveSets(json, workoutId, exerciseId)))
  }
}

export const fetchExercises = (workoutId) => {
  return (dispatch) => {
    dispatch(requestExercises())
    return fetch('/api/exercises',
        {
          method: 'POST',
          headers: new Headers({'content-type': 'application/json'}),
          body: JSON.stringify({
            type: 'RETRIEVE_EXERCISES',
            workoutId: workoutId
          })
        }
      )
      .then(response => response.json())
      .then(json => dispatch(receiveExercises(json, workoutId)))
  }
}

export const addExercise = (workoutId, name) => {
  return (dispatch) => {
    dispatch(addExerciseRequest(name))
    return fetch('/api/addexercise',
        {
          method: 'POST',
          headers: new Headers({'content-type': 'application/json'}),
          body: JSON.stringify({
            type: 'ADD_EXERCISE',
            workoutId: workoutId,
            name: name
          })
        }
      )
      .then(response => response.json())
      .then(json => dispatch(addExerciseSuccess(json, workoutId)))
  }
}

export const addSet = (workoutId, exerciseId, weight, repetitions) => {
  return (dispatch) => {
    dispatch(addSetRequest())
    return fetch('/api/addset',
      {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          type: 'ADD_SET',
          exerciseId: exerciseId,
          weight: weight,
          repetitions: repetitions
        })
      }
    )
    .then(response => response.json())
    .then(json => dispatch(addSetSuccess(json, workoutId, exerciseId)))
  }
}

export const deleteSet = (workoutId, exerciseId, setId, setArrayIndex) => {
  return (dispatch) => {
    dispatch(deleteSetRequest())
    return fetch('/api/deleteset',
      {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          type: 'DELETE_SET',
          exerciseId: exerciseId,
          setId: setId
        })
      }
    )
    .then(response => response.json())
    .then(json => dispatch(deleteSetSuccess(json, workoutId, exerciseId, setArrayIndex)))
  }
}

export const deleteExercise = (workoutId, exerciseId, exrcIndex) => {
  return (dispatch) => {
    dispatch(deleteExerciseRequest())
    return fetch('/api/deleteexercise',
      {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify({
          type: 'DELETE_EXERCISE',
          exerciseId: exerciseId
        })
      }
    )
    .then(response => response.json())
    .then(json => dispatch(deleteExerciseSuccess(json, workoutId, exerciseId, exrcIndex)))
  }
}

const ADD_SET_REQUEST = 'ADD_SET_REQUEST';
const addSetRequest = () => {
  return {
    type: ADD_SET_REQUEST
  }
}

const ADD_SET_SUCCESS = 'ADD_SET_SUCCESS';
const addSetSuccess = (json, workoutId, exerciseId) => {
  return {
    type: ADD_SET_SUCCESS,
    workoutId: workoutId,
    exerciseId: exerciseId,
    set: {
      id: json.id,
      weight: json.weight,
      repetitions: json.repetitions
    }
  }
}

const DELETE_SET_REQUEST = 'DELETE_SET_REQUEST';
const deleteSetRequest = () => {
  return {
    type: DELETE_SET_REQUEST
  }
}

const DELETE_SET_SUCCESS = 'DELETE_SET_SUCCESS';
const deleteSetSuccess = (json, workoutId, exerciseId, setArrayIndex) => {
  return {
    type: DELETE_SET_SUCCESS,
    workoutId: workoutId,
    exerciseId: exerciseId,
    setArrayIndex: setArrayIndex
  }
}

const ADD_EXERCISE_REQUEST = 'ADD_EXERCISE_REQUEST';
const addExerciseRequest = (name, id) => {
  return {
    type: ADD_EXERCISE_REQUEST,
    id: id,
    name: name,
  }
}

const ADD_EXERCISE_SUCCESS = 'ADD_EXERCISE_SUCCESS';
const addExerciseSuccess = (json, workoutId) => {
  return {
    type: ADD_EXERCISE_SUCCESS,
    workoutId: workoutId,
    exercise: {
      id: json.id,
      name: json.name,
      exerciseSets: []
    }
  }
}

const DELETE_EXERCISE_REQUEST = 'DELETE_EXERCISE_REQUEST';
const deleteExerciseRequest = () => {
  return {
    type: DELETE_EXERCISE_REQUEST
  }
}

const DELETE_EXERCISE_SUCCESS = 'DELETE_EXERCISE_SUCCESS';
const deleteExerciseSuccess = (json, workoutId, exerciseId, exrcIndex) => {
  return {
    type: DELETE_EXERCISE_SUCCESS,
    workoutId: workoutId,
    exerciseId: exerciseId,
    exrcIndex: exrcIndex
  }
}

export const fetchWorkouts = () => {
  return (dispatch) => {
    dispatch(fetchWorkoutsRequest())
    return fetch('/api/workouts')
    .then(response => response.json())
    .then(json => dispatch(fetchWorkoutsSuccess(json)))
  }
}

const FETCH_WORKOUTS_REQUEST = 'FETCH_WORKOUTS_REQUEST';
const fetchWorkoutsRequest = () => {
  return {
    type: FETCH_WORKOUTS_REQUEST
  }
}

const FETCH_WORKOUTS_SUCCESS = 'FETCH_WORKOUTS_SUCCESS';
const fetchWorkoutsSuccess = (json) => {
  console.log("FETCH WORKOUTS SUCCESS: ", json);
  return {
    type: FETCH_WORKOUTS_SUCCESS,
    workouts: json.map((workout) => {
      return {
        id: workout.id,
        exercises: []
      }
    })
  }
}

export const addWorkout = () => {
  return (dispatch) => {
    dispatch(addWorkoutRequest())
    return fetch('/api/addworkout')
    .then(response => response.json())
    .then(json => dispatch(addWorkoutSuccess(json)))
  }
}

const ADD_WORKOUT_REQUEST = 'ADD_WORKOUT_REQUEST';
const addWorkoutRequest = () => {
    return {
      type: ADD_WORKOUT_REQUEST
    }
}

const ADD_WORKOUT_SUCCESS = 'ADD_WORKOUT_SUCCESS';
const addWorkoutSuccess = (json) => {
  return {
    type: ADD_WORKOUT_SUCCESS,
    workout: {
      id: json.id,
      exercises: []
    }
  }
}