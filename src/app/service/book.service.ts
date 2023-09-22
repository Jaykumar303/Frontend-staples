import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseURL = 'http://localhost:8081/books';
  private apiURL = 'http://localhost:8080/books';

  constructor(private http: HttpClient) { }

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.baseURL);
  }

  getBookById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/${id}`);
  }

  addBook(book: any): Observable<any> {
    return this.http.post(this.baseURL, book);
  }

  updateBook(id: number, book: any): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}`, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`);
  }
}
