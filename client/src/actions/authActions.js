import axios from "axios";
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from "./types";
import { returnErrors } from "./errorActions";

// Check token and load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING });

    // Fetch user
    axios
        .get("/api/auth/user", tokenConfig(getState))
        .then(res =>
            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        )
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
};

// Setup confin/headers and token
export const tokenConfig = getState => {
    // Get token from localStorage
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    // If token present then add to headers
    if (token) {
        config.headers["x-auth-token"] = token;
    }

    return config;
};
