import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';

export default function Announcements() {


    const [loadState, setLoadState] = useState({
        items:[],
        isLoaded: false
    })

    useEffect(() => {
        fetchItems().then(resp=>{
            if(resp.hasOwnProperty("error")){
                setLoadState( ()=>({
                    error: resp.error
                }));
            }
            else {

                setLoadState(() => ({
                    items: resp,
                    // isLoaded: true
                }))
            }
        })
    }, []);


    if(loadState.error){
        alert(loadState.error.message);
    }
    else if(!loadState.isLoaded){
        return <></>
    }

    return(
        <ul className="list-inline">
            {
                loadState.items.map(i=>(
                    <li className="list-inline-item" key={i._links.self.href}>
                        <div className="h-100 border d-flex">
                            <div>
                                {i.title}
                            </div>
                            <div>
                                <ul className="list-group-horizontal">
                                    {
                                        i.categories.map(c=>
                                            (
                                            <div>
                                                {c.name}
                                            </div>
                                            )
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </li>
                ))
            }
        </ul>
    );

}

const fetchItems = ()=>{
    return fetch("http://localhost:8080/announcements")
        .then(resp=>{
            if(!resp.ok){
                throw new Error(resp.statusText);
            }
            return resp.json();
        })
        .then(json=>{
            return json._embedded.announcements;
        })
        .catch(error=>{
            return {error};
        });
}

