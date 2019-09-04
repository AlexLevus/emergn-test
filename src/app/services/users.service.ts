import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { FbCreateResponse, UserInfo, UserUpdate } from "../interfaces";
import { environment } from "../../environments/environment";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  public error$: Subject<string> = new Subject<string>();
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
    localStorage.setItem("user-email", user.email);
    return this.http
      .post<UserUpdate>(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${environment.apiKey}`,
        user
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;
    switch (message) {
      case "EMAIL_EXISTS":
        this.error$.next("Email already exists");
    }
    return throwError(error);
  }
}
