import { UserProfile, Progress, Lesson } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'edulink_user_profile',
  PROGRESS: 'edulink_progress',
  STREAK: 'edulink_streak',
  USERS: 'edulink_registered_users',
  CURRENT_USER_ID: 'edulink_current_user_id',
};

export interface UserAuth {
  id: string;
  email: string;
  password?: string;
  displayName: string;
}

export const storageService = {
  getUsers: (): UserAuth[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    return stored ? JSON.parse(stored) : [];
  },

  register: (user: Omit<UserAuth, 'id'>) => {
    const users = storageService.getUsers();
    if (users.find(u => u.email === user.email)) {
      throw new Error('Email đã tồn tại!');
    }
    const newUser = { ...user, id: Math.random().toString(36).substr(2, 9) };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  login: (email: string, password?: string) => {
    const users = storageService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác!');
    }
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    
    // Initialize profile if not exists for this user
    const profileKey = `${STORAGE_KEYS.USER_PROFILE}_${user.id}`;
    if (!localStorage.getItem(profileKey)) {
      const newProfile: UserProfile = {
        uid: user.id,
        displayName: user.displayName,
        email: user.email,
        level: 'Beginner',
        goal: 'IELTS',
        targetScore: '6.5',
        dailyGoalMinutes: 30,
        streak: 0,
        totalLessonsCompleted: 0,
        points: 0,
      };
      localStorage.setItem(profileKey, JSON.stringify(newProfile));
    }
    
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  },

  getCurrentUserId: () => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  },

  getUserProfile: (): UserProfile | null => {
    const userId = storageService.getCurrentUserId();
    if (!userId) return null;
    const profileKey = `${STORAGE_KEYS.USER_PROFILE}_${userId}`;
    const stored = localStorage.getItem(profileKey);
    return stored ? JSON.parse(stored) : null;
  },

  updateUserProfile: (profile: Partial<UserProfile>) => {
    const userId = storageService.getCurrentUserId();
    if (!userId) return null;
    const profileKey = `${STORAGE_KEYS.USER_PROFILE}_${userId}`;
    const current = storageService.getUserProfile();
    if (!current) return null;
    const updated = { ...current, ...profile };
    localStorage.setItem(profileKey, JSON.stringify(updated));
    return updated;
  },

  getProgress: (): Progress[] => {
    const userId = storageService.getCurrentUserId();
    if (!userId) return [];
    const progressKey = `${STORAGE_KEYS.PROGRESS}_${userId}`;
    const stored = localStorage.getItem(progressKey);
    return stored ? JSON.parse(stored) : [];
  },

  saveProgress: (lessonId: string, score?: number) => {
    const userId = storageService.getCurrentUserId();
    if (!userId) return [];
    const progressKey = `${STORAGE_KEYS.PROGRESS}_${userId}`;
    const progress = storageService.getProgress();
    const existingIndex = progress.findIndex(p => p.lessonId === lessonId);
    
    const newEntry: Progress = {
      lessonId,
      userId,
      completed: true,
      score,
      completedAt: new Date().toISOString(),
    };

    if (existingIndex > -1) {
      progress[existingIndex] = newEntry;
    } else {
      progress.push(newEntry);
      const profile = storageService.getUserProfile();
      if (profile) {
        storageService.updateUserProfile({
          totalLessonsCompleted: profile.totalLessonsCompleted + 1,
          points: profile.points + (score ? score * 10 : 50),
        });
      }
    }

    localStorage.setItem(progressKey, JSON.stringify(progress));
    return progress;
  },

  checkStreak: () => {
    const profile = storageService.getUserProfile();
    if (!profile) return 0;
    const today = new Date().toDateString();
    const lastStudy = profile.lastStudyDate ? new Date(profile.lastStudyDate).toDateString() : null;

    if (lastStudy === today) return profile.streak;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (lastStudy === yesterdayStr) {
      const newStreak = profile.streak + 1;
      storageService.updateUserProfile({ streak: newStreak, lastStudyDate: new Date().toISOString() });
      return newStreak;
    } else {
      storageService.updateUserProfile({ streak: 1, lastStudyDate: new Date().toISOString() });
      return 1;
    }
  }
};
