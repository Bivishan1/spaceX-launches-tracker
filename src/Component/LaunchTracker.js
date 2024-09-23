import React, { useEffect, useState } from 'react';
import '../App.css';

export default function LaunchTracker() {
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);//since we want to start from first page.
    const launchesperPage = 10;//there will be 10 launches in each page.
    useEffect(() => {
        const API_KEY = `https://api.spacexdata.com/v4/launches`;
        fetch(API_KEY)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Data not found");
                }
                return res.json();
            })
            .then((data) => {

                setLaunches(data);
                setLoading(false);
                setErr(null);
            })
            .catch((err) => {
                setErr(err.message);
                setLoading(false);
            })

    }, []);

    // detect changes in current page, so scrolling to the top.
    useEffect(() => {
        // Scroll to the top whenever the current page changes
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [currentPage]);

    //custom variables to track just first & last index of launch in the list of 10 launches in per page.
    const indexOfLastLunch = launchesperPage * currentPage;
    const indexOfFirstLunch = indexOfLastLunch - launchesperPage;
    //arrays to store launches
    const currentLaunches = launches.slice(indexOfFirstLunch, indexOfLastLunch);
    //total pages number
    const totalpages = Math.ceil(launches.length / launchesperPage);
    // creating an array elements, which has passing object as literals. as whether from string or object.

    const handleClick = (pagenumber) => {

        setCurrentPage(pagenumber);

        //scrolling won't work here because while setCurrent() sets pagenumber the component will re-render but we want to scroll to the top after the component render. #LOL,,
        // window.scrollTo({

        //     top: -10,
        //     behavior: 'smooth'
        // });

    }
    return (
        <div>
            <h1 className='title'>Launcher Tracker</h1>
            {loading && <p>Loading...</p>}
            {err && <p>Error is:{err}</p>}

            <ul className='launches-list'>
                {currentLaunches.map((launch) => (
                    <li key={launch.id} className='launch-item'>
                        <p>Name: <strong>{launch.name}</strong> </p>
                        <p>Rocket : {launch.rocket}</p>
                        <p>Data : {new Date(launch.static_fire_date_utc).toLocaleDateString()}</p>
                        <p>Details: {launch.details ? launch.details : `no details found`}</p>
                        <a href={launch.links.webcast} target='_blank' rel="noopener noreferrer" >Watch Broadcast</a>
                    </li>
                ))}
            </ul>
            <div className="pagination">
                {Array.from({ length: totalpages }, (_, index) => index + 1).map((pagenumber) =>

                    <button
                        key={pagenumber}
                        onClick={() => handleClick(pagenumber)}
                        disabled={pagenumber === currentPage}
                        className={`pagination-button ${pagenumber === currentPage ? `active` : ''}`}
                    >
                        {pagenumber}
                    </button>
                )}
            </div>
        </div >
    )
}
