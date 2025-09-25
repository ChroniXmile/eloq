// User model with preferences
// This model represents a registered user of the website with personal dashboard settings

export interface RecentlyViewedItem {
  /**
   * Entity type (player, tournament, etc.)
   */
  entityType: string;
  
  /**
   * Entity ID
   */
  entityId: string;
  
  /**
   * Timestamp when the item was viewed
   */
  timestamp: Date;
}

export interface User {
  /**
   * Unique identifier for the user
   */
  id: string;
  
  /**
   * Unique username
   */
  username: string;
  
  /**
   * User's email address
   */
  email: string;
  
  /**
   * Display name
   */
  displayName: string;
  
  /**
   * URL to user's avatar image
   */
  avatarUrl: string;
  
  /**
   * Array of favorite player IDs
   */
  favoritePlayers: string[];
  
  /**
   * Array of recently viewed items
   */
  recentlyViewed: RecentlyViewedItem[];
  
  /**
   * User preferences for dashboard layout, notifications, etc.
   */
  preferences: {
    [key: string]: any;
  };
  
  /**
   * Account creation date
   */
  createdAt: Date;
  
  /**
   * Last login timestamp
   */
  lastLogin: Date;
}

/**
 * Create a new user instance with default values
 * @param id Unique identifier for the user
 * @param username Unique username
 * @param email User's email address
 * @returns User object with default values
 */
export function createUser(id: string, username: string, email: string): User {
  return {
    id,
    username,
    email,
    displayName: username,
    avatarUrl: '',
    favoritePlayers: [],
    recentlyViewed: [],
    preferences: {},
    createdAt: new Date(),
    lastLogin: new Date(),
  };
}

/**
 * Add a favorite player to the user
 * @param user User to add favorite player to
 * @param playerId Player ID to add
 */
export function addFavoritePlayer(user: User, playerId: string): void {
  if (!user.favoritePlayers.includes(playerId)) {
    user.favoritePlayers.push(playerId);
  }
}

/**
 * Remove a favorite player from the user
 * @param user User to remove favorite player from
 * @param playerId Player ID to remove
 */
export function removeFavoritePlayer(user: User, playerId: string): void {
  const index = user.favoritePlayers.indexOf(playerId);
  if (index !== -1) {
    user.favoritePlayers.splice(index, 1);
  }
}

/**
 * Add a recently viewed item to the user
 * @param user User to add recently viewed item to
 * @param item Recently viewed item to add
 */
export function addRecentlyViewed(user: User, item: RecentlyViewedItem): void {
  // Add to the beginning of the array
  user.recentlyViewed.unshift(item);
  
  // Keep only the last 50 items
  if (user.recentlyViewed.length > 50) {
    user.recentlyViewed = user.recentlyViewed.slice(0, 50);
  }
}

/**
 * Update user preferences
 * @param user User to update preferences for
 * @param preferences New preferences to merge
 */
export function updatePreferences(user: User, preferences: { [key: string]: any }): void {
  user.preferences = { ...user.preferences, ...preferences };
}

/**
 * Update last login timestamp
 * @param user User to update
 */
export function updateLastLogin(user: User): void {
  user.lastLogin = new Date();
}

/**
 * Validate user data
 * @param user User to validate
 * @returns Array of validation errors, empty if valid
 */
export function validateUser(user: User): string[] {
  const errors: string[] = [];
  
  if (!user.id) {
    errors.push('User ID is required');
  }
  
  if (!user.username) {
    errors.push('Username is required');
  }
  
  if (!user.email) {
    errors.push('Email is required');
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    errors.push('Email must be a valid email address');
  }
  
  if (!user.displayName) {
    errors.push('Display name is required');
  }
  
  return errors;
}