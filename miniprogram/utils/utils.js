import Promise from 'bluebird';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function promiseHandle(func, options) {
  options = options || {};
  return new Promise((resolve, reject) => {
    if (typeof func !== 'function')
      reject();
    options.success = resolve;
    options.fail = reject;
    func(options);
  });
}

module.exports = {
  promiseHandle: promiseHandle,
  formatTime: formatTime
}
