/**
 * Generic console wrapper
 */
const logger = {
  log: function() {
    const args = Array.prototype.slice.call(arguments);
    if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENV !== 'production') {
      console.log.apply(console, args);
    }
  },
  error: function() {
    const args = Array.prototype.slice.call(arguments);
    if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENV !== 'production') {
      console.error.apply(console, args);
    }
  },
}

export default logger;
