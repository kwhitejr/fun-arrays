var dataset = require('./dataset.json');

// Copy Balances
var bankBalances = dataset.bankBalances.map(function (balance) {
  return  {
    amount: balance.amount,
    state: balance.state
  };
});

/*
  create an array with accounts from bankBalances that are
  greater than 100000.00
  assign the resulting array to `hundredThousandairs`
*/

function getBigAccounts(element, index, array) {
  if (element.amount > 100000) {
    return element;
  }
}

var hundredThousandairs = dataset.bankBalances.filter(getBigAccounts);

/*
  set a new key for each object in bankBalances named `rounded`
  the value of this key will be the `amount` rounded to the nearest dollar
  example
    {
      "amount": "134758.44",
      "state": "HI",
      "rounded": 134758
    }
  assign the resulting array to `roundedDollar`
*/

function roundTheseBitches(element, index, array) {
  var roundedAmount = Math.round(element.amount);
  // return a new object with the correct properties
  return {
    amount: dataset.bankBalances.amount,
    state: dataset.bankBalances.state,
    rounded: roundedAmount
  };
}

var roundedDollar = dataset.bankBalances.map(roundTheseBitches);

/*
  set a the `amount` value for each object in bankBalances
  to the value of `amount` rounded to the nearest 10 cents
  example
    {
      "amount": 134758.4,
      "state": "HI"
    }
  assign the resulting array to `roundedDime`
*/

function myRounder(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function dimeBag(element, index, array) {
  var dimeAmount = myRounder(element.amount, 1);
  return {
    amount: dimeAmount,
    state: dataset.bankBalances.state,
  };
}

var roundedDime = dataset.bankBalances.map(dimeBag);

// set sumOfBankBalances to the sum of all amounts in bankBalances

function sumTotal(previous, current, index, array) {
  var sum = { // need to turn sum into an object because parse float is called upon 'previous.amount', implying that it is an object, not a mere value.
    amount: myRounder(parseFloat(previous.amount), 2) + myRounder(parseFloat(current.amount), 2)
  };
  return sum;
}

var sumOfBankBalances = dataset.bankBalances.reduce(sumTotal).amount;

/*
  set sumOfInterests to the sum of the 18.9% interest
  for all amounts in bankBalances
  in each of the following states
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  the result should be rounded to the nearest cent
 */

function interestCalculator(element, index, array) {
  var interest = myRounder(element.amount * 0.189, 2);
  // return a new object with the correct properties
  return interest;
}

function add(x, y) {
  return x + y;
}

function stateSelector(element, index, array) {
  var states = ['WI', 'IL', 'WY', 'OH', 'GA', 'DE'];
  if (states.indexOf(element.state) > -1) {
    return element;
  }
}

var states = dataset.bankBalances // original data
              .filter(stateSelector); // filter for certain states

var result = states // array of filtered states
              .map(interestCalculator) // new array of interest calculations
              .reduce(add); // sum of interest calculations

var sumOfInterests = myRounder(result, 2); // round to two decimal places

/*
  set sumOfHighInterests to the sum of the 18.9% interest
  for all amounts in bankBalances
  where the amount of the sum of interests in that state is
    greater than 50,000
  in every state except
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  the result should be rounded to the nearest cent

  1. filter out states
  2. find interest for each account
  3. find sum of interest for each remaining state
  4. if sum is greater than 50,000
 */

function stateSelectorInvert(element, index, array) {
  var states = ['WI', 'IL', 'WY', 'OH', 'GA', 'DE'];
  if (!(states.indexOf(element.state) > -1)) {
    return element;
  }
}

var states2 = dataset.bankBalances // original data
              .filter(stateSelectorInvert); // filter for certain states

// var forLoopsforLove = function(array) {
//   var newObj = {};
//   for (var i=0; i<array.length; i++) {
//     var thisState = array[i].state;
//     var thisAmount = parseFloat(array[i].amount) * 0.189;
//     if (!(newObj.hasOwnProperty(thisState))) {
//       newObj[thisState] = thisAmount;
//     } else {
//       newObj[thisState] += thisAmount;
//     }
//   }
//   return newObj;
// };

var loopsForLove = function(newObj, arrayEye) {
  var thisState = arrayEye.state;
  var thisAmount = parseFloat(arrayEye.amount) * 0.189;
  if (!(newObj.hasOwnProperty(thisState))) {
    newObj[thisState] = thisAmount;
  } else {
    newObj[thisState] += thisAmount;
  }
  return newObj;
};

var stateInterestObj = states2.reduce(loopsForLove, {} );

console.log(stateInterestObj);

var highInterestSum = 0;

for (var key in stateInterestObj) {
  if (stateInterestObj[key] > 50000) {
    highInterestSum += myRounder(stateInterestObj[key], 2);
  }
}
console.log(highInterestSum);

var sumOfHighInterests = myRounder(highInterestSum, 2);

/*
  aggregate the sum of bankBalance amounts
  grouped by state
  set stateSums to be a hash table
    where the key is the two letter state abbreviation
    and the value is the sum of all amounts from that state
      the value must be rounded to the nearest cent
 */

var myLoopsForLove = function(newObj, arrayEye) {
  var thisState = arrayEye.state;
  var thisAmount = parseFloat(arrayEye.amount);
  if (!(newObj.hasOwnProperty(thisState))) {
    newObj[thisState] = myRounder(thisAmount, 2);
  } else {
    var roundSum = myRounder(newObj[thisState], 2) + myRounder(thisAmount, 2);
    newObj[thisState] = myRounder(roundSum, 2);
  }
  return newObj;
};

var stateSums = dataset.bankBalances.reduce(myLoopsForLove, {});

/*
  set lowerSumStates to an array containing
  only the two letter state abbreviation of each state
  where the sum of amounts in the state is
    less than 1,000,000
 */

function lowSum(obj) {
  lowSumArray = [];
  for (var k in obj) {
    if (obj[k] < 1000000) {
      lowSumArray.push(k);
    }
  }
  return lowSumArray;
}

console.log(lowSum(stateSums));

var lowerSumStates = lowSum(stateSums);

/*
  set higherStateSums to be the sum of
    all amounts of every state
    where the sum of amounts in the state is
      greater than 1,000,000
 */
function highSum(obj) {
  highSumArray = [];
  for (var k in obj) {
    if (obj[k] > 1000000) {
      highSumArray.push(obj[k]);
    }
  }
  return highSumArray;
}

console.log(highSum(stateSums));

var higherStateSums = highSum(stateSums).reduce(add);

/*
  set areStatesInHigherStateSum to be true if
    all of these states have a sum of account values
      greater than 2,550,000
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  false otherwise
 */



var areStatesInHigherStateSum = null;

/*
  set anyStatesInHigherStateSum to be true if
    any of these states have a sum of account values
      greater than 2,550,000
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  false otherwise
 */
var anyStatesInHigherStateSum = null;


module.exports = {
  hundredThousandairs : hundredThousandairs,
  roundedDollar : roundedDollar,
  roundedDime : roundedDime,
  sumOfBankBalances : sumOfBankBalances,
  sumOfInterests : sumOfInterests,
  sumOfHighInterests : sumOfHighInterests,
  stateSums : stateSums,
  lowerSumStates : lowerSumStates,
  higherStateSums : higherStateSums,
  areStatesInHigherStateSum : areStatesInHigherStateSum,
  anyStatesInHigherStateSum : anyStatesInHigherStateSum
};