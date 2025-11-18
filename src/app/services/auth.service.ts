import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

const API_URL = environment.APIURL;

interface AuthResponse {
  status?: any;
  data?: any;
  ok?: boolean;
  integration?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginStatus = false;
  private role = '';
  private authtime = 0;
  userData: any;
  connectionTime: any;

  constructor(private http: HttpClient, private router: Router) { }

  private getToken() {
    return localStorage.getItem('token');
  }

  private getHeaders() {
    const token = this.getToken();
    return token
      ? { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token }) }
      : {};
  }

  post(ep: string, body: any) {
    return this.http.post<AuthResponse>(`${API_URL}${ep}`, body, this.getHeaders());
  }

  get(ep: string) {
    return this.http.get<AuthResponse>(`${API_URL}${ep}`, this.getHeaders());
  }

  patch(ep: string, body: any) {
    return this.http.patch<AuthResponse>(`${API_URL}${ep}`, body, this.getHeaders());
  }

  del(ep: string, body: any) {
    const options = {
      ...this.getHeaders(),
      body
    };
    return this.http.delete<AuthResponse>(`${API_URL}${ep}`, options);
  }

  /** -------------------------------
   * ✅ GITHUB OAUTH FLOW
   * ------------------------------- */

  /** Step 1: Redirect user to GitHub */
  loginWithGitHub() {
    const clientId = environment.GITHUB_CLIENT_ID;
    const redirectUri = 'http://localhost:4200/github-callback';
    const scope = 'read:org repo user';

    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scope)}`;
    window.open(url, '_self');
  }


  /** Step 2: Exchange authorization code for access token (calls your backend) */
  exchangeCode(code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}github/exchange`, { code });
  }

  /** Step 3: Check integration status */
  getIntegrationStatus(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${API_URL}github/status`);
  }

  /** Step 4: Remove integration */
  removeIntegration(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}github/remove`, {});
  }

  setLoginStatus(v: boolean) {
    this.loginStatus = v;
  }

  isLogin() {
    return this.loginStatus;
  }

  checkAuthenticationStatus(): Observable<AuthResponse> {
    return this.get('github/status');
  }

  setConnectionTime(t: any) {
    this.connectionTime = t;
  }

  getConnectionTime(){
    return this.connectionTime;
  }



}
