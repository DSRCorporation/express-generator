'use strict';

module.exports = (express) => {
    express.getAsync = function(url, fn) {
        this.get(url, (req, res, next) => fn(req, res).catch(next));
    }

    return express;
};
