module.exports = function convertPlugin(option, dayjsClass, dayjsFactory) {
  dayjsFactory.convert = (amount, from, to) => {
    const now = dayjsFactory();
    return now.add(amount, from).diff(now, to);
  };
};