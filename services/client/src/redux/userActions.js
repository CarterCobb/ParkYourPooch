export const ACTIONS = {
  SET_USER: "SET_USER",
};

/**
 * Set the user
 * @param {Object} user the new user
 */
export const setUser = (user) => ({ type: ACTIONS.SET_USER, payload: user });
