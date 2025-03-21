import './MovieList.css';
import { Alert, Spin } from "antd";
import { format } from "date-fns";

export default function MovieList({ movieList, loading, error }) {
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

    if (loading) {
        return <Spin/>;
    }

    if (error) {
        return <Alert type="error" message={error} />;
    }

    const elements = movieList.map((movie) => (
        <li className='movie_item' key={movie.id}>
            <img className='movie_img' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <div className='movie_text'>
                <h5 className='movie_title'>{movie.title}</h5>
                {movie.release_date && (
                    <p className='movie_releaseDate'>{format(new Date(movie.release_date), 'MMMM d, yyyy')}</p>
                )}
                <p className='movie_overview'>{overview(movie.overview)}</p>
            </div>
        </li>
    ));

    return <ul className='movie_list'>{elements}</ul>;
}