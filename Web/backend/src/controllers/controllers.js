const getHelloWorld = (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
};

const getGoodbyeWorld = (req, res) => {
  res.status(200).json({ message: 'Goodbye, World!' });
};

module.exports = {
  getHelloWorld,
  getGoodbyeWorld,
};