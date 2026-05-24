const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      accuracy: user.accuracy,
      avgSpeed: user.avgSpeed,
      completedLessons: user.completedLessons,
      challengeHighScore: user.challengeHighScore,
      profileImage: user.profileImage,
      avatar: user.avatar,
      completedTechniques: user.completedTechniques,
      challengeHistory: user.challengeHistory,
      joinedDate: user.joinedDate,
      badges: user.badges,
      recentActivities: user.recentActivities
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }
    if (req.body.profileImage !== undefined) {
      user.profileImage = req.body.profileImage;
    }
    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      level: updatedUser.level,
      xp: updatedUser.xp,
      streak: updatedUser.streak,
      accuracy: updatedUser.accuracy,
      avgSpeed: updatedUser.avgSpeed,
      completedLessons: updatedUser.completedLessons,
      challengeHighScore: updatedUser.challengeHighScore,
      profileImage: updatedUser.profileImage,
      avatar: updatedUser.avatar,
      completedTechniques: updatedUser.completedTechniques,
      challengeHistory: updatedUser.challengeHistory,
      joinedDate: updatedUser.joinedDate,
      badges: updatedUser.badges,
      recentActivities: updatedUser.recentActivities
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc    Sync user stats/state from Zustand store
// @route   POST /api/user/sync
// @access  Private
const syncUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Sync incoming properties if provided
      const fields = [
        "name", "level", "xp", "streak", "accuracy",
        "avgSpeed", "completedLessons", "challengeHighScore",
        "badges", "recentActivities", "avatar", "profileImage",
        "completedTechniques", "challengeHistory"
      ];

      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });

      const updatedUser = await user.save();
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        level: updatedUser.level,
        xp: updatedUser.xp,
        streak: updatedUser.streak,
        accuracy: updatedUser.accuracy,
        avgSpeed: updatedUser.avgSpeed,
        completedLessons: updatedUser.completedLessons,
        challengeHighScore: updatedUser.challengeHighScore,
        profileImage: updatedUser.profileImage,
        avatar: updatedUser.avatar,
        completedTechniques: updatedUser.completedTechniques,
        challengeHistory: updatedUser.challengeHistory,
        joinedDate: updatedUser.joinedDate,
        badges: updatedUser.badges,
        recentActivities: updatedUser.recentActivities
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Sync error:", error);
    res.status(500).json({ message: "Server error during state sync" });
  }
};

module.exports = { getUserProfile, updateUserProfile, syncUserProfile };
