import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const appId = environment.app_id;
const apiUrl = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getApplication(): Observable<any> {
    return this.http.get(apiUrl, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getPages(): Observable<any> {
    const url = `${apiUrl}/application/${appId}/page`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getPage(id: String): Observable<any> {
    const url = `${apiUrl}/page/${id}?include=cardtitle,cardparagraph,cardimage,cardbutton`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getImage(id: String): Observable<any> {
    const url = `${apiUrl}/file/${id}`;
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }
}
