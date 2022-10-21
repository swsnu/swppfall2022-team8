import { useNavigate, useParams } from "react-router";
import BookListEntity from "../../components/BookListEntity/BookListEntity";
import SearchBar from "../../components/SearchBar/SearchBar";

const testSearchResult = [
  { id: 1, title: "kanokari" },
  { id: 2, title: "bluerock" },
];

const BookListPage = () => {
  const { key } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <button 
        type="button"
        onClick={() => navigate("/main")}
      >LOGO</button>
      <button 
        type="button"
        onClick={() => navigate("/book/register")}
      >+</button>
      <button 
        type="button"
        onClick={() => navigate("/chatting")}
      >chat</button>
      <br/>
      <SearchBar initContent={key ?? ""} />
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
};

export default BookListPage;