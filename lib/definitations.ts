export interface ActionResult {
  status: "success" | "error";
  message?: string;
}
export interface CommentAction extends ActionResult {
  errors?: {
    comment?: string[];
    file?: string[];
  };
}
export interface PostAction extends ActionResult {
  errors?: {
    title?: string[];
    content?: string[];
    file?: string[];
  };
}
export interface UploadAvatar extends ActionResult {
  errors?: {
    file?: string[];
  };
  url?: string;
}
export interface DeleteAvatar extends ActionResult {
  errors?: {
    file?: string[];
  };
}
export interface UserBio extends ActionResult {
  errors?: {
    bio?: string[];
  };
}
