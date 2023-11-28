import {useEffect, useState} from "react";
import Loading from "./utils/Loading";
import AnnouncementItemCategory from "./AnnouncementItemCategory";
import AnnouncementUpdater from "./AnnouncementUpdater";
import CommentCreator from "./comment/CommentCreator";
import Comments from "./comment/Comments";
import Rating from "./rate/Rating";
import {FaComment} from "react-icons/fa";
import RatingWithAverage from "./rate/RatingWithAverage";


export default function AnnouncementItem({item, onEdit}) {

    const [categories, setCategories] = useState([]);
    const [location, setLocation] = useState({city: '', region:''});
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {

        Promise.all([
            fetch(item._links.categories.href),
            fetch(item._links.location.href)
        ])
            .then(async results=>{
                const arr = [];
                for (let i=0; i<results.length;i++){
                    arr.push(await results[i].json());
                }
                return arr;
            })
            .then(results=>{
                const cs = results[0]._embedded.categories;
                setCategories(cs);
                setLocation(prevState => ({
                    ...prevState,
                    city: results[1].city,
                    region: results[1].region
                }));
                setIsLoaded(true);
                console.log(location);
                console.log(results[1]);
            })
            .catch(error => {setError(error)});


    }, [])


    if (error) {
        return (
            <div className="alert alert-danger">
                {error.message + " "}
            </div>
        )
    } else if (!isLoaded) {
        return <Loading/>
    }
    return (
        <li className="col-sm-12 col-md-6 col-lg-3 col-xl-2 list-unstyled h-100" key={item._links.self.href}>
            <div className="h-100 p-2 border border-1 border-light-subtle rounded-2 shadow
                            bg-opacity-25
                            bg-success
                            d-flex justify-content-center align-items-center
                            ">
                <div className="d-flex flex-column align-items-center">
                    <button type="button" className="btn border border-0" data-bs-toggle="modal"
                            data-bs-target={"#openItem" + item._links.self.href.split('/').reverse()[0]}>
                        <h3 className="text-center">
                            {item.title}
                        </h3>

                    </button>
                    <ul className="row row-gap-1 p-0 m-0">
                        {categories.map(c => (

                            <AnnouncementItemCategory category={c} key={c._links.self.href}/>
                            // </button>
                        ))}
                    </ul>
                </div>


                <div className="modal fade" id={"openItem" + item._links.self.href.split('/').reverse()[0]}>
                    <div className="modal-dialog ">
                        <div className="modal-content bg-gradient bg-light p-2 shadow shadow-lg border">

                            <div className="modal-header">
                                <h2 className="modal-title">
                                    {item.title}
                                </h2>
                                <button className="btn-close" data-bs-dismiss="modal"></button>
                            </div>

                            <div className="modal-body">
                                <div>
                                    <h3>Описание:</h3>
                                    <p className="text-break overflow-y-scroll">
                                        {item.description}
                                    </p>
                                </div>
                                <div>
                                    <h3>Категории: </h3>
                                    <ul className="row m-0 p-0 row-gap-2">
                                        {categories.map(c => (
                                                <AnnouncementItemCategory category={c} key={c._links.self.href}/>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3>Локация</h3>
                                    <p>{`${location.city} : ${location.region}`}</p>
                                </div>

                                <div>
                                    <h3>Дата публикации:</h3>
                                    <p>{new Date(Date.parse(item.createdAt)).toLocaleDateString()}</p>
                                </div>


                                <div className="d-flex justify-content-between">
                                <div className="btn-group-sm">
                                    <button
                                        className="btn btn-outline-dark"
                                        data-bs-toggle="modal"
                                        data-bs-target={"#commentForm"+item._links.self.href.split("/").reverse()[0]}
                                    >
                                        <span>
                                            Комментировать
                                        </span>
                                        <FaComment className="ms-1 align-baseline"/>
                                    </button>
                                </div>

                                    <RatingWithAverage item={item}/>
                                </div>
                            </div>



                            <div className="modal-footer">
                                <button className="btn btn-outline-primary" data-bs-toggle="modal"
                                        data-bs-target={"#editItem"+
                                            item._links.self.href.split("/").reverse()[0]}
                                data-bs-dismiss="modal">
                                    Редактировать
                                </button>
                                <button className="btn btn-outline-danger" onClick={e=>{
                                    const res = window.confirm("Уверены, что хотите удалить объявление?");
                                    if(res) {

                                        /*const deletePromises = [];
                                        for (let key in item._links) {
                                            if (!["self", "announcement"].includes(key)) {

                                            }
                                        }*/

                                        Promise.all(
                                            Object.keys(item._links)
                                                .filter(key=>!["self", "announcement"].includes(key))
                                                .map(key=> {
                                                    return fetch(item._links[key].href, {
                                                        method: key.endsWith("s")?"PATCH":"DELETE",
                                                        headers:{
                                                            "Content-Type":"text/uri-list"
                                                        },
                                                        body: []
                                                    })
                                                })
                                        ).then(resp=> {
                                            console.log(resp);

                                            fetch(item._links.self.href, {
                                                method: "DELETE",
                                                headers:{
                                                    accept: "application/json"
                                                }
                                            })
                                                .then(resp=>{
                                                    console.log(resp);
                                                    window.location.reload();
                                                })

                                        })




                                    }
                                }}>
                                    Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id={"editItem" +
                    item._links.self.href.split("/").reverse()[0]}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-body">
                                <AnnouncementUpdater item={{
                                    ...item,
                                    categories:[
                                        ...categories.map(c=>c._links.self.href)
                                    ],
                                    location:{
                                        ...location
                                    }
                                }} onUpdate={(data)=>{
                                    console.log(data);
                                    window.location.reload();
                                }}/>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="modal fade" id={"commentForm"+item._links.self.href.split("/").reverse()[0]}>
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content p-2 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h2 className="text-center">Комментарии</h2>
                                <Comments announcement={item}/>
                            </div>
                            <CommentCreator announcement={item} onCreate={()=>{

                                fetch(item._links.self.href)
                                    .then(resp=>resp.json())
                                    .then(json=>{
                                        // setIsLoaded(false);
                                        fetch(item._links.comments.href)
                                            .then(resp=>resp.json())
                                            .then(json=>{
                                                // setIsLoaded(true);
                                            })
                                        // onEdit();
                                    })
                                    .then(r=>{
                                    })
                                    .catch(error=>{
                                        alert(error.message)
                                    })
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );

}

