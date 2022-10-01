const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getUserMe,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);
router.get('/:userId', getUserById);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
