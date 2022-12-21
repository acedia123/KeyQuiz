import { combineReducers } from 'redux';
import login from './auth/reducers';
import course from './course/reducers';
import category from './category/reducers';
import question from './question/reducers';
import rate from './rate/reducers';
import test from './test/reducers';

export default combineReducers({
    login,
    course,
    category,
    question,
    rate,
    test,
});
