import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../service/book.service';
import { MatDialog } from '@angular/material/dialog';
import { BookFormComponent } from '../book-form/book-form.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BookDetailsModalComponent } from '../book-details-modal/book-details-modal.component';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  books: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatSort, {static: true}) sort!: MatSort;


  displayedColumns: string[] = ['title', 'author', 'year', 'actions'];
  searchTerm: string = '';

  constructor(private bookService: BookService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  // fetchBooks() {
  //   this.bookService.getBooks().subscribe(
  //     data => {
  //       if (this.searchTerm) {
  //         data = data.filter(book => 
  //           book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
  //           book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
  //         );
  //       }
  //       this.books = new MatTableDataSource(data);
  //       this.books.sort = this.sort;
  //     },
  //     error => {
  //       console.error('Error fetching books:', error);
  //     }
  //   );
  // }

  // fetchBooks(): void {
  //   this.bookService.getBooks().subscribe(
  //     data => {
  //       this.books = new MatTableDataSource(data);
  //       this.books.sort = this.sort;
  //     },
  //     error => {
  //       console.error('Error fetching books:', error);
  //     }
  //   );
  // }
  
  fetchBooks(): void {
    this.bookService.getBooks().subscribe(
      data => {
        if (this.searchTerm) {
          data = data.filter(book => 
            book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
            book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        }
        this.books = new MatTableDataSource(data);
        this.books.sort = this.sort;
      },
      error => {
        console.error('Error fetching books:', error);
      }
    );
  }
  

  addBook() {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookService.addBook(result).subscribe(
          response => {
            this.fetchBooks(); // Refresh the list after adding
          },
          error => {
            console.error('Error adding book:', error);
          }
        );
      }
    });
  }

  editBook(book: any) {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '400px',
      data: book
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookService.updateBook(book.id, result).subscribe(
          response => {
            this.fetchBooks(); // Refresh the list after updating
          },
          error => {
            console.error('Error updating book:', error);
          }
        );
      }
    });
  }

  openEditBookDialog(bookToEdit: any): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '450px',
      data: { book: bookToEdit }  // Passing the book data to the form component
    });
  
    dialogRef.componentInstance.formSubmit.subscribe((updatedBookData) => {
      this.bookService.updateBook(bookToEdit.id, updatedBookData).subscribe(
        response => {
          this.fetchBooks();
        },
        error => {
          console.error('Error updating book:', error);
        }
      );
    });
  }

  deleteBook(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        message: 'Are you sure you want to delete this book?'
      }
    });

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.bookService.deleteBook(id).subscribe(
          response => {
            this.fetchBooks(); // Refresh the list after deleting
          },
          error => {
            console.error('Error deleting book:', error);
          }
        );
      }
    });
  }

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '450px'
    });
  
    dialogRef.componentInstance.formSubmit.subscribe((newBookData) => {
      this.bookService.addBook(newBookData).subscribe(
        response => {
          this.fetchBooks();
        },
        error => {
          console.error('Error adding book:', error);
        }
      );
    });
  }
  

  openDeleteConfirmation(bookId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.bookService.deleteBook(bookId).subscribe(
          response => {
            this.fetchBooks();
          },
          error => {
            console.error('Error deleting book:', error);
          }
        );
      }
    });
  }

  openBookDetails(bookId: number): void {
    console.log(`Fetching details for book with ID: ${bookId}`);
    this.bookService.getBookById(bookId).subscribe(
      bookData => {
        console.log('Received book details:', bookData);
        this.dialog.open(BookDetailsModalComponent, {
          width: '400px',
          data: { book: bookData }
        });
      },
      error => {
        console.error('Error fetching book details:', error);
      }
    );
  }
  

}
