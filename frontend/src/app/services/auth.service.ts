import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://13.53.203.69:5522/api';
  // private apiUrl = 'http://192.168.1.34:5522/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,private router: Router) {
    this.isAuthenticatedSubject.next(!!localStorage.getItem('token'),);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/token/`, { username, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, { username, email, password }).pipe(
      tap((response: any) => {
        console.log('User registered successfully', response);
      })
    );
}

  canActivate(): boolean {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
