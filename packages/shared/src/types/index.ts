export type Role = "ADMIN" | "EDITOR" | "WRITER" | "READER";
export type PostStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type NotificationType =
  | "POST_APPROVED"
  | "POST_REJECTED"
  | "NEW_COMMENT"
  | "COMMENT_REPLY"
  | "NEW_FOLLOWER"
  | "POST_FEATURED";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
