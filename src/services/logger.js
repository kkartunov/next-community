/**
 * Generic console wrapper
 */
const logger = {
  log: function() {
    const args = Array.prototype.slice.call(arguments);
    console.log.apply(console, args);
  },
  error: function() {
    const args = Array.prototype.slice.call(arguments);
    console.error.apply(console, args);
  },
}

export default logger;
