import './Tabs.css';
import React from 'react';
import propTypes from 'prop-types';

export default function Tabs({ isClicked }) {
  Tabs.defaultProps = {
    isClicked: null,
  };

  Tabs.propTypes = {
    isClicked: propTypes.bool,
  };

  const showRatedMovies = () => {
    return isClicked(true);
  };

  const showSearchMovies = () => {
    return isClicked(false);
  };

  return (
    <header>
      <div className="tabs">
        <button className="tabs_search" onClick={showSearchMovies}>
          Search
        </button>
        <button className="tabs_rated" onClick={showRatedMovies}>
          Rated
        </button>
      </div>
    </header>
  );
}
