/**
 * Created by isaac on 9/6/15.
 */

module.exports = {

    _date: function (date) {
        if (date) {
            var month = date.getMonth();
            if (month < 10) {
                month = '0' + month;
            }
            var d = date.getDate();
            if (d < 10) {
                d = '0' + d;
            }
            return date.getFullYear() + '-' + month + '-' + d;
        } else {
            return '------';
        }
    },
    _equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    }
};