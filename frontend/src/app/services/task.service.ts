import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://13.53.203.69:5522/api/tasks';
  // private apiUrl = 'http://192.168.1.34:5522/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(page: number = 1, status?: string, sortBy?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString());
    
    if (status) {
      params = params.set('status', status);
    }
    
    if (sortBy) {
      params = params.set('sort_by', sortBy);
    }

    return this.http.get(this.apiUrl, { params });
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}/`, task);
  }

  // deleteTask(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  // }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/`); 
  }
}