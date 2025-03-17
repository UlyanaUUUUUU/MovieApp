import './MovieList.css'
import {useEffect, useState} from "react";
import {Alert} from "antd";
import {format} from "date-fns";



export default function MovieList() {
    const [movieList, setMovieList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    const searchKeyWord = 'return'
    const apiKey = 'adbfaf11bf934f9bdd367b127819e5e1'


    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchKeyWord}&page=1`)
            .then(res => res.json())
            .then(body => {
                setMovieList(body.results)
                setLoading(false)
            })
            .catch(error => {
                console.log(`Успешная ошибка`, error)
                setError(`Показ фильмов временно приостановлен :(`)
                setLoading(false)
                }
            )
    }, [])

    if (loading) {
        return(
            movieList.map(() => (
                <li className='movie_item'>
                    <Spin/>
                </li>
            ))
        )
    }

    if (error) {
        return (
            <Alert
                type="error"
                message={error}
            />
        )
    }

    const overview = (text) => {
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

    console.log(movieList)


    return (
        <ul className='movie_list'>
                {loading ? (
                    Array.from({ length: 20}).map((index) => (
                        <li className='movie_item' key={index}>
                            <Spin/>
                        </li>
                    ))
                ) : (movieList.map((movie) => (
                        <li className='movie_item' key={movie.id}>
                            <img className='movie_img' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}/>
                            <div className='movie_text'>
                                <h5 className='movie_title'>{movie.title}</h5>
                                {
                                    movie.release_date && (
                                        <p className='movie_releaseDate'>{format(new Date(movie.release_date), 'MMMM d, yyyy')}</p>
                                    )
                                }
                                <p className='movie_overview'>{overview(movie.overview)}</p>
                            </div>
                        </li>
                    )
                ))}
        </ul>
    )
}