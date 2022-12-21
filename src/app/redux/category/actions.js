import { createActions } from 'redux-actions';

export const getType = (reduxAction) => {
    return reduxAction().type;
};

export const getCategories = createActions({
    getCategoriesRequest: (payload) => payload,
    getCategoriesSuccess: (payload) => payload,
    getCategoriesFailure: (err) => err,
});

export const addCategory = createActions({
    getAddCategoryRequest: (payload) => payload,
    getAddCategorySuccess: (payload) => payload,
    getAddCategoryFailure: (err) => err,
});
