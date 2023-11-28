import AnnouncementForm from "./form/AnnouncementForm";

export default function AnnouncementUpdater({item, onUpdate}) {


    console.log(item);

    const onSubmit = (data)=> {

        const [categories, location] = [data.categories, data.location];

        delete data.location;
        delete data.categories;

        console.log(data);
        Promise.all([
            fetch(item._links.location.href).then(resp => resp.json()).then(resp => {
                return fetch(resp._links.self.href, {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    body: JSON.stringify(location)
                });
            }),
            fetch(item._links.categories.href, {
                method: "PUT",
                headers: {
                    "content-type": "text/uri-list",
                    "accept": "application/json"
                },
                body: /*[...*/categories.join("\n")/*.map(c => c._links.self.href)]*/
            }),
            fetch(item._links.self.href, {
                method: "PATCH",
                headers: {
                    "content-type": "application/json",
                    // "accept": "application/json"
                },
                body: JSON.stringify(data)
            })
        ])
            .then(resp => {
                return resp;
            })
            .then(jsons => {
                onUpdate({
                    categories: jsons[1],
                    location: jsons[0],
                    ...jsons[2]
                });
                console.log(jsons);
            })
            .catch(err => alert(err));
    }

    return(
            <AnnouncementForm init={item} onSubmit={onSubmit}/>
    );
}