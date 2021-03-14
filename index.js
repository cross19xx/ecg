const { differenceInDays } = require('date-fns');

const FIRST_300_UNIT_PRICE = 0.4229;
const SECOND_300_UNIT_PRICE = 0.5489;
const ABOVE_600 = 0.6098;
const SERVICE_CHARGE = 0.1308;

const FIRST_SUBSIDY = -0.0347;
const SECOND_SUBSIDY = -0.045;
const FINAL_SUBSIDY = -0.05;

const GOVERNMENT_LEVY = 0.0002;
const STREET_LIGHT = 0.0001;

/**
 * Split consumptions into an array of numbers for billing
 * TODO: Customize to ensure dynamic billing
 * @param {number} consumption
 * @returns {number[]}
 */
function splitUnits(consumption) {
  /** @type {number[]} */
  const output = [];

  // First 300
  output.push(consumption < 300 ? consumption : 300);
  consumption = Math.max(consumption - 300, 0);

  // Next 300
  output.push(consumption < 300 ? consumption : 300);
  consumption = Math.max(consumption - 300, 0);

  output.push(consumption);

  return output;
}

/**
 * Calculate the bill of a particular consumer
 * @param {number} consumption The number of units (kWh)
 * @param {string} startDate Format is Month-Date-Year
 * @param {string} endDate
 */
function calculateBill(consumption, startDate, endDate) {
  const days = differenceInDays(new Date(endDate), new Date(startDate));

  const cSplit = splitUnits(consumption);

  const output = [];

  // Energy consumptions
  output.push({
    item: 'Energy first 300',
    units: `${cSplit[0]} kWh`,
    price: FIRST_300_UNIT_PRICE,
    amount: cSplit[0] * FIRST_300_UNIT_PRICE,
  });
  output.push({
    item: 'Energy next 300',
    units: `${cSplit[1]} kWh`,
    price: SECOND_300_UNIT_PRICE,
    amount: cSplit[1] * SECOND_300_UNIT_PRICE,
  });
  output.push({
    item: 'Energy above 600',
    units: `${cSplit[2]} kWh`,
    price: ABOVE_600,
    amount: cSplit[2] * ABOVE_600,
  });

  // Service Charges
  output.push({
    item: 'Energy above 600',
    units: `${days} day(s)`,
    price: SERVICE_CHARGE,
    amount: days * SERVICE_CHARGE,
  });

  // Subsidies
  output.push({
    item: 'Subsidy 3 first 300',
    units: `${cSplit[0]} kWh`,
    price: FIRST_SUBSIDY,
    amount: cSplit[0] * FIRST_SUBSIDY,
  });
  output.push({
    item: 'Subsidy 3 next 300',
    units: `${cSplit[1]} kWh`,
    price: SECOND_SUBSIDY,
    amount: cSplit[1] * SECOND_SUBSIDY,
  });
  output.push({
    item: 'Subsidy 3 above 600',
    units: `${cSplit[2]} kWh`,
    price: FINAL_SUBSIDY,
    amount: cSplit[2] * FINAL_SUBSIDY,
  });

  // Government Levy
  output.push({
    item: 'Government Levy',
    units: `${consumption} kWh`,
    price: GOVERNMENT_LEVY,
    amount: consumption * GOVERNMENT_LEVY,
  });

  // Street Light
  output.push({
    item: 'Street Light',
    units: `${consumption} kWh`,
    price: STREET_LIGHT,
    amount: consumption * STREET_LIGHT,
  });

  // Total
  const totalAmout = output.reduce((acc, curr) => {
    return acc + curr.amount;
  }, 0);

  return { breakdown: output, total: totalAmout };
}

console.log(calculateBill(207, '06-08-2015', '07-09-2015'));
