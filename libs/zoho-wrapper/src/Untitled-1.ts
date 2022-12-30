// Log
console.log(true && (false || true || false));

let isMultiDayFlight = true;
let isLeavingHomebase = true;
let lastFlightIsHomebase = true;
let isPosisted = false;
let isSameDay = false;
let hasRegistration = false;

const resetVars = () => {
  isMultiDayFlight = true;
  isLeavingHomebase = true;
  isPosisted = false;
  isSameDay = false;
  hasRegistration = false;
  lastFlightIsHomebase = true;
};

/* TRUE MEANS FAIL */
const notEligeble = () => {
  const notEligble = isLeavingHomebase && isMultiDayFlight && lastFlightIsHomebase && (isSameDay || !hasRegistration);

  return notEligble && !isPosisted;
};

/* Should return false (Flight is postioned doesn't cancel)  */
isSameDay = true;
hasRegistration = false;
isPosisted = true;
console.log(notEligeble());

resetVars();

/* Should return true (flight isn't positioned) */
isPosisted = false;
console.log(notEligeble());

resetVars();

isSameDay = true;
/* Should return true (Is same day flight no postioning) */
console.log(notEligeble());

resetVars();

isSameDay = true;
isPosisted = true;
/* Should return false (Is same day flight but was positoned) */
console.log(notEligeble());

resetVars();

isSameDay = true;
hasRegistration = true;
/* Should return true (same day & registion & no positioning) */
console.log(notEligeble());

resetVars();

lastFlightIsHomebase = true;
isSameDay = false;
/* Should return true (last flight is homebsae && same day) */
console.log(notEligeble());

resetVars();

isLeavingHomebase = true
lastFlightIsHomebase = true
isSameDay = false
hasRegistration = false
/* Should return true (last flight is homebsae && same day) */
console.log(notEligeble());

resetVars();

isLeavingHomebase = true;
lastFlightIsHomebase = false;
isPosisted = true;
isSameDay = true
hasRegistration = false;

/* Should return true (last flight is homebsae && same day) */
console.log(notEligeble());
