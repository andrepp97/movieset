import Link from 'next/link'
import Image from 'next/image'
import ReactStars from 'react-stars'
import { BsPlayFill, BsImages } from 'react-icons/bs'

const castURL = 'https://image.tmdb.org/t/p/w138_and_h175_face'

const MovieDetail = ({ styles, casts, video, details, openModal }) => {
    return (
        <div className={styles.movieDetail}>

            <h1>
                {details.title}
                <span>
                    ({details.release_date && details.release_date.split('-')[0]})
                </span>
            </h1>

            <div className={styles.movieGenre}>
                {details.genres.map((genre, index) => (
                    <div key={index}>
                        <span>
                            {genre.name}
                        </span>
                        {index === details.genres.length - 1 ? '' : <>&nbsp;&#9679;&nbsp;</>}
                    </div>
                ))}
            </div>

            <div className={styles.movieRating}>
                <ReactStars
                    size={30}
                    count={10}
                    half={true}
                    edit={false}
                    color2={'#ffd700'}
                    value={details.vote_average}
                />
                &nbsp;
                <p>
                    ({details.vote_average} / 10)
                </p>
            </div>

            <div className={styles.cast}>
                <h3>Main Cast</h3>
                <div className={styles.castWrapper}>
                    {casts.map((cast, index) => {
                        if (index < 6) return (
                            <Link
                                passHref={true}
                                key={cast.cast_id}
                                href={`/cast/` + cast.id}
                            >
                                <div className={styles.castBox}>
                                    <Image
                                        width={90}
                                        height={90}
                                        alt={cast.name}
                                        priority={true}
                                        className={styles.castImg}
                                        src={castURL + cast.profile_path}
                                    />
                                    <p>
                                        {cast.name}
                                    </p>
                                    <small>
                                        {cast.character}
                                    </small>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className={styles.synopsis}>
                <h3>Overview</h3>
                <p>
                    {details.overview}
                </p>
            </div>

            {video && (
                <div className={styles.media}>
                    <h3>Media</h3>
                    <div className="d-flex">
                        <button
                            className="btn-main"
                            onClick={() => openModal("trailer")}
                        >
                            <BsPlayFill size={20} /> &nbsp; Play Trailer
                        </button>
                        <button
                            className="btn-main"
                            onClick={() => openModal("gallery")}
                        >
                            <BsImages size={20} /> &nbsp; Gallery
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default MovieDetail;