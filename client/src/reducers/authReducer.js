import { FETCH_USER } from "../actions/types";

export default function(state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      // Returns false if payload is an empty string
      return action.payload || false;
    default:
      return state;
  }
}
