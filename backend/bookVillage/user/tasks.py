from celery import shared_task

from bookVillage.celery import app
from book.models.book import Book, BookTag, Tag
from django.contrib.auth.models import User


@app.task
def add(x, y):
    return x + y


@shared_task
def recommend_with_tags(subscribed_tags, user_id):
    import pandas as pd
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import linear_kernel

    book_tags = pd.DataFrame(list(BookTag.objects.all().values()))
    tags = pd.DataFrame(list(Tag.objects.all().values("id", "name")))
    books = pd.DataFrame(list(Book.objects.all().values("id")))

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
    scores = scores[1:10]  # return 9 books
    indices = [i[0] for i in scores]
    result = books.iloc[indices]["id"]
    book_ids = result.values.tolist()
    print(book_ids)
    user = User.objects.get(id=user_id)

    if book_ids:
        recommend = user.recommend
        recommend.update(book_ids)
        return 200
    else:
        recommend = user.recommend
        recommend.dequeue()
        return 400
