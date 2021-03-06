import React, { useReducer, useEffect } from "react";
import FilmCard from "./components/FilmCard";
import FilmSearch from "./components/FilmSearch";
import NavBar from './components/NavBar';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

const api_key = `${process.env.REACT_APP_TMDB_API_KEY}`;
const TMDB_API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=spider%20man&page=1&include_adult=false`;

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null,
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload,
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error,
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch(TMDB_API_URL)
      .then((response) => response.json())
      .then((jsonResponse) => {
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: jsonResponse.results,
        });
      });
  }, []);

  const search = (searchValue) => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST",
    });

    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${searchValue}&include_adult=false`
    )
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.results.length !== null) {
          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.results,
          });
        } else {
            dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonResponse.Error,
          });
        }
      });
  };

  const { movies, errorMessage, loading } = state;
  return (
    <>
      <NavBar />
      <Grid container justify={'center'} spacing={3}>
        <Grid item xs={12} style={{ backgroundColor: '#263238', padding: '40px 0px' }}>
          <FilmSearch search={search} />
        </Grid>
        {loading && !errorMessage ? (
          <Typography variant="h4">loading...</Typography>
        ) : errorMessage ? (
          <Typography className="errorMessage">{errorMessage}</Typography>
        ) : (
          movies.map((movie, index) => (
            <Grid item>
              <FilmCard key={`${index}-${movie.title}`} movie={movie} />
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
};

export default App;
