export const SOCKET_EVENTS = {
  COMMENT_NEW: "comment:new",
  COMMENT_DELETED: "comment:deleted",
  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",
  USER_TYPING: "user:typing",
  USER_JOINED: "user:joined",
  USER_LEFT: "user:left",
} as const;

export const CACHE_TTL = {
  POST: 60 * 5,
  POST_LIST: 60 * 2,
  TAG: 60 * 60,
  USER: 60 * 10,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
