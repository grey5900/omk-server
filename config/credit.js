/**
 * Created by isaac on 9/2/15.
 */
var operations ={
    'plus' : '+',
    'minus' : '-'
};

var amounts = {
    maxPerMonth : 30,
    weightRecordValue: 1,
    weightFullDutyValue: 2,
    maxWeightRecordPerMonthValue: 15,

    clothRecordValue: 0.5,
    maxClothRecordPerMonthValue: 10,

    monthFullDutyValue: 10,
    affiliateValue: 5,

    userRegisterValue: 5
};

module.exports = {
    scale : 1,

    operation: operations,
    amount: amounts
};