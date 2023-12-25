import AnnouncementForm from "./form/AnnouncementForm";
import {useCallback, useEffect, useState} from "react";

export default function AnnouncementUpdater({item, onUpdate}) {

    console.log(item);

    const [init, setInit] = useState(item);
    const [locationLoaded, setLocationLoaded] = useState(false);
    const onSubmit = (data) => {
        const location =  data.location;
        const categories = data.categories;

        delete data.location;
        delete data.categories;

        Promise.all([
            fetch(item._links.location.href).then(resp => resp.json()).then(resp => {
                console.log(resp);
                return fetch(resp._links.self.href, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({...location})
                });
            }),
            fetch(item._links.self.href, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({categories: [...categories]})
            })
                .then(resp => {
                    if (resp.ok) {
                        return fetch(item._links.categories.href, {
                            headers: {
                                "Accept": "application/json"
                            }
                        });
                    }
                }),
            fetch(item._links.self.href, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({...data})
            })
        ])

            .then(async resp => {
                const jsons = [];
                for (let i = 0; i < resp.length; i++) {
                    const ct = resp[i].headers.get("Content-Type");
                    console.log(ct);
                    let result;
                    if (ct && ct.indexOf("application/json") !== -1) {
                        result = await resp[i].json();
                    } else {
                        result = await resp[i].text();
                    }
                    jsons.push(result);
                }
                return jsons;
            })
            .then(jsons => {
                console.log(jsons);
                onUpdate();
            })
        // .catch(err => alert(err));
    }

    const loadLocation = useCallback(async () => {
        const resp = await fetch(item._links.location.href);
        return await resp.json();
    }, [item])

    useEffect(() => {
        loadLocation().then(resp => {
            setInit(prev => ({
                ...prev,
                location: {
                    ...resp
                }
            }));
            setLocationLoaded(true);
        })
    }, [loadLocation]);

    if (locationLoaded) {
        return (
            <AnnouncementForm init={init} onSubmit={(data) => {
                onSubmit(data);
            }}/>
        );
    }
    return <></>;
}