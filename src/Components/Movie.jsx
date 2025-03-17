import './Movie.css'
import {format} from "date-fns";
import {useEffect, useState} from 'react'


export default function Movie() {
    const [movieList, setMovieList] = useState([])

    const searchKeyWord = 'return'
    const apiKey = 'adbfaf11bf934f9bdd367b127819e5e1'
    const getMovie = () => {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchKeyWord}&page=1`)
            .then(res => res.json())
            .then(json => setMovieList(json.results))
    }

    useEffect(() => {
        getMovie();
    }, []);

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
        movieList.map((movie) => (
                <li className='movie_item'>
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
        )
    )
}