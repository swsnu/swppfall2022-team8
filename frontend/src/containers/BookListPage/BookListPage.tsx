import { useParams } from "react-router";
import BookListEntity from "../../components/BookListEntity/BookListEntity";


const BookListPage = () => {
  const testSearchResult = [
    { id: 1, title: "kanokari" },
    { id: 2, title: "bluerock" },
  ];

  const { key } = useParams();

  return (
    <>
      <p>Search Result about "{key}"</p>
      {testSearchResult.map(book => (
        <BookListEntity 
          key={`booklist_${book.id}`}
          id={book.id}
          title={book.title}
        />
      ))}
    </>
  );
}

export default BookListPage