import React, { useEffect, useState } from 'react'

export default function LaunchTracker() {
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);
    useEffect(() => {
        fetch(`https://api.spacexdata.com/v4/launches`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Data doesn't load properly");
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
    return (
        <div>
            <h1>Launcher Tracker</h1>
            {loading && <p>Loading...</p>}
            {err && <p>Error is:{err}</p>}

            <ul>
                {launches.map((launch) => {
                    return <li key={launch.id}>
                        <p>Name: <strong>{launch.name}</strong> </p>
                        <p>Rocket : {launch.rocket}</p>
                        <p>Data : {new Date(launch.static_fire_date_utc).toLocaleDateString()}</p>
                        <p>Details: {launch.details ? launch.details : `no details found`}</p>
                        <a href={launch.links.webcast} target='_blank' rel="noopener noreferrer" >Watch Broadcast</a>
                    </li>
                })}
            </ul>
        </div>
    )
}
