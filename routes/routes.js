const express = require('express');
const auth_controller = require('../controllers/auth_controller');
const router  = express.Router();

router.get('/oauth2/v1/authorize', auth_controller.getPassportRes);
router.post('/v2/authentications', auth_controller.getChallenges);
router.get('/v1/client-config', auth_controller.getClientConfig);
router.get('/v1/client-config/dictionary', auth_controller.getDictionary);
router.post('/v2/authentications/*', auth_controller.postChallenges);
router.post('/v1/session', auth_controller.postSession);
router.get('/', (req, res) => {
    res.send('SWM Mock server is running!');
})

module.exports = router;
