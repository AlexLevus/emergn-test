import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FbCreateResponse, UserInfo, UserUpdate } from "../interfaces";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(private http: HttpClient) {}
  create(user: UserInfo): Observable<UserInfo> {
    return this.http.post(`${environment.fbDbUrl}/users.json`, user).pipe(
      map((response: FbCreateResponse) => {
        return {
          ...user,
          id: response.name
        };
      })
    );
  }

  getAll(): Observable<UserInfo[]> {
    return this.http.get(`${environment.fbDbUrl}/users.json`).pipe(
      map((response: { [key: string]: any }) => {
        return Object.keys(response).map(key => ({
          ...response[key],
          id: key
        }));
      })
    );
  }

  getById(id: string): Observable<UserInfo> {
    return this.http
      .get<UserInfo>(`${environment.fbDbUrl}/users/${id}.json`)
      .pipe(
        map((user: UserInfo) => {
          return {
            ...user,
            id
          };
        })
      );
  }

  updateUserInfo(user: UserInfo): Observable<UserInfo> {
    return this.http.patch<UserInfo>(
      `${environment.fbDbUrl}/users/${user.id}.json`,
      user
    );
  }

  updateUser(user: UserUpdate): Observable<UserUpdate> {
    return this.http.post<UserUpdate>(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.apiKey}`,
      user
    );
  }
}
