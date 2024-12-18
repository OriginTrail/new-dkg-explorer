const dkgService = require('../services/dkgService.js');

exports.get = async (req, res) => {
    try {
        const asset = await dkgService.getAssetByUal(req.query.ual);
        res.status(200).json(asset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
