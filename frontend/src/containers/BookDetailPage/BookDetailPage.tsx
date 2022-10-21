import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./BookDetailPage.css";

const testBookDetail = {
  id: 1,
  title: "kanokari",
  owner: "mizuhara",
  status: "borrowed",
  cost: 3000,
  reserved: true,
  info: "\"Until now, I've always had a five star rating! Give me back my five star rating right now, got it!?\"",
  tags: ["light_novel", "love_comedy"],
  questions: ["You should give me a five star rating."]
}

const BookDetailPage = () => {
  const [infoVisible, setInfoVisible] = useState<boolean>(false);

  const { id } = useParams();
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
      <br/><br/>
      <div className="image-test"><p>image</p></div>
      <p>Owner: {testBookDetail.owner}</p>
      <p>Book title: {testBookDetail.title}</p>
      <p>Status: {testBookDetail.status}</p>
      <p>Borrowing cost: {testBookDetail.cost}</p>
      {testBookDetail.reserved ? (
        <>
          <span className="reserved-icon">
            reserved!
          </span>
          <br/>
        </>
      ) : null}
      <br/>
      <button
        type="button"
        onClick={() => setInfoVisible(!infoVisible)}
      >Info</button>
      <br/>
      <div className="info-box" hidden={!infoVisible}>
        {testBookDetail.info}
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