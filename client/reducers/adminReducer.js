import initialState from '../initialState';
import * as types from '../actions/actionTypes';

export default function admin(state = initialState.admin, action) {
  switch (action.type) {

    case types.ADMIN_SELECT_TURN:
      return { ...state, turn: action.turn };

    case types.LOAD_TURN_MEMBERS_SUCCESS:
      return {
        ...state,
        turnMembers: [
          ...action.users
        ]
      };

    default:
      return state;
  }
}
