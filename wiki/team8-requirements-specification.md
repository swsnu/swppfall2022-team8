# Service Name : “BookVillage”

## Project Requirements and Specification

### 13/10/2022, Rev. 1.0 - initial version

### Abstract

 Nowadays, we can borrow many books from a library. However, there are some books that we cannot rent from a library such as recently released books or comic books. Also, there are some books which we really want to read, but are too expensive to buy.
 These problems can be solved by “BookVillage”. This service provides members a platform to share their books. Once after we read a book, that book is mostly stuck in the corner of a bookshelf. But someone might need that book immediately. “BookVillage” connects these two users and makes a win-win situation for all.

### Purpose

The purpose of this service is to stimulate the culture of lending books and provide a platform for it.

### Customer

Customers of our service are every individual who wants to lend or borrow a book. They can use our service when there is no book which they want to borrow in the local library or it is too expensive to buy. After we finish the book, we don’t read it anymore and keep it on the bookshelf. We can supply our service to those who want to make use of books which have been on the bookshelf for a long time.

### Competitive Landscape

1. Competitivity against libraries. 
The type of books are limited in local libraries. For example, we can not easily find comic books, textbooks or magazines in libraries. Moreover, the book which I wanted to read is likely to have been borrowed already by someone. Such books which are produced personally not officially would be impossible to borrow in libraries. 

2. Recommendation System for Users.
When we buy a book in online bookstores, such as YES24 or Aladin, they recommend other books which people who bought it bought together. It is a recommendation system based on the book. However, our service focuses on users. We recommend books based on tags which users prefer, users don’t have to select or buy specific books to receive a recommendation. Unlike existing online bookstores, we can provide a better experience even if the user doesn’t know what he wants to read. 

### User Story

Feature : Book register

Actors: A user who wants to register a book
Precondition: The user is signed up and signed in.

Trigger: The user clicks the ‘register’ button in main page (scenario 1), or clicks the ‘register’ button in the book list page (scenario 2).

Scenario:

(Scenario 1) 

The user is sent to the ‘book register’ page, where the user has to fill in book information.

The user writes book information and selects tags of the book and uploads an image of the book.

User clicks the ‘submit’ button. This will navigate the user to the ‘book detail’ page.


(Scenario 2)

Same as scenario 1.

Exceptions:
The input must not be empty.

Acceptance Test:

(Scenario 1)

After triggered, the user is in /book/register.

The content will be filled in by the user.

Upon clicking ‘submit’ button, the user is redirected to /books/:book_id/

(Scenario 2)

Everything is the same with scenario 1.
 
Feature :  & search & borrow & watch

Actors: A user who wants to borrow a book

Precondition: The user is signed up and signed in.

Trigger: The user is on the main page, writes a book title to search and clicks the ‘search’ button.

Scenario:

(Scenario 1)

The user is sent to the ‘book list’ page, which lists up books of the searched title.

The user clicks the book and is redirected to the ‘book detail’ page which shows the book information.

User clicks the ‘request’ button. This will navigate the user to the ‘request’ page.

(Scenario 2)

The user is sent to the ‘book list’ page, which lists up books of the searched title.

The user clicks the book, and is redirected to the ‘book detail’ page which shows book information.

If the book status is ‘borrowed’, the ‘request’ button becomes disabled and the user clicks the 'watch’ button. 

When the other one returns the book, the book status becomes ‘available’ and the user can receive an alarm for the book.

Exceptions:

If someone borrows the book while the other one is writing in the ‘request’ page, after clicking the ‘send’ button, the other one must receive the alert ‘It is already borrowed!’.

Acceptance Test:

(Scenario 1)

After triggered, the user is in /book.

After the user clicks the book, the user is in /book/detail.

Upon clicking ‘borrow’ button, the user is redirected to /chat/:chat_id

(Scenario 2)

After triggered, the user is in /book.

After the user clicks the book, the user is in /book/detail.

Upon clicking ‘reserve’ button, the book is added to reservation_list of the book and reservation_list of user
 
 
Feature :  Chatting

Actors: User who wants to borrow a book and user who is lending the book.
Precondition: The users are signed up and signed in.

Trigger:  borrower clicked ‘borrow’ button in book detail page and redirected to ‘chat’ page.

(Scenario 1)

The borrower sends a message, and the message is displayed on the lender's screen.

The lender sends a message, and the message is displayed on the borrower’s screen.

Exceptions: None.

Acceptance Test:

(Scenario 1)

After being triggered, the user is in /chat/:chat_id.

After users send a message, a speech bubble is displayed on each users’ screen.
 
Feature :  ML recommendation

Actors: A user who wants to get book recommendations.

Precondition: The user is signed up and signed in.

Trigger:  On the main page, recommended books are displayed automatically.

Scenario:

(Scenario 1) .

The user is on the main page, and recommended books are displayed automatically under the search engine.

The user clicks the book, and is redirected to the ‘book detail’ page which shows book information.

Exceptions:

User’s ‘preference tag’ should always exist.

Acceptance Test:

(Scenario 1)

After being triggered, the user is in /main.

After the user clicks a book, the user is navigated to /book/:book_id.

### User Interface Requirements
![KakaoTalk_20221013_160330467](https://user-images.githubusercontent.com/107753635/195527927-f5cf6237-d5e0-411d-b943-3b7f1369e8d7.png)
