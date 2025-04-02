import './Tabs.css'


export default function Tabs({isClicked}) {

        const showRatedMovies = () => {
            return isClicked(true)
        }

        const showSearchMovies = () => {
            return isClicked(false)
        }


        return (

            <header>
                <div className="tabs">
                    <button
                        className='tabs_search'
                        onClick={showSearchMovies}
                    >
                        Search
                    </button>
                    <button
                        className='tabs_rated'
                        onClick={showRatedMovies}
                    >
                        Rated
                    </button>
                </div>
            </header>
        )

}