import Head from "next/head"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MovieCard, MovieGenre, Loader } from "../../components"
import styles from "../../styles/Home.module.css"

export async function getStaticProps() {
    const result1 = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=1`)
    const result2 = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=2`)
    const popularTemp1 = await result1.json()
    const popularTemp2 = await result2.json()

    let popular = popularTemp1.results.filter(movie => movie.poster_path)
    let popular2 = popularTemp2.results.filter(movie => movie.poster_path)
    popular = popular.concat(popular2)

    const getGenres = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US`)
    const genres = await getGenres.json()

    return {
        props: {
            popular,
            genres,
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 30 minutes
        revalidate: 1800, // in seconds
    }
}

const TvShows = ({ popular, genres }) => {
    // State
    const [page, setPage] = useState(2)
    const [loading, setLoading] = useState(false)
    const [moreData, setMoreData] = useState([])
    const [filtered, setFiltered] = useState([])
    const [activeGenre, setActiveGenre] = useState({ id: 0, name: "All" })

    // Lifecycle
    useEffect(() => {
        if (page > 2) {
            const loadMoreData = async () => {
                try {
                    setLoading(true)
                    const result = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/tv/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&page=${page}`)
                    const movies = await result.json()
                    let arr = [...moreData, ...movies.results.filter(result => result.poster_path)]
                    setMoreData(arr)
                    setLoading(false)
                } catch (error) {
                    console.log(error)
                }
            }

            loadMoreData()
        }
    }, [page])

    // Render
    return (
        <div className="pageContainer">

            <Head>
                <title>{activeGenre.name} TV Shows - Movieset</title>
                <meta name="keyword" content={activeGenre.name} />
            </Head>

            <MovieGenre
                title="TV Shows"
                popular={popular}
                moreData={moreData}
                genreList={genres.genres}
                setFiltered={setFiltered}
                activeGenre={activeGenre}
                setActiveGenre={setActiveGenre}
            />

            <motion.div className={styles.popular}>
                <AnimatePresence>
                    {filtered && filtered.map((movie, index) => (
                        <MovieCard
                            type="tv"
                            data={movie}
                            key={movie.id + "-" + index}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            <div className={styles.loadMore}>
                {
                    loading
                        ? <Loader />
                        : page <= 10
                            ? (
                                <button
                                    className="btn-main"
                                    onClick={() => setPage(page + 1)}
                                >
                                    Load More
                                </button>
                            )
                            : null
                }
            </div>

        </div>
    );
}

export default TvShows;