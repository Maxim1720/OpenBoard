import Rating from "./Rating";
import {useEffect, useState} from "react";


export default function RatingWithAverage({item}) {

    const [loadData, setData] = useState({
        isLoaded: false,
        ratings: [],
        error: null
    });

    const fetchItems = ()=>{
        fetch(item._links.ratings.href)
            .then(resp => resp.json())
            .then(json => {
                setData(prevState => ({
                    isLoaded: true,
                    ratings: [...json._embedded.ratings],
                    error: prevState.error
                }))
            })
            .catch(error => setData({error: error}))
    }
    useEffect(() => {
        fetchItems();
    }, []);

    const onRate = (val) => {
        fetch("http://localhost:8080/ratings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                value: val,
                announcement: item._links.self.href
            }),
        })
            .then(resp => resp.json())
            .then(json => {
                setData(prevState => {
                    return {
                        ratings: prevState.ratings,
                        isLoaded: false,
                        error: prevState.error
                    };
                })
                fetchItems();
            })
    }

    if (loadData.error) {
        return (
            <div className="alert alert-danger">
                {loadData.error.message}
            </div>
        );
    } else if (!loadData.isLoaded) {
        return (
            <div className="spinner-border-sm" role="status">
            </div>
        );
    }


    const averageRating = (loadData.ratings.reduce((p,c) => {
        return p + Number(c.value);
    },0) / loadData.ratings.length).toFixed(1);


    return (
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <Rating defaultValue={0} onRate={onRate}/>
            </div>
            <div className="text-center">
                {
                    isNaN(Number(averageRating))? 0 : averageRating
                }
            </div>
        </div>
    );
}