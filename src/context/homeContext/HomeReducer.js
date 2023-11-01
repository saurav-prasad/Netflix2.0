export const homeInitialState = {
    data: null
}

export const actionTypes = {
    setData: "Set_Data",
    unsetData: "UnSet_Data"
}
const HomeReducer = (state, action) => {
    // console.log(action);
    switch (action.type) {
        case actionTypes.setData:
            return {
                ...state,
                [action.key]: action.value
            }
        case actionTypes.unsetData:
            return {
                data: null
            }
        default:
            return state
    }
}
export default HomeReducer