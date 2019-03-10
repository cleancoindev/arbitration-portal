import { put, takeEvery } from 'redux-saga/effect';
import { ActionTypes }    from 'const';

import * as api     from 'utils/api-client';
import * as actions from './actions';

export function* fetchClaims() {

    let claims = yield api.getClaims();
    yield put(actions.setClaims(claims));

}

export default function* usersSaga() {

    yield takeEvery(ActionTypes.FETCH_CLAIMS, fetchClaims);

}