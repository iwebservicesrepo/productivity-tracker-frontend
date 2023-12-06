import { combineReducers } from 'redux';
import settings from './settings';
import galleryReducers from './galleryReducer';
import userReducer from './userReducer';
import loginReducers from './loginReducer';
import adminReducers from './dashboardRedux';
export default combineReducers({
    settings,
    galleryReducers,
    userReducer,
    loginReducers,
    adminReducers
});
