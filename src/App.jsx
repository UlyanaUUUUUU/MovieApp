import './App.css'
import MovieList from "./Components/MovieList.jsx";
import Search from "./Components/Search.jsx";
import {useEffect, useState} from "react";
import Footer from "./Components/Footer.jsx";
import {Pagination} from "antd";


function App() {

    const [searchText, setSearchText] = useState("");
    const [movieList, setMovieList] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)

    function onCreate(searchKeyWord) {
        setSearchText(searchKeyWord)
        setCurrentPage(1)
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    //Запрос элемента с API
    const apiKey = 'adbfaf11bf934f9bdd367b127819e5e1'
    useEffect(() => {
        if (!searchText) return

        setLoading(true)
        setError(null)
        fetchApi()
    }, [searchText, currentPage])


    function fetchApi() {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchText}&page=${currentPage}`)
            .then(res => res.json())
            .then(body => {
                if (body.results.length === 0) {
                    setError(`Ничего не найдено`)
                } else {
                    setMovieList(body.results)
                    console.log(body.results)
                    setTotalPages(body.total_pages)
                }
                setLoading(false)
            })
            .catch(error => {
                    console.log(`Запрос не выполнился`, error)
                    setError(`Проверьте VPN`)
                    setLoading(false)
                }
            )
    }

    return (
        <section className='MovieApp'>
            <Search
                onCreate={onCreate}
            />
            <MovieList
                loading={loading}
                error={error}
                movieList={movieList}
            />
            <Pagination pageSize={10}
                        total={totalPages}
                        current={currentPage}
                        onChange={handlePageChange}
                        align="center"
            />

        </section>
    )
}

export default App
