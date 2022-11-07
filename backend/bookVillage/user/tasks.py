from bookVillage.celery import app
import requests


@app.task
def add(x, y):
    return x + y


@app.task
def recommend_with_tags(subscribed_tags, user_id):
    import pandas as pd
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import linear_kernel

    response = requests.put(
        "http://localhost:8000/api/book/all/", json={"internal_password": "41q2c8578"}
    )
    data = response.json()
    book_tags = pd.DataFrame(data.get("book_tags"))
    tags = pd.DataFrame(data.get("tags"))
    books = pd.DataFrame(data.get("books"))

    book_tags_df = pd.merge(
        book_tags, tags, left_on="tag_id", right_on="id", how="inner"
    )[["book_id", "name"]]
    book_tags_df = book_tags_df.groupby("book_id")["name"].apply(" ".join).reset_index()
    books = books.loc[:, books.columns != "brief"]
    books = pd.merge(books, book_tags_df, left_on="id", right_on="book_id", how="inner")

    books = books.append(
        {"id": 0, "name": " ".join(subscribed_tags)}, ignore_index=True
    )

    tf = TfidfVectorizer(
        analyzer="word", ngram_range=(1, 2), min_df=0, stop_words="english"
    )
    tfidf_matrix = tf.fit_transform(books["name"])
    cosine_similarity = linear_kernel(tfidf_matrix, tfidf_matrix)

    idx = len(books.index) - 1
    scores = list(enumerate(cosine_similarity[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)
    scores = scores[1:11]  # return 10 books
    indices = [i[0] for i in scores]
    result = books.iloc[indices]["id"]
    data = {
        "user_id": user_id,
        "internal_password": "41q2c8578",
        "book_ids": result.values.tolist(),
    }
    print(data)
    response = requests.post("http://localhost:8000/api/user/recommend/", json=data)

    return response.status_code
