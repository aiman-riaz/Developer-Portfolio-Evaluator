const Report = require('../models/Report');
const { computeReport } = require('../services/scoringService');
const getProfile = async (req, res, next) => {
  const username = req.params.username.toLowerCase();
  try {
    const report = await computeReport(username);
    await Report.findOneAndUpdate({ username }, report, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
    res.json({ cached: false, data: report });
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};
const getCachedProfile = async (req, res, next) => {
  const username = req.params.username.toLowerCase();
  try {
    const cached = await Report.findOne({
      username,
      expiresAt: { $gt: new Date() },
    });
    if (!cached) {
      return res.status(404).json({ error: 'No fresh cached report found.' });
    }
    res.json({ cached: true, data: cached });
  } catch (err) {
    next(err);
  }
};
const compareProfiles = async (req, res, next) => {
  const { u1, u2 } = req.query;
  if (!u1 || !u2) {
    return res.status(400).json({ error: 'Both u1 and u2 query params are required.' });
  }
  try {
    const [report1, report2] = await Promise.all([
      computeReport(u1.toLowerCase()),
      computeReport(u2.toLowerCase()),
    ]);
    res.json({ data: [report1, report2] });
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
};
module.exports = { getProfile, getCachedProfile, compareProfiles };
