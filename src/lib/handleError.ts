export function parseErrorMessage(error: unknown, defaultMessage = 'Đã có lỗi xảy ra, vui lòng thử lại sau'): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const err = error as Record<string, unknown>;
    // Ưu tiên type error từ backend nếu message mặc định
    if (err.errorType && typeof err.errorType === 'string' && (!err.message || err.message === 'Có lỗi xảy ra, vui lòng thử lại.')) {
      switch (err.errorType) {
        case 'VALIDATION_ERROR': return 'Dữ liệu không hợp lệ.';
        case 'UNAUTHORIZED': return 'Phiên đăng nhập hết hạn.';
        case 'FORBIDDEN': return 'Bạn không có quyền thực hiện thao tác này.';
        case 'PAYLOAD_TOO_LARGE': return 'Dữ liệu tải lên quá lớn.';
        case 'INTERNAL_ERROR': return 'Lỗi hệ thống từ máy chủ.';
        default: return err.errorType;
      }
    }
    return String(err.message || defaultMessage);
  }
  return defaultMessage;
}

export function getFieldErrors(error: unknown): Record<string, string> | null {
  if (error && typeof error === 'object' && 'fieldErrors' in error) {
    const fields = (error as any).fieldErrors;
    if (fields && typeof fields === 'object') {
      return fields as Record<string, string>;
    }
  }
  return null;
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return error.message === 'Failed to fetch' || error.message === 'Network request failed';
  }
  return false;
}
