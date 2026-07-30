export interface ActionResult {
  status: "success" | "error";
  errors?: {
    comment?: string[];
  };
  message?: string;
}
