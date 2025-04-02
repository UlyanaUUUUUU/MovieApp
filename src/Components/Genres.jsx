import {useContext, createContext} from "react";

export const GenresContext = createContext()

export  function useGenres() {
    return useContext(GenresContext)
}