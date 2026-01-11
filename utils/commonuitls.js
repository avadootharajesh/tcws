// commonutils.js

// feed to string
function feedToString(openSeparator, closeSeparator, inString, outString, replace) {
  const replacedString = outString.replace(
    openSeparator + inString + closeSeparator,
    replace
  );
  return replacedString;
}

// exports
module.exports = { feedToString };
