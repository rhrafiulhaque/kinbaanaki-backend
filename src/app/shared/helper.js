const pick = (obj, keys) => {
    const finalObj = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObj[key] = obj[key];
        }
    }
    return finalObj;
}

const paginationFields = ['page', 'limit', 'sortBy', 'sortOrder']

const calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit);
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc'
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

module.exports = {
    pick,
    paginationFields,
    calculatePagination
}