from celery import shared_task

from bookVillage.celery import app
from book.models.book import BookTagConcat
from django.contrib.auth.models import User
from django.core.cache import cache

from heapq import nlargest


@app.task
def add(x, y):
    return x + y


@shared_task
def recommend_with_tags(subscribed_tags, user_id):
    import pandas as pd
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import linear_kernel

    book_tag_concat = pd.DataFrame(list(BookTagConcat.objects.all().values()))

    book_tag_concat = book_tag_concat.append(
        {"book_id": 0, "tag_concat": " ".join(subscribed_tags)}, ignore_index=True
    )
    idx = len(book_tag_concat.index) - 1

    tf = TfidfVectorizer(
        analyzer="word", ngram_range=(1, 2), min_df=0, stop_words="english"
    )

    tfidf_matrix = tf.fit_transform(book_tag_concat["tag_concat"])
    cosine_similarity = linear_kernel(tfidf_matrix[idx], tfidf_matrix)

    scores = list(enumerate(cosine_similarity[0]))
    scores = list(map(lambda x: (x[1], x[0]), scores))
    scores = nlargest(13, scores)[1:13]
    indices = [i[1] for i in scores]
    result = book_tag_concat.iloc[indices]["book_id"]
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
