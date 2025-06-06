import { useEffect, useRef, useState } from "react";
import { tmdbKeys } from "../tmdb";
import {
  setPlaying,
  setTypePageCount,
  setRequestedPaginationType,
  setPlayingMovieDetails,
} from "../utils/moviesPagination";
import { useDispatch } from "react-redux";
import { fetchMovieKey } from "../utils/fetch";

export function MovieCategoryList({ name, movies, type }) {
  let dispatch = useDispatch();
  let [loading, setLoading] = useState(false);

  function findMovieKeyAndSet(id) {
    fetchMovieKey(id)
      .then((res) => res.json())
      .then((json) => {
        dispatch(setPlaying(json.results[0]));
        window.scroll({
          top: 0,
          behavior: "smooth",
        });
      })
      .catch(console.log);
  }

  useEffect(() => {
    setLoading(false);
  }, [movies]);

  return (
    <div className="w-screen px-4 overflow-x-hidden mb-5">
      <h3 className="bg-gradient-to-r from-red-600 to-black/10 w-max px-2">
        {type}
      </h3>
      <div className="flex gap-4 mt-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
        {movies.map((movie, idx) => (
          <img
            key={movie.id + idx}
            className={`w-40 h-50 flex-shrink-0 rounded-sm transition-transform duration-300 hover:scale-110 object-cover hover:cursor-pointer`}
            onClick={() => {
              findMovieKeyAndSet(movie.id);
              dispatch(setPlayingMovieDetails(movie));
            }}
            src={`${tmdbKeys.photo_baseUrl + movie.poster_path}`}
            alt={movie.title}
          />
        ))}
        <button
          onClick={() => {
            setLoading(true);
            let temp = type.split(" ").join("_").toLowerCase();
            dispatch(
              setTypePageCount({
                type: temp,
              })
            );
            dispatch(setRequestedPaginationType(temp));
          }}
          className="font-mono text-2xl h-50 px-2 bg-red-500 text-white rounded-r-md hover:bg-white hover:text-red-500 cursor-pointer hover:border-[0.5px] mr-2"
        >
          {">"}
          {loading && <p class="animate-spin text-xl">🌀</p>}
        </button>
      </div>
    </div>
  );
}

// export default function MovieCategories() {
//   let [categories, setCategories] = useState({ morePopular: [], popular: [] });
//   let [popupModel, setPopUpModel] = useState({});
//   let model = useRef();
//   let popUpMovie = useRef();
//   let movies = useSelector((state) => state.moviesPagn.movies);
//   let page = useSelector((state) => state.moviesPagn.page);
//   let pages = useSelector((state) => state.moviesPagn.totalPages);
//   let dispatch = useDispatch();

//   useEffect(() => {
//     let popularityLessThan20 = movies.filter((movie) => movie.popularity <= 20);
//     let popularityMorethan20 = movies.filter((movie) => movie.popularity > 20);
//     setCategories({
//       morePopular: popularityMorethan20,
//       popular: popularityLessThan20,
//     });

//     return () => setCategories({});
//   }, [movies]);

//   useEffect(() => {
//     if (popUpMovie.current) {
//       window.scroll({ top: 80, behavior: "smooth" });
//     }
//   }, [popupModel]);

//   return (
//     <div className="transition-all duration-500">
//       {popupModel.key && (
//         <div className="absolute top-0" key={`${popupModel.key}-main`}>
//           <dialog open ref={model}>
//             <button
//               onClick={() => {
//                 model.current.close();
//                 setPopUpModel({});
//               }}
//               className="text-2xl text-white z-199 absolute bg-red-500 right-4 top-25 cursor-pointer rounded-[100px] rotate-90 p-3 hover:bg-white hover:text-red-500 hover:shadow-[2px_0px_10px_white]"
//             >
//               <abbr title="close" className="no-underline">
//                 X
//               </abbr>
//             </button>
//           </dialog>
//         </div>
//       )}
//       <div className="flex">
//         <div className="*:rounded-4xl flex flex-col w-screen items-center mt-4">
//           <MovieCategoryList
//             setPopUpModel={setPopUpModel}
//             name={"Popular Movies"}
//             moviesList={categories.morePopular}
//           />
//           <p>
//             Total Pages : {page} / {pages}
//           </p>
//           <MovieCategoryList
//             setPopUpModel={setPopUpModel}
//             name={"Silver Movies"}
//             moviesList={categories.popular}
//           />
//         </div>
//         <button
//           disabled={page >= pages}
//           className="bg-red-500 h-max translate-y-15 -translate-x-20 py-2 px-2 rounded-r-lg w-max text-white hover:bg-white hover:text-red-500 hover:border-red-500 hover:border-[0.5px] cursor-pointer"
//         >
//           {[..."Load More Movies"].map((char, i) =>
//             char == " " ? (
//               <br key={i} />
//             ) : (
//               <p key={i} className="px-2">
//                 {char}
//               </p>
//             )
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }
