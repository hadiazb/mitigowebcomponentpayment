export interface ApiError {
  success: boolean;
  body: any;
  status: Array<{
    code: string;
    description: string;
    userMessage: string;
  }>;
}
