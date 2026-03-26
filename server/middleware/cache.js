const Report = require('../models/Report');
const checkCache = async (req, res, next) => {
  const username = req.params.username.toLowerCase();
  try {
    const cached = await Report.findOne({
      username,
      expiresAt: { $gt: new Date() },
    });
    if (cached) {
      return res.json({ cached: true, data: cached });
    }
    next();
  } catch (err) {
    next(err);
  }
};
module.exports = { checkCache };
