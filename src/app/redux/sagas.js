import { all } from 'redux-saga/effects';
import authSaga from './auth/saga';
import categorySaga from './category/saga';
import courseSaga from './course/saga';
import rateSage from './rate/saga';
import testSaga from './test/saga';
export default function* rootSaga(getState) {
    yield all([authSaga(), courseSaga(), categorySaga(), rateSage(), testSaga()]);
}
