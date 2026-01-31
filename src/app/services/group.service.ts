import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Group, GroupMember, GroupInvitation } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createGroup(group: Group, leaderId: number): Observable<Group> {
    console.log('Creating group:', group, 'Leader ID:', leaderId);
    console.log('API URL:', `${this.apiUrl}/api/groups/create/${leaderId}`);
    return this.http.post<Group>(`${this.apiUrl}/api/groups/create/${leaderId}`, group);
  }

  addMemberToGroup(groupId: number, studentId: number, memberData: GroupMember): Observable<GroupMember> {
    return this.http.post<GroupMember>(`${this.apiUrl}/api/groups/${groupId}/members/${studentId}`, memberData);
  }

  getGroupsByLeader(leaderId: number): Observable<Group[]> {
    console.log('API call: getGroupsByLeader for ID:', leaderId);
    return this.http.get<Group[]>(`${this.apiUrl}/api/groups/leader/${leaderId}`);
  }

  getGroupMembers(groupId: number): Observable<GroupMember[]> {
    return this.http.get<GroupMember[]>(`${this.apiUrl}/api/groups/${groupId}/members`);
  }

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/api/groups`);
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/api/groups/${id}`);
  }

  updateGroupStatus(groupId: number, status: string): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/api/groups/${groupId}/status?status=${status}`, {});
  }
  
  updateGroup(groupId: number, group: Group): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/api/groups/${groupId}`, group);
  }
  
  inviteStudent(groupId: number, email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/api/groups/${groupId}/invite?email=${email}`, {}, { responseType: 'text' });
  }
  
  acceptInvitation(token: string, memberData: GroupMember): Observable<GroupMember> {
    return this.http.post<GroupMember>(`${this.apiUrl}/api/groups/join/${token}`, memberData);
  }
  
  getInvitations(email: string): Observable<GroupInvitation[]> {
    return this.http.get<GroupInvitation[]>(`${this.apiUrl}/api/group-invitations/pending/${email}`);
  }

  getInvitationCount(email: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/api/group-invitations/count/${email}`);
  }

  getUserGroup(userId: number): Observable<Group | null> {
    return this.http.get<Group>(`${this.apiUrl}/api/groups/user/${userId}`);
  }

  sendInvitation(invitationData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/group-invitations/send`, invitationData);
  }

  getGroupInvitations(groupId: number): Observable<GroupInvitation[]> {
    return this.http.get<GroupInvitation[]>(`${this.apiUrl}/api/group-invitations/group/${groupId}`);
  }

  joinCompany(groupId: number, companyId: number): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/api/groups/${groupId}/join-company/${companyId}`, {});
  }
}