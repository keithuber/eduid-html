
import * as actions from "actions/Notifications";
import { profileFilled, PROFILE_FILLED } from "actions/Profile";


const calculateProfileFilled = (state) => {
    let filled = {max: 0, cur: 0, pending: []};
    ['given_name', 'surname', 'display_name', 'language'].forEach( (pdata) => {
        filled.max += 1;
        if (state.personal_data.data[pdata]) {
            filled.cur += 1;
        } else {
            filled.pending.push(pdata);
        }
    });
    ['emails', 'phones', 'nins'].forEach( (tab) => {
        filled.max += 1;
        if (state[tab][tab] && state[tab][tab].length > 0) {
            filled.cur += 1;
        } else {
            filled.pending.push(tab);
        }
    });
    return filled;
};

const notifyAndDispatch = store => next => action => {
    if (action.type !== actions.NEW_NOTIFICATION && action.type !== PROFILE_FILLED) {
        if (action.error && action.payload) {
            const msg = action.payload.errorMsg || action.payload.message || 'error_in_form';
            if (msg) {
                next(actions.eduidNotify(msg, 'errors'));
            }
        } else if (action.payload && action.payload.message) {
            next(actions.eduidNotify(action.payload.message, 'messages'));
        }
        if (action.payload !== undefined) {
            delete(action.payload.message);
            delete(action.payload.errorMsg);
        }
        if (!action.error) {
            const filled = calculateProfileFilled(store.getState());
            next(profileFilled(filled.max, filled.cur, filled.pending));
        }
    }
    return next(action);
};


export default notifyAndDispatch;
