import { getCategories, getType } from '../category/actions';

const initialState = {
    categories: null,
    loading: false,
};

const CategoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(getCategories.getCategoriesRequest): {
            return { ...state, loading: true };
        }
        case getType(getCategories.getCategoriesSuccess): {
            return { ...state, categories: action.payload, loading: false, error: null };
        }
        case getType(getCategories.getCategoriesFailure): {
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        }
        // case getType(addCategory.getAddCourseRequest): {
        //     return { ...state, loading: true };
        // }
        // case getType(addCategory.getAddCourseSuccess): {
        //     return { ...state, loading: false, error: null };
        // }
        // case getType(addCategory.getAddCourseFailure): {
        //     return {
        //         ...state,
        //         error: action.payload,
        //         loading: false,
        //     };
        // }
        default:
            return { ...state };
    }
};

export default CategoryReducer;
