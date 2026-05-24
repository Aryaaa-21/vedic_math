const User = require("../models/User");

// @desc    Get leaderboard rankings
// @route   GET /api/leaderboard
// @access  Public (Optional Authentication)
const getLeaderboard = async (req, res) => {
  try {
    // Fetch top 20 users by XP
    const topUsers = await User.find()
      .sort({ xp: -1 })
      .limit(20)
      .select("name avatar xp accuracy streak");

    let formattedTopUsers = topUsers.map((user, index) => ({
      id: user._id,
      rank: index + 1,
      name: user.name,
      avatar: user.avatar,
      xp: user.xp,
      accuracy: user.accuracy,
      streak: user.streak,
    }));

    let currentUserRankInfo = null;

    let userXp = null;
    let userId = null;
    let userName = null;
    let userAccuracy = 0;
    let userStreak = 0;
    let userAvatar = "";

    // Try finding user via query params
    if (req.query.userId) {
      const user = await User.findById(req.query.userId);
      if (user) {
        userXp = user.xp;
        userId = user._id;
        userName = user.name;
        userAccuracy = user.accuracy;
        userStreak = user.streak;
        userAvatar = user.avatar;
      }
    } else if (req.query.guestXp) {
      userXp = parseInt(req.query.guestXp) || 0;
      userName = req.query.guestName || "Guest Mathlete";
      userAccuracy = parseInt(req.query.guestAccuracy) || 0;
      userStreak = parseInt(req.query.guestStreak) || 0;
      userAvatar = req.query.guestAvatar || "";
    }

    if (userXp !== null) {
      const higherCount = await User.countDocuments({ xp: { $gt: userXp } });
      const rank = higherCount + 1;

      currentUserRankInfo = {
        rank,
        name: userName,
        xp: userXp,
        accuracy: userAccuracy,
        streak: userStreak,
        avatar: userAvatar,
        isCurrentUser: true,
        id: userId
      };
    }

    res.json({
      top20: formattedTopUsers,
      currentUserRank: currentUserRankInfo
    });
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ message: "Server error fetching leaderboard" });
  }
};

module.exports = { getLeaderboard };
