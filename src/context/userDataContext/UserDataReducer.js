export const userDataInitialState = {
    user: null
}
export const actionTypes = {
    setUser: 'Set_User',
    unsetUser: 'UnSet_User'
}

const UserDataReducer = (state, action) => {
    // console.log(state);
    console.log(action);
    switch (action.type) {
        case actionTypes.setUser:
            return {
                ...state,
                user: action.user,
                wishList: action.wishList,
                history: action.history
            }
        case actionTypes.unsetUser: return { user: null }
        default: return state
    }
}
export default UserDataReducer