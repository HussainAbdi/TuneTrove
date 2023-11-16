/**
 * Higher order function for async/await error handling
 * @param {function} fn an async function
 * @returns {function}
 */
export const catchErrors = fn => {
  return function(...args) {
    return fn(...args).catch((err) => {
      console.error(err);
    })
  }
}

/**
 * Formats milliseconds to time duration (minutes:seconds)
 * @param {number} ms the number of milliseconds
 * @returns {string} time duration string
 */
export const formatDuration = (ms) => {
  const minutes = Math.floor(ms/60000);
  const seconds = Math.floor((ms%60000)/1000);
  return `${minutes}:${seconds < 10 ? '0': ''}${seconds}`;
}

/**
 * Returns correct backend URI depending on production mode
 * @returns {string}
 */
export const BACKEND_URI = () => {
  return process.env.NODE_ENV !== 'production' 
    ? 'http://localhost:8888' 
    : 'https://tunetrove-59ee9ee71485.herokuapp.com/'
}