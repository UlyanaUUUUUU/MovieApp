import './App.css';
import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import MovieList from './Components/MovieList.jsx';
import Search from './Components/Search.jsx';
import Tabs from './Components/Tabs.jsx';
import React from 'react';
import { GenresContext } from './Components/Genres.jsx';

export default function App() {
  const [searchText, setSearchText] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [genres, setGenres] = useState([]);
  const [isClicked, setIsClicked] = useState(null);

  const apiKey = 'adbfaf11bf934f9bdd367b127819e5e1';

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZGJmYWYxMWJmOTM0ZjliZGQzNjdiMTI3ODE5ZTVlMSIsIm5iZiI6MTc0MTYzNzQ5NC4yMjMsInN1YiI6IjY3Y2Y0Nzc2M2MyNTQ0NDg4MmUzMzEzZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Wpo8JCwM921r1EG1_MgVAA37j8K7Ra-VvsCQsi9fGTY',
      },
    };

    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
      .then((res) => res.json())
      .then((res) => setGenres(res.genres))
      .catch((err) => console.error('Жанры не были получены', err));
  }, []);

  useEffect(() => {
    const createGuestSession = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZGJmYWYxMWJmOTM0ZjliZGQzNjdiMTI3ODE5ZTVlMSIsIm5iZiI6MTc0MTYzNzQ5NC4yMjMsInN1YiI6IjY3Y2Y0Nzc2M2MyNTQ0NDg4MmUzMzEzZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Wpo8JCwM921r1EG1_MgVAA37j8K7Ra-VvsCQsi9fGTY',
        },
      };

      try {
        const savedSession = localStorage.getItem('guest_session_id');

        if (savedSession) {
          setGuestSessionId(savedSession);
        } else {
          const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', options);

          const data = await response.json();

          if (data.success) {
            localStorage.setItem('guest_session_id', data.guest_session_id);
            setGuestSessionId(data.guest_session_id);
          }
        }
      } catch (error) {
        console.error('Ошибка при работе с гостевой сессией:', error);
      }
    };

    createGuestSession();
  }, [apiKey]);

  useEffect(() => {
    if (!searchText) return;

    setLoading(true);
    setError(null);
    fetchApi();
  }, [searchText, currentPage]);

  function fetchApi() {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchText}&page=${currentPage}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.results.length === 0) {
          setError(`Ничего не найдено`);
        } else {
          setMovieList(body.results);
          setTotalPages(body.total_pages);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(`Запрос не выполнился`, error);
        setError(`Проверьте VPN`);
        setLoading(false);
      });
  }

  function onCreate(searchKeyWord) {
    setSearchText(searchKeyWord);
    setCurrentPage(1);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const isClickedButtonRated = (isClicked) => {
    if (isClicked) {
      setIsClicked(true);
    } else {
      setIsClicked(false);
    }
    return isClicked;
  };

  return (
    <GenresContext.Provider value={genres}>
      <section className="MovieApp">
        <Tabs isClicked={isClickedButtonRated} />
        <Search onCreate={onCreate} isClicked={isClicked} />
        <MovieList
          loading={loading}
          error={error}
          movieList={movieList}
          isClicked={isClicked}
          guestSessionId={guestSessionId}
        />
        <Pagination pageSize={12} total={totalPages} current={currentPage} onChange={handlePageChange} align="center" />
      </section>
    </GenresContext.Provider>
  );
}
