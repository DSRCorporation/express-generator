'use strict';

const errors = require('errors'),
    constants = require('utils/config').constants,
    _ = require('lodash');

function createFilters(query, scheme) {
    return _(scheme)
        .keys()
        .intersection(_.keys(query))
        .reduce(
            (filters, key) => {
                switch (scheme[key]) {
                    case "startsWith":
                        <%_ if (locals.useMongo) {_%>
                        filters[key] = new RegExp(_.escapeRegExp(query[key]), 'i');
                        <%_}_%>
                        <%_ if (locals.usePostgres) {_%>
                        filters[key] = {$iLike: `${query[key]}%`}
                        <%_}_%>
                        <%_ if (locals.useMysql) {_%>
                        filters[key] = {$like: `${query[key]}%`}
                        <%_}_%>
                        break;
                    case "equals":
                        <%_ if (locals.useMongo) {_%>
                        filters[key] = query[key];
                        <%_}_%>
                        <%_ if (locals.useSequelize) {_%>
                        filters[key] = {$eq: query[key]}
                        <%_}_%>
                        break;
                    default:
                        throw new errors.InternalServerError('Incorrect filter operation', scheme[key]);
                }
                return filters;
            },
            {});
}

function createPaging(query) {
    return {
        skip: parseInt(query.skip) || 0,
        limit: parseInt(query.limit) || constants.query.limit
    };
}

module.exports = {
    createFilters: createFilters,
    createPaging: createPaging
};