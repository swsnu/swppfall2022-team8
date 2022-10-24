import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import BookListEntity from "../../components/BookListEntity/BookListEntity";
import SearchBar from "../../components/SearchBar/SearchBar";
import { AppDispatch } from "../../store";
import { fetchQueryLends, selectLend } from "../../store/slices/lend/lend";


const BookListPage = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const lendState = useSelector(selectLend);

  useEffect(() => {
    dispatch(fetchQueryLends({ title: key }));
  }, [key, dispatch]);

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
        onClick={() => navigate("/chat")}
      >chat</button>
      <br/>
      <SearchBar initContent={key ?? ""} />
      <p>Search Result about "{key}"</p>
      {lendState.lends.map(lend => (
        <div key={`lendlist_${lend.id}`}>
          <BookListEntity 
            id={lend.id}
            title={lend.book_info.title}
          />
        </div>
      ))}
    </>
  );
};

export default BookListPage;