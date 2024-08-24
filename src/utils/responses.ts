export function apiErrorResponse(message: string) {
  return {
    success: false,
    error: {
      message
    }
  }
}

export function apiSuccessResponse(payload?: any) {
  return {
    success: true,
    payload
  }
}
