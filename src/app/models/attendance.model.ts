export interface AttendanceRequest {
  studentId: number;
  groupId: number;
  latitude: number;
  longitude: number;
}

export interface AttendanceResponse {
  id?: number;
  studentName?: string;
  groupName?: string;
  attendanceDate?: string;
  checkInTime?: string;
  latitude?: number;
  longitude?: number;
  distanceMeters?: number;
  status?: 'PRESENT' | 'ABSENT' | 'LOCATION_MISMATCH';
  message?: string;
}

export interface AttendanceStatus {
  hasJoinedGroup: boolean;
  groupId?: number;
  groupName?: string;
  companyName?: string;
  todayAttendance?: AttendanceResponse;
}