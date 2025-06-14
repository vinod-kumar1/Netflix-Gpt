import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateMoviesType,
  setPlaying,
  setMuted,
} from "../utils/moviesPagination";
import { MovieCategoryList } from "./MovieCategories";
import { fetchMovieTypeList } from "../utils/fetch";
import { tmdbKeys } from "../tmdb";
import { fetchMovieKey } from "../utils/fetch";

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${tmdbKeys.api_key}`,
  },
};

export default function MoviesPage() {
  const dispatch = useDispatch();
  const moviesType = useSelector((state) => state.moviesPagn.moviesType);
  const playing = useSelector((state) => state.moviesPagn.playing);
  const page = useSelector((state) => state.moviesPagn.typePageCount);
  const curType = useSelector(
    (state) => state.moviesPagn.requestedPaginationType
  );
  const muted = useSelector((state) => state.moviesPagn.muted);

  const [render, forceRender] = useState(true);

  const types = ["now_playing", "top_rated", "upcoming", "popular"];

  // useEffect(() => {
  //   forceRender((prev) => !prev);
  // }, [muted]);

  useEffect(() => {
    if (playing.id == undefined) {
      let random = Math.floor(
        Math.random() * moviesType["now_playing"].length - 1
      );
      fetchMovieKey(moviesType["now_playing"][random]?.id)
        .then((res) => res.json())
        .then((json) => {
          if (json.results && json.results.length) {
            dispatch(
              setPlaying({
                ...json.results[0],
                ...moviesType["now_playing"][random],
              })
            );
            window.scroll({
              top: 0,
              behavior: "smooth",
            });
          }
        })
        .catch(console.log);
    }
  }, [moviesType]);

  useEffect(() => {
    fetchMovieTypeList(curType, page[curType])
      .then((res) => res.json())
      .then((json) => {
        if (json.results) {
          dispatch(updateMoviesType({ type: curType, movies: json.results }));
        }
      })
      .catch(console.error);
  }, [page]);

  useEffect(() => {
    async function run() {
      let temp = [];
      types.forEach(async (type) => {
        const url = `https://api.themoviedb.org/3/movie/${type}?language=en-US&page=${page[type]}`;
        // fetch(url, options)
        //   .then((res) => res.json())
        //   .then((json) => {
        //     if (!json.results || !json.results.length) return;
        //     dispatch(updateMoviesType({ type, movies: json.results }));
        //   })
        //   .catch(console.error);
        let res = await fetch(url, options);
        let json = await res.json();
        if (json.results || json.results?.length)
          temp.push({ type: type, movies: json.results });
        if (type == "popular") {
          let data = await Promise.all(temp);
          dispatch(updateMoviesType(data));
        }
      });
    }
    run();
  }, []);

  return (
    <div>
      <div className="movie-lists z-2 relative -top-10">
        <div className="">
          <div className="main-movie">
            {playing.key && (
              <>
                <iframe
                  allowFullScreen
                  className="-top-8 w-screen relative -translate-y-10 h-[650px]"
                  src={`https://www.youtube.com/embed/${playing.key}?origin=https%3A%2F%2Fwww.themoviedb.org&hl=en&fs=1&autohide=1&color=red&loop=1&playlist=${playing.key}&controls=0&mute=${muted}&autoplay=1`}
                ></iframe>
                <img
                  className="absolute w-10 top-95 right-4 cursor-pointer"
                  onClick={() => dispatch(setMuted())}
                  src={muted == 1 ? tmdbKeys.muteIcon : tmdbKeys.unmuteIcon}
                  alt="volume icon"
                />

                {playing?.name && (
                  <div className="text-white flex flex-wrap flex-col w-100 h-max top-72 absolute">
                    <p className="md:text-2xl bg-blend-color-burn md:font-[monospace] w-max mb-4 px-4">
                      {playing.title}
                    </p>
                    <p className="relative left-2 w-[70%] font-extralight">
                      {playing.overview?.slice(0, 100)}...
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="movie-list-type py-2 translate-y-1 relative bottom-40 flex flex-col gap-4">
            {types.map((type) => (
              <MovieCategoryList
                key={type}
                movies={moviesType[type]}
                type={type.split("_").join(" ").toUpperCase()}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
