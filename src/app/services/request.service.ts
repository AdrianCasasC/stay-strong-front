import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(
    protected http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {}

  protected getAll<T>(params?: Record<string, any>): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}`, {
      withCredentials: true,
      params,
    });
  }

  protected get<T>(url?: string, params?: Record<string, any>): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${url ? url : ''}`, {
      withCredentials: true,
      params,
    });
  }

  protected getById<T>(id: string, url?: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${url ? url : ''}/${id}`, {
      withCredentials: true,
    });
  }

  protected create<T>(url: string = '', data: T): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${url}`, data, {
      withCredentials: true,
    });
  }

  protected update<T>(
    url: string = '',
    id: number | string,
    data: Partial<T>
  ): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${url ? url : ''}/${id}`, data, {
      withCredentials: true,
    });
  }

  protected delete(id: number | string, url: string = ''): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${url}/${id}`, {
      withCredentials: true,
    });
  }
}
