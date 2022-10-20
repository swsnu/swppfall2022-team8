import { useNavigate } from "react-router";

interface IProps {
  key: string,
  id: number,
  title: string,
};

const BookListEntity = (props: IProps) => {
  const navigate = useNavigate();

  return (
    <div 
      key={props.key} 
      style={({ border: "1px solid black" })}
      onClick={() => navigate(`/book/${props.id}`)}
    >
      <p>{props.title}</p>
    </div>
  );
};

export default BookListEntity;