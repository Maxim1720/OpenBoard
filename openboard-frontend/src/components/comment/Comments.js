import {useCallback, useEffect, useState} from "react";
import CommentCreator from "./CommentCreator";


export default function Comments({announcement}) {

    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);


    const loadItems = useCallback(() => {
        fetch(announcement._links.comments.href)
            .then(resp => resp.json())
            .then(json => {
                setItems([...json._embedded.comments]);
                setIsLoaded(true);
            })
            .catch(err => setError(err));
    }, []);

    useEffect(() => {
        console.log(items);
        loadItems();
    }, []);

    if (error) {
        return (
            <div className="alert alert-danger">
                {error.message}
            </div>
        );
    } else if (!isLoaded) {
        return (
            <div className="spinner-border">
            </div>
        );
    }

    return (

        <div className="">
            <h2 className="text-center">Комментарии</h2>
            <div className="d-flex flex-column h-75">
                <div className="flex-grow-1 h-100">
                    <h4 className="text-bg-danger">Предыдущие комментарии</h4>
                    <ul className="list-group row-gap-2">
                        {
                            items.map(i => (
                                <li id={"comment-item" + i._links.self.href.split('/').reverse()[0]}
                                    className="list-group-item text-bg-dark badge text-start text-wrap text-break
                                    fs-6
                                    d-flex
                                    justify-content-between"
                                    key={i._links.self.href}
                                >
                                    <div className="d-flex justify-content-between w-100">
                                        <p className="fs-5 text-black fw-normal">{i.text}</p>
                                        <p>{new Date(Date.parse(i.createdAt)).toLocaleString()}</p>
                                    </div>

                                    <div>
                                        {/*<button className="btn btn-sm btn-outline-dark" type="submit"
                            onClick={(e)=>{

                            }}
                                    value="edit">✏️</button>*/}
                                        <button className="btn btn-sm btn-close" onClick={e => {
                                            fetch(i._links.self.href, {
                                                method: "DELETE"
                                            })
                                                .then(resp => {
                                                    if (resp.ok) {
                                                        loadItems();
                                                        // setIsLoaded(false);
                                                        /*setItems(prev=>([
                                                            items.filter(f=>f!==i)
                                                        ]));*/
                                                        /*document
                                                            .querySelector("#comment-item"
                                                                + i._links.self.href.split('/').reverse()[0])
                                                            .remove()*/
                                                    } else {
                                                        resp.json().then(json => setError(json.message));
                                                    }
                                                })
                                                .then(resp => {
                                                    setIsLoaded(true);
                                                })
                                        }}/>
                                    </div>

                                </li>
                            ))
                        }
                    </ul>
                </div>
                <CommentCreator announcement={announcement} onCreate={() => {
                    loadItems();
                    // fetch(item._links.self.href)
                    //     .then((resp) => resp.json())
                    //     .then((json) => {
                    //         fetch(item._links.comments.href)
                    //             .then((resp) => resp.json())
                    //             .then((json) => {onEdit()})
                    //             .then(()=>{
                    //
                    //             })
                    //     })
                    //     .catch((error) => {
                    //         alert(error.message);
                    //     });
                }}
                />
            </div>
        </div>

    );
}