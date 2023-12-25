import {useCallback, useEffect, useState} from "react";
import Loading from "./utils/Loading";
import AnnouncementItemCategory from "./AnnouncementItemCategory";
import AnnouncementUpdater from "./AnnouncementUpdater";
import Comments from "./comment/Comments";
import {FaComment} from "react-icons/fa";
import RatingWithAverage from "./rate/RatingWithAverage";
import "bootstrap";

export default function AnnouncementItem({item, onEdit}) {
    const [categories, setCategories] = useState([]);
    const [location, setLocation] = useState({city: "", region: ""});
    const [error, setError] = useState(null);

    const [loaded, setLoaded] = useState({
        location: false,
        categories: false,
    });

    const loadItem = useCallback(async () => {
        const resp = await fetch(item._links.self.href);
        return await resp.json();
        }, [item._links.self.href]);
    const loadLocation = () => {
        fetch(item._links.location.href)
            .then((resp) => {
                if (resp.status === 404) {
                    throw new Error("Categories not found");
                }
                return resp;
            })
            .then((resp) => resp.json())
            .then((json) => {
                setLocation((prevState) => ({
                    ...prevState,
                    city: json.city,
                    region: json.region,
                }));
                setLoaded((prev) => ({
                    categories: prev.categories,
                    location: true,
                }));
            })
            .catch((error) => {
                setLoaded((prev) => ({
                    ...prev,
                    location: false,
                }));
            });
    };

    const loadCategories = useCallback(() => {
        fetch(item._links.categories.href)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Categories not found");
                }
                return resp;
            })
            .then((resp) => resp.json())
            .then((json) => {
                setCategories(json._embedded.categories);
                setLoaded((prev) => ({
                    location: prev.location,
                    categories: true,
                }));
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [item._links.categories.href]);


    useEffect(() => {
        loadCategories();
    }, []);

    if (error) {
        return <div className="alert alert-danger">{error.message + " "}</div>;
    } else if (!loaded.categories) {
        return <Loading/>;
    }
    return (
        <li
            className="col-sm-12 col-md-6 col-lg-3 col-xl-2 list-unstyled h-100"
            key={item._links.self.href}
        >
            <div
                className="h-100 p-2 border border-1 border-light-subtle rounded-2 shadow
                            bg-opacity-25
                            bg-success
                            d-flex justify-content-center align-items-center
                            "
            >
                <div className="d-flex flex-column align-items-center">
                    <button
                        type="button"
                        className="btn border border-0"
                        data-bs-toggle="modal"
                        data-bs-target={
                            "#openItem" + item._links.self.href.split("/").reverse()[0]
                        }
                        onClick={() => {
                            loadLocation();
                            loadCategories();
                        }}
                    >
                        <h3 className="text-center">{item.title}</h3>
                    </button>
                    <ul className="row row-gap-1 p-0 m-0">
                        {categories.map((c) => (
                            <AnnouncementItemCategory
                                category={c}
                                key={c._links.self.href}
                                onUpdate={() => onEdit()}
                            />
                        ))}
                    </ul>
                </div>

                <div
                    className="modal fade"
                    id={"openItem" + item._links.self.href.split("/").reverse()[0]}
                >
                    <div className="modal-dialog ">
                        <div className="modal-content bg-gradient bg-light p-2 shadow shadow-lg border">
                            {
                                itemAllDataModalContentInner({item, categories}, () => {
                                    return loaded.location ? (
                                        <LocationComponent location={location}/>
                                    ) : (
                                        <div className="mt-2 ms-auto me-auto d-flex justify-content-end">
                                            <Loading/>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>

                <div
                    className="modal fade"
                    id={"editItem" + item._links.self.href.split("/").reverse()[0]}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                {loaded.location && loaded.categories ? (
                                    <AnnouncementUpdater
                                        item={{
                                            ...item,
                                            categories: [
                                                ...categories.map((c) => c._links.self.href),
                                            ]
                                        }}
                                        onUpdate={() => {
                                            loadLocation();
                                            loadCategories();
                                            loadItem().then(resp=>item = {...resp});
                                            onEdit();
                                        }}
                                    />
                                ) : (
                                    <Loading/>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="modal fade"
                    id={"commentForm" + item._links.self.href.split("/").reverse()[0]}
                >
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content p-2 d-flex flex-column justify-content-between">
                            <Comments announcement={item}/>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}

const LocationComponent = ({location}) => {
    return (
        <div>
            <h3>Локация</h3>
            <p>{`${location.city} : ${location.region}`}</p>
        </div>
    );
};

const itemAllDataModalContentInner = (data, locationComponent) => {
    return (
        <>
            <div className="modal-header">
                <h2 className="modal-title">{data.item.title}</h2>
                <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
                <div>
                    <h3>Описание:</h3>
                    <p className="text-break overflow-y-scroll">
                        {data.item.description}
                    </p>
                </div>
                <div>
                    <h3>Категории: </h3>
                    <ul className="row m-0 p-0 row-gap-2">
                        {data.categories.map((c) => (
                            <AnnouncementItemCategory category={c} key={c._links.self.href}/>
                        ))}
                    </ul>
                </div>
                {locationComponent()}
                <div>
                    <h3>Дата публикации:</h3>
                    <p>
                        {new Date(Date.parse(data.item.createdAt)).toLocaleDateString()}
                    </p>
                </div>

                <div className="d-flex justify-content-between">
                    <div className="btn-group-sm">
                        <button
                            className="btn btn-outline-dark"
                            data-bs-toggle="modal"
                            data-bs-target={
                                "#commentForm" +
                                data.item._links.self.href.split("/").reverse()[0]
                            }
                        >
                            <span>Комментировать</span>
                            <FaComment className="ms-1 align-baseline"/>
                        </button>
                    </div>

                    <RatingWithAverage item={data.item}/>
                </div>
            </div>

            <div className="modal-footer">
                <button
                    className="btn btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target={
                        "#editItem" + data.item._links.self.href.split("/").reverse()[0]
                    }
                    data-bs-dismiss="modal"
                    onClick={() => {

                    }}
                >
                    Редактировать
                </button>
                <button
                    className="btn btn-outline-danger"
                    onClick={(e) => {
                        const res = window.confirm(
                            "Уверены, что хотите удалить объявление?"
                        );
                        if (res) {
                            Promise.all(
                                Object.keys(data.item._links)
                                    .filter((key) => !["self", "announcement"].includes(key))
                                    .map((key) => {
                                        return fetch(data.item._links[key].href, {
                                            method: key.endsWith("s") ? "PATCH" : "DELETE",
                                            headers: {
                                                "Content-Type": "text/uri-list",
                                            },
                                            body: [],
                                        });
                                    })
                            ).then((resp) => {
                                console.log(resp);

                                fetch(data.item._links.self.href, {
                                    method: "DELETE",
                                    headers: {
                                        accept: "application/json",
                                    },
                                }).then((resp) => {
                                    console.log(resp);
                                    window.location.reload();
                                });
                            });
                        }
                    }}
                >
                    Удалить
                </button>
            </div>
        </>
    );
};
