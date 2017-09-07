
import * as actions from "actions/Notifications";


const notifications = {
    messages: [],
    warnings: [],
    errors: []
};


let notificationsReducer = (state=notifications, action) => {
  switch (action.type) {
    case actions.NEW_NOTIFICATION:
      switch (action.payload.level) {
        case "danger":
          const errors = state.errors.slice();
          errors.push(action.payload.message);
          return {
            ...state,
            errors: errors
          };
        case "warning":
          const warnings = state.warnings.slice();
          warnings.push(action.payload.message);
          return {
            ...state,
            warnings: warnings
          };
        case "success":
          const messages = state.messages.slice();
          messages.push(action.payload.message);
          return {
            ...state,
            messages: messages
          };
        default:
          return state;
      }
    case actions.RM_NOTIFICATION:
      const msgs = state[action.payload.level],
            newMsgs = msgs.slice().splice(msgs[action.payload.index], 1);
      let newState = {...state};
      newState[action.payload.level] = newMsgs;
      return newState;
    default:
      return state;
  }
};
export default notificationsReducer;

