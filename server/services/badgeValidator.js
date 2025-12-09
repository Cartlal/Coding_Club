/**
 * Badge Validator Service
 * Comprehensive badge assignment and validation system
 */

const BADGE_SYSTEM = {
  '🛠️': 'Workshop Wanderer',
  '🎫': 'Event Explorer',
  '💻': 'Development Challenger',
  '🤖': 'AI/ML Challenger',
  '🔮': 'Emerging Tech Explorer',
  '⚔️': 'Compete Commander',
  '⌨️': 'Programming Prodigy',
  '🎨': 'Creative Visionary',
  '📢': 'PR Ambassador',
  '🎮': 'Game Master',
  '🔟': 'Top 10 Performer',
  '🥉': 'Top 3 Elite',
  '🏆': 'Consistency Champion',
  '👑': 'ArcStack Legendary',
};

/**
 * Badge validation rules with strict conditions
 */
const BADGE_RULES = {
  'Workshop Wanderer': {
    description: 'Attended first workshop',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      return user.eventsParticipated.some(event => {
        return event && event.category === 'Workshop';
      });
    },
  },
  'Event Explorer': {
    description: 'Attended first event',
    validate: (user) => {
      return user.stats.participation >= 1;
    },
  },
  
  // Cluster Badges - User must attend event from that specific cluster
  'Development Challenger': {
    description: 'Attended Development cluster event',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      return user.eventsParticipated.some(event => {
        return event && event.cluster && event.cluster.name && 
               event.cluster.name.toLowerCase().includes('development');
      });
    },
  },
  
  'AI/ML Challenger': {
    description: 'Attended AI/ML cluster event',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      return user.eventsParticipated.some(event => {
        if (!event || !event.cluster || !event.cluster.name) return false;
        const clusterName = event.cluster.name.toLowerCase();
        return clusterName.includes('ai') || clusterName.includes('machine learning') || 
               clusterName.includes('ml');
      });
    },
  },
  
  'Emerging Tech Explorer': {
    description: 'Attended Emerging Tech cluster event',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      return user.eventsParticipated.some(event => {
        return event && event.cluster && event.cluster.name && 
               event.cluster.name.toLowerCase().includes('emerging');
      });
    },
  },
  
  'Compete Commander': {
    description: 'Attended Competition Management cluster event',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      return user.eventsParticipated.some(event => {
        return event && event.cluster && event.cluster.name && 
               event.cluster.name.toLowerCase().includes('competition');
      });
    },
  },
  
  'Programming Prodigy': {
    description: 'Attended Programming cluster event',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      return user.eventsParticipated.some(event => {
        return event && event.cluster && event.cluster.name && 
               event.cluster.name.toLowerCase().includes('programming');
      });
    },
  },
  
  'Creative Visionary': {
    description: 'Attended Media & Design cluster event',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      return user.eventsParticipated.some(event => {
        if (!event || !event.cluster || !event.cluster.name) return false;
        const clusterName = event.cluster.name.toLowerCase();
        return clusterName.includes('media') || clusterName.includes('design');
      });
    },
  },
  
  'PR Ambassador': {
    description: 'Attended Public Relations cluster event',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      return user.eventsParticipated.some(event => {
        if (!event || !event.cluster || !event.cluster.name) return false;
        const clusterName = event.cluster.name.toLowerCase();
        return clusterName.includes('public relations') || clusterName.includes('pr');
      });
    },
  },
  
  // Performance Badges
  'Game Master': {
    description: 'Won a game-based event',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      const gameEvents = ['find the imposter', 'murder mystery', 'debugging arena', 'api hunt'];
      return user.eventsParticipated.some(event => {
        if (!event || !event.winners) return false;
        const eventTitle = (event.title || '').toLowerCase();
        const isGameEvent = gameEvents.some(game => eventTitle.includes(game));
        const userWonRank1 = event.winners.some(w => 
          w && w.user && w.user.toString() === user._id.toString() && w.rank === 1
        );
        return isGameEvent && userWonRank1;
      });
    },
  },
  
  'Top 10 Performer': {
    description: 'Ranked Top 10 in a major technical event',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      const majorEvents = ['ctf', 'hackathon', 'coding sprint', 'build challenge'];
      return user.eventsParticipated.some(event => {
        if (!event || !event.winners) return false;
        const eventTitle = (event.title || '').toLowerCase();
        const isMajorEvent = majorEvents.some(major => eventTitle.includes(major)) || 
                            event.category === 'Competition';
        const userRankedTop10 = event.winners.some(w => 
          w && w.user && w.user.toString() === user._id.toString() && w.rank && w.rank <= 10
        );
        return isMajorEvent && userRankedTop10;
      });
    },
  },
  
  'Top 3 Elite': {
    description: 'Ranked Top 3 in any major event',
    validate: (user) => {
      if (!user.eventsParticipated || user.eventsParticipated.length === 0) {
        return false;
      }
      return user.eventsParticipated.some(event => {
        if (!event || !event.winners) return false;
        return event.winners.some(w => 
          w && w.user && w.user.toString() === user._id.toString() && w.rank && w.rank <= 3
        );
      });
    },
  },
  
  // Dedication Badges
  'Consistency Champion': {
    description: 'Won 3 events',
    validate: (user) => {
      return user.stats && user.stats.wins >= 3;
    },
  },
  
  'ArcStack Legendary': {
    description: 'Won 5 events - the highest honor',
    validate: (user) => {
      return user.stats && user.stats.wins >= 5;
    },
  },
};

/**
 * Validate and auto-assign badges to a user
 * @param {Object} user - User document with populated eventsParticipated and cluster
 * @returns {Array} Array of newly earned badge emojis
 */
export const validateAndAssignBadges = async (user) => {
  try {
    if (!user) {
      throw new Error('User object is required');
    }

    const newBadges = [];
    const userId = user._id.toString();

    // Check each badge rule
    for (const [badgeName, badgeConfig] of Object.entries(BADGE_RULES)) {
      const badgeEmoji = Object.keys(BADGE_SYSTEM).find(
        (emoji) => BADGE_SYSTEM[emoji] === badgeName
      );

      if (!badgeEmoji) continue;

      // Skip if user already has this badge
      if (user.badges && user.badges.includes(badgeEmoji)) {
        continue;
      }

      // Validate the condition
      try {
        const meetsCondition = badgeConfig.validate(user);
        if (meetsCondition) {
          newBadges.push(badgeEmoji);
        }
      } catch (error) {
        console.error(`Error validating badge ${badgeName}:`, error.message);
      }
    }

    // Add new badges to user
    if (newBadges.length > 0) {
      const currentBadges = user.badges || [];
      user.badges = [...new Set([...currentBadges, ...newBadges])].slice(0, 15);
      await user.save();
    }

    return newBadges;
  } catch (error) {
    console.error('Badge validation error:', error);
    throw error;
  }
};

/**
 * Get all badges with earned status for a user
 * @param {Object} user - User document
 * @returns {Array} Array of all badges with earned status
 */
export const getAllBadgesWithStatus = (user) => {
  const allBadges = [];

  for (const [badgeName, badgeConfig] of Object.entries(BADGE_RULES)) {
    const badgeEmoji = Object.keys(BADGE_SYSTEM).find(
      (emoji) => BADGE_SYSTEM[emoji] === badgeName
    );

    const isEarned = user.badges && user.badges.includes(badgeEmoji);

    allBadges.push({
      icon: badgeEmoji,
      name: badgeName,
      description: badgeConfig.description,
      earned: isEarned,
    });
  }

  return allBadges;
};

export { BADGE_SYSTEM };
