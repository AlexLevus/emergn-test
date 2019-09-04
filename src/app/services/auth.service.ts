import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { FbAuthResponse, User } from "../interfaces";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
  public error$: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient) {}

  get token(): string {
    const expDate = new Date(localStorage.getItem("fb-token-exp"));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem("fb-token");
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        user
      )
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  logout() {
    this.setToken(null);
  }

  registr(user: User) {
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
        user
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;
    switch (message) {
      case "INVALID_EMAIL":
        this.error$.next("Invalid email");
        break;
      case "INVALID_PASSWORD":
        this.error$.next("Invalid password");
        break;
      case "EMAIL_NOT_FOUND":
        this.error$.next("Email not found");
        break;
      case "EMAIL_EXISTS":
        this.error$.next("Email already exists");
    }
    return throwError(error);
  }

  setToken(response: FbAuthResponse | null) {
    if (response) {
      if (!response.expiresIn) {
        const expDate = localStorage.getItem("fb-token-exp");
        localStorage.setItem("fb-token", response.idToken);
        localStorage.setItem("fb-token-exp", expDate.toString());
      } else {
        const expDate = new Date(
          new Date().getTime() + +response.expiresIn * 1000
        );
        localStorage.setItem("user-email", response.email);
        localStorage.setItem("fb-token", response.idToken);
        localStorage.setItem("fb-token-exp", expDate.toString());
      }
    } else {
      localStorage.clear();
    }
  }
}
