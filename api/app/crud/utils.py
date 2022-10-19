from sqlalchemy import desc, asc
from ..models.movie import Movie


def get_order_by_clause(field, direction):
    """ Returns the order by clause depending on the direction """
    if direction == 'asc':
        return asc(get_movie_field(field))
    if direction == 'desc':
        return desc(get_movie_field(field))


# It is not possible to get the field via Model[field]
def get_movie_field(field):
    if field == 'likes_count':
        return Movie.likes_count
    if field == 'hates_count':
        return Movie.hates_count
    if field == 'created_at':
        return Movie.created_at
