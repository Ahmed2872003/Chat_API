const notFound = (req, res) => {
  res.status(404).json({ msg: "Not found" });
};

module.exports = notFound;
