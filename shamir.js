const fs = require("fs");

/**
 * Reads and parses JSON input from a file.
 * @param {string} filename - The JSON filename.
 * @returns {Object} Parsed JSON object.
 */
function readJSON(filename) {
  const data = fs.readFileSync(filename, "utf-8");
  return JSON.parse(data);
}

/**
 * Converts a value from a given base to decimal.
 * @param {string} value - The number in string format.
 * @param {number} base - The base of the number.
 * @returns {number} Decimal representation.
 */
function decodeValue(value, base) {
  return parseInt(value, base);
}

/**
 * Parses the input JSON to extract points (x, y) after decoding y-values.
 * @param {Object} jsonData - The parsed JSON object.
 * @returns {Array} Array of (x, y) points.
 */
function extractPoints(jsonData) {
  let points = [];
  Object.keys(jsonData).forEach((key) => {
    if (key !== "keys") {
      const x = parseInt(key); // x value (root key)
      const base = parseInt(jsonData[key].base); // Base of y value
      const y = decodeValue(jsonData[key].value, base); // Decode y
      points.push({ x, y });
    }
  });
  return points;
}

/**
 * Uses Lagrange Interpolation to find the constant term (c) of the polynomial.
 * @param {Array} points - Array of (x, y) points.
 * @param {number} k - The required number of points.
 * @returns {number} Constant term (c).
 */
function lagrangeInterpolation(points, k) {
  let c = 0; // Constant term
  for (let i = 0; i < k; i++) {
    let xi = points[i].x;
    let yi = points[i].y;
    let li = 1;

    for (let j = 0; j < k; j++) {
      if (i !== j) {
        let xj = points[j].x;
        li *= -xj / (xi - xj);
      }
    }

    c += yi * li;
  }

  return Math.round(c); // Return the rounded integer value
}

/**
 * Main function to process the input and find the secret.
 */
function findSecret(filename) {
  const jsonData = readJSON(filename);
  const { n, k } = jsonData.keys;
  const points = extractPoints(jsonData);

  if (points.length < k) {
    console.error("Not enough points to determine the polynomial.");
    return;
  }

  const secret = lagrangeInterpolation(points, k);
  console.log(`Secret for ${filename}:`, secret);
}

// Run the function for both test cases
findSecret("testcase1.json");
findSecret("testcase2.json"); // Replace with the second test case file
