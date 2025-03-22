import './MovieList.css';
import {Alert, Spin} from "antd";
import {format} from "date-fns";
import {Rate} from 'antd';

export default function MovieList({movieList, loading, error}) {
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
        return <Alert type="error" message={error}/>;
    }


    const voteColor = (score) => {
        if (score <= 3) {
            return '#E90000'
        } else
        if (score > 3 && score <= 5) {
            return '#E97E00'
        } else
        if (score > 5 && score <= 7) {
            return '#E9D100'
        } else
        if (score > 7 && score <= 10) return '#66E900'
    }

    const elements = movieList.map((movie) => (
        <li className='movie_item' key={movie.id}>
            <img className='movie_img' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                 alt={`К сожалению, мы не нашли постер к этому фильму`}/>
            <div className='movie_text'>
                <div className='movie_header'>
                    <h5 className='movie_title'>{movie.title}</h5>
                    <div className='movie_vote' style={{border: `2px solid ${voteColor(movie.vote_average)}`}}>
                        <p className='movie_score'>{Math.ceil(movie.vote_average * 10) / 10}</p>
                    </div>
                </div>
                {movie.release_date && (
                    <p className='movie_releaseDate'>{format(new Date(movie.release_date), 'MMMM d, yyyy')}</p>
                )}
                <p className='movie_overview'>{overview(movie.overview)}</p>
                <Rate className="movie_rate"
                      count={10}
                      allowHalf
                />
            </div>
        </li>
    ));

    return <ul className='movie_list'>{elements}</ul>;
}