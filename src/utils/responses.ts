export function apiErrorResponse(message: string) {
  return {
    message
  }
}

export function apiSuccessResponse(payload?: any) {
  return payload;
}
