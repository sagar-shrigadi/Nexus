export interface ActionResult {
  status: "success" | "error";
  message?: string;
}
export interface CommentAction extends ActionResult {
  errors?: {
    comment?: string[];
  };
}
export interface PostAction extends ActionResult {
  errors?: {
    title?: string[];
    content?: string[];
  };
}
export interface UploadAvatar extends ActionResult {
  url?: string;
}
