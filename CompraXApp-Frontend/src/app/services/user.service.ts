import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserProfileResponse, UserUpdateRequest } from '../models/user.models';
import { ERole } from '../models/role.models';

const API_URL = 'http://localhost:8080/api/users/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient) { }

  getUserProfile(id: number): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${API_URL}${id}`);
  }

  updateUser(id: number, updateRequest: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${API_URL}${id}`, updateRequest);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${API_URL}${id}`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_URL);
  }

  updateUserRoles(id: number, roles: ERole[]): Observable<any> {
    return this.http.put(`${API_URL}${id}/roles`, roles);
  }
}