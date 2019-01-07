/**
 * Created by isaac on 9/2/15.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CreditRecord = require('../models/CreditRecord');
var User = mongoose.model('User');
var CreditConfig = require('../../config/credit');
var Event = require('../../config/event');
var Moment = require('moment');

var operators = {};

var _createRecord = function (amount, context, user_id, event, operation, date, callback) {
    amount = +amount;
    //create credit record
    var record = new CreditRecord();
    record.amount = amount;
    record.refer_id = context.id;
    record.user = user_id;
    record.operation = operation;
    record.create_time = date;
    record.event_type = event;
    record.save();

    console.log('[credit]:[create-record]:', amount, context, user_id, operation, date);

    if (operation == CreditConfig.operation.plus) {
        User.update({_id: ObjectId(user_id)}, {$inc: {credit: amount}}).exec();
    } else {
        User.update({_id: ObjectId(user_id)}, {$inc: {credit: -amount}}).exec();
    }

    if (callback) {
        callback(null, record);
    }
};

operators[Event.add_weight] = function (user_id, event, context) {
    var date = new Date();
    var firstDate = Moment(date).startOf('month').toDate();
    var lastDate = Moment(date).endOf('month').toDate();

    CreditRecord.count({create_time: {$gte: firstDate, $lt: lastDate}},
        function (err, count) {
            var amount = CreditConfig.amount.weightRecordValue;
            var creditInMonth = count * amount;
            var sum = creditInMonth + amount;
            var callback = context.callback;

            if (sum > CreditConfig.amount.maxWeightRecordPerMonthValue) {

                console.log('[credit]:[add-weight]:', err, count, context);

                if (callback) {
                    callback('Max weight record credit limited!', null);
                }
            } else {
                _createRecord(amount, context, user_id, event,
                    CreditConfig.operation.plus, date, callback);
            }
        });
};

operators[Event.add_cloth] = function (user_id, event, context) {

    console.log('[credit]:[pre-add-cloth]:', user_id, context);

    var date = new Date();
    var firstDate = Moment(date).startOf('month').toDate();
    var lastDate = Moment(date).endOf('month').toDate();

    CreditRecord.count({create_time: {$gte: firstDate, $lt: lastDate}},
        function (err, count) {
            var amount = CreditConfig.amount.clothRecordValue;
            var creditInMonth = count * amount;
            var sum = creditInMonth + amount;
            var callback = context.callback;

            if (sum > CreditConfig.amount.maxClothRecordPerMonthValue) {

                console.log('[credit]:[add-cloth]:', err, count, context);

                if (callback) {
                    callback('Max cloth record credit limited!', null);
                }
            } else {
                _createRecord(amount, context, user_id, event,
                    CreditConfig.operation.plus, date, callback);
            }
        });
};

operators[Event.register] = function (user_id, event, context) {
    var date = new Date();
    _createRecord(CreditConfig.amount.userRegisterValue, context, user_id, Event.register, CreditConfig.operation.plus, date, context.callback);
};


module.exports = function (user_id, event, context) {

    var operator = operators[event];

    if (operator) {
        operator(user_id, event, context);
    }
};