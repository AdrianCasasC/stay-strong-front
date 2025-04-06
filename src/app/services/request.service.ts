import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService<T> {
  constructor(
    protected http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {}

  protected getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}`, { withCredentials: true });
  }

  protected getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  protected create(data: T, url: string = ''): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${url}`, data, {
      withCredentials: true,
    });
  }

  protected update(id: number | string, data: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, data, {
      withCredentials: true,
    });
  }

  protected delete(id: number | string, url: string = ''): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${url}/${id}`, {
      withCredentials: true,
    });
  }
}
