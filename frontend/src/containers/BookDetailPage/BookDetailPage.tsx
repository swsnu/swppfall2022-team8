import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { AppDispatch } from "../../store";
import { fetchLend, selectLend } from "../../store/slices/lend/lend";
import "./BookDetailPage.css";

const testBookDetail = {
  id: 1,
  title: "kanokari",
  owner: "mizuhara",
  status: "borrowed",
  cost: 3000,
  info: "\"Until now, I've always had a five star rating! Give me back my five star rating right now, got it!?\"",
  tags: ["light_novel", "love_comedy"],
  questions: ["You should give me a five star rating."]
}

const BookDetailPage = () => {
  const [infoVisible, setInfoVisible] = useState<boolean>(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const lendState = useSelector(selectLend);

  useEffect(() => {
    dispatch(fetchLend(Number(id)))
  },[]);

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
      <br/><br/>
      <div className="image-test"><p>image</p></div>
      {/* <p>Owner: {testBookDetail.owner}</p>
      <p>Book title: {testBookDetail.title}</p>
      <p>Status: {testBookDetail.status}</p>
      <p>Borrowing cost: {testBookDetail.cost}</p> */}
      <p>Owner: {lendState.selectedLend!.owner}</p>
      <p>Book title: {lendState.selectedLend!.book_info.title}</p>
      <p>Status: {lendState.selectedLend!.status?.toString?.()}</p>
      <p>Borrowing cost: {lendState.selectedLend!.cost}</p>
      <br/>
      <button
        type="button"
        onClick={() => setInfoVisible(!infoVisible)}
      >Info</button>
      <br/>
      <div className="info-box" hidden={!infoVisible}>
        {lendState.selectedLend!.book_info.brief}
      </div>
      <button
        type="button"
        onClick={() => navigate(`/book/${id}/request`)}
      >Request</button>
      <button type="button">Watch</button>
      <br/>
      <button 
        type="button"
        onClick={() => navigate(`/book/${id}/edit`)}
      >Edit</button>
    </>
  );
}

export default BookDetailPage