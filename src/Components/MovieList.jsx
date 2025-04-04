import './MovieList.css';
import { Alert, Spin } from 'antd';
import { format } from 'date-fns';
import { Rate } from 'antd';
import { useGenres } from './Genres.jsx';
import { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import React from 'react';
import { Pagination } from 'antd';

export default function MovieList({ movieList, loading, error, isClicked, guestSessionId }) {
  MovieList.defaultProps = {
    movieList: [],
    loading: null,
    error: null,
    isClicked: null,
    guestSessionId: null,
  };

  MovieList.propTypes = {
    isClicked: propTypes.bool,
    guestSessionId: propTypes.bool,
    movieList: propTypes.array,
    loading: propTypes.object,
    error: propTypes.object,
  };
  const genres = useGenres();
  const [rating, setRating] = useState({});
  const [currentRatedPage, setCurrentRatedPage] = useState(1);
  const moviesPerPage = 24; // Количество фильмов на странице

  const indexOfLastMovie = currentRatedPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentRatedMovies = Object.values(rating).slice(indexOfFirstMovie, indexOfLastMovie);

  const handleRatedPageChange = (page) => {
    setCurrentRatedPage(page);
  };

  useEffect(() => {
    const savedRating = localStorage.getItem('movieRating');
    if (savedRating) {
      setRating(JSON.parse(savedRating));
    } else {
      console.log(1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('movieRating', JSON.stringify(rating));
  }, [rating]);

  const overview = (text) => {
    if (typeof text !== 'string' || !text.trim()) {
      return 'Описание отсутствует';
    }
    const maxLength = 207;
    const regex = new RegExp(`^.{1,${maxLength}}\\b(?!\\W)`, 's');
    const match = text.match(regex);

    if (match) {
      let truncatedText = match[0];
      truncatedText = truncatedText.replace(/[.,;:!?]+$/, '');
      return truncatedText + '...';
    }

    return text;
  };

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  const voteColor = (score) => {
    if (score <= 3) {
      return '#E90000';
    } else if (score > 3 && score <= 5) {
      return '#E97E00';
    } else if (score > 5 && score <= 7) {
      return '#E9D100';
    } else if (score > 7 && score <= 10) return '#66E900';
  };

  let elements;

  if (!isClicked) {
    elements = movieList.map((movie) => {
      const handleRateChange = (value) => {
        setRating((prev) => ({
          ...prev,
          [movie.id]: {
            ...movie,
            userRating: value,
            guestSessionId,
          },
        }));
      };

      if (!isClicked) {
        return (
          <li className="movie_item" key={movie.id}>
            <img
              className="movie_img"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`К сожалению, мы не нашли постер к этому фильму`}
            />
            <div className="movie_text">
              <div className="movie_header">
                <h5 className="movie_title">{movie.title}</h5>
                <div className="movie_vote" style={{ border: `2px solid ${voteColor(movie.vote_average)}` }}>
                  <p className="movie_score">{Math.ceil(movie.vote_average * 10) / 10}</p>
                </div>
              </div>
              {movie.release_date && (
                <p className="movie_releaseDate">{format(new Date(movie.release_date), 'MMMM d, yyyy')}</p>
              )}
              <ul className="genres">
                {movie.genre_ids
                  ?.map((id) => {
                    const genre = genres.find((g) => g.id === id);
                    return genre ? (
                      <li className="genre_item" key={id}>
                        {genre.name}
                      </li>
                    ) : null;
                  })
                  .filter(Boolean)}
              </ul>
              <p className="movie_overview">{overview(movie.overview)}</p>
              <Rate
                className="movie_rate"
                count={10}
                onChange={handleRateChange}
                value={rating[movie.id]?.userRating}
                allowHalf
              />
            </div>
          </li>
        );
      }
    });
  }

  if (isClicked) {
    // totalPages(Object.values(rating).length)
    elements = currentRatedMovies.map((movie) => {
      return (
        <li className="movie_item" key={movie.id}>
          <img
            className="movie_img"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={`К сожалению, мы не нашли постер к этому фильму`}
          />
          <div className="movie_text">
            <div className="movie_header">
              <h5 className="movie_title">{movie.title}</h5>
              <div className="movie_vote" style={{ border: `2px solid ${voteColor(movie.vote_average)}` }}>
                <p className="movie_score">{Math.ceil(movie.vote_average * 10) / 10}</p>
              </div>
            </div>
            {movie.release_date && (
              <p className="movie_releaseDate">{format(new Date(movie.release_date), 'MMMM d, yyyy')}</p>
            )}
            <ul className="genres">
              {movie.genre_ids
                ?.map((id) => {
                  const genre = genres.find((g) => g.id === id);
                  return genre ? (
                    <li className="genre_item" key={id}>
                      {genre.name}
                    </li>
                  ) : null;
                })
                .filter(Boolean)}
            </ul>
            <p className="movie_overview">{overview(movie.overview)}</p>
            <Rate className="movie_rate" count={10} value={rating[movie.id]?.userRating} allowHalf />
          </div>
        </li>
      );
    });
  }

  return (
    <>
      <ul className="movie_list">{elements}</ul>

      {isClicked && (
        <Pagination
          pageSize={moviesPerPage}
          total={Object.values(rating).length}
          current={currentRatedPage}
          onChange={handleRatedPageChange}
          align="center"
        />
      )}
    </>
  );
}
