const React = require('react');
const Router = require('silo-core/client/Router');

module.exports = Router.extend({
    routes:{
        '!/doc*page': function(page) {
            this.mount(require('./Doc'), {page:page, basePath: "!/doc/"}, "Documentation "+page);
        },
    }
});
