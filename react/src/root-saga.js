
import { takeLatest, takeEvery } from 'redux-saga';
import { put, select } from "redux-saga/effects";
import * as configActions from "actions/Config";
import * as pdataActions from "actions/PersonalData";
import * as emailActions from "actions/Emails";
import * as mobileActions from "actions/Mobile"
import * as openidActions from "actions/OpenidConnect";
import * as securityActions from "actions/Security";
import * as pwActions from "actions/ChangePassword";
import * as ninActions from "actions/Nins";
import * as openidFrejaActions from "actions/OpenidConnectFreja";
import * as letterActions from "actions/LetterProofing";
import * as lmpActions from "actions/LookupMobileProofing";
import * as headerActions from "actions/Header";

import { requestAllPersonalData, savePersonalData } from "sagas/PersonalData";
import { saveEmail, requestResendEmailCode,
         requestVerifyEmail, requestRemoveEmail,
         requestMakePrimaryEmail } from "sagas/Emails";
import * as sagasMobile from "sagas/Mobile";
import * as sagasOpenidFreja from "sagas/OpenidConnectFreja";
import { requestConfig } from "sagas/Config";
import { requestOpenidQRcode } from "sagas/OpenidConnect";
import { requestCredentials, requestPasswordChange, postDeleteAccount } from "sagas/Security";
import { requestSuggestedPassword, postPasswordChange } from "sagas/ChangePassword";
import { requestNins, requestRemoveNin } from "sagas/Nins";
import { requestOpenidFrejaData } from "sagas/OpenidConnectFreja";
import { sendLetterProofing, sendLetterCode } from "sagas/LetterProofing";
import { requestLogout } from "sagas/Header";
import { requestLookupMobileProof } from "sagas/LookupMobileProofing";


function* configSpaSaga () {
    const state = yield select(state => state);
    if (state.config.is_spa) {
        yield put(configActions.getInitialUserdata());
    }
}


function* rootSaga() {
  yield [
    takeLatest(configActions.GET_JSCONFIG_CONFIG, requestConfig),
    takeLatest(configActions.GET_JSCONFIG_CONFIG_SUCCESS, configSpaSaga),
    takeLatest(configActions.GET_INITIAL_USERDATA, requestAllPersonalData),
    takeLatest(configActions.GET_INITIAL_USERDATA, requestCredentials),
    takeLatest(configActions.GET_INITIAL_USERDATA, requestSuggestedPassword),
    takeLatest(pdataActions.POST_USERDATA, savePersonalData),
    takeLatest(openidActions.POST_OIDC_PROOFING_PROOFING, requestOpenidQRcode),
    takeLatest(lmpActions.POST_LOOKUP_MOBILE_PROOFING_PROOFING, requestLookupMobileProof),
    takeLatest(openidFrejaActions.POST_OIDC_PROOFING_FREJA_PROOFING, sagasOpenidFreja.initializeOpenidFrejaData),
    takeLatest(openidFrejaActions.GET_OIDC_PROOFING_FREJA_PROOFING, sagasOpenidFreja.requestOpenidFrejaData),
    takeLatest(openidFrejaActions.SHOW_OIDC_FREJA_MODAL, sagasOpenidFreja.checkNINAndShowFrejaModal),
    takeLatest(openidFrejaActions.HIDE_OIDC_FREJA_MODAL, sagasOpenidFreja.closeFrejaModal),
    takeLatest(emailActions.POST_EMAIL, saveEmail),
    takeLatest(emailActions.START_RESEND_EMAIL_CODE, requestResendEmailCode),
    takeLatest(emailActions.START_VERIFY, requestVerifyEmail),
    takeLatest(emailActions.POST_EMAIL_REMOVE, requestRemoveEmail),
    takeLatest(emailActions.POST_EMAIL_PRIMARY, requestMakePrimaryEmail),
    takeLatest(mobileActions.POST_MOBILE, sagasMobile.saveMobile),
    takeLatest(mobileActions.POST_MOBILE_REMOVE, sagasMobile.requestRemoveMobile),
    takeLatest(mobileActions.POST_MOBILE_PRIMARY, sagasMobile.requestMakePrimaryMobile),
    takeLatest(mobileActions.START_RESEND_MOBILE_CODE, sagasMobile.requestResendMobileCode),
    takeLatest(mobileActions.START_VERIFY, sagasMobile.requestVerifyMobile),
    takeLatest(securityActions.GET_CHANGE_PASSWORD, requestPasswordChange),
    takeLatest(pwActions.POST_PASSWORD_CHANGE, postPasswordChange),
    takeLatest(securityActions.POST_DELETE_ACCOUNT, postDeleteAccount),
    takeLatest(letterActions.POST_LETTER_PROOFING_CODE, sendLetterProofing),
    takeLatest(letterActions.POST_LETTER_PROOFING_PROOFING, sendLetterCode),
    takeLatest(ninActions.POST_NIN_REMOVE, requestRemoveNin),
    takeEvery(letterActions.STOP_LETTER_PROOFING, requestNins),
    takeEvery(ninActions.POST_NIN_REMOVE_SUCCESS, requestNins),
    takeEvery(letterActions.POST_LETTER_PROOFING_CODE_SUCCESS, requestNins),
    takeEvery(headerActions.POST_LOGOUT, requestLogout),
  ];
}

export default rootSaga;