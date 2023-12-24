import AnnouncementForm from "./form/AnnouncementForm";

export default function AnnouncementUpdater({item, onUpdate}) {

    console.log(item);

    const onSubmit = (data) => {


        console.log(data);
        const [categories, location] = [data.categories, data.location];

        delete data.location;
        delete data.categories;


        Promise.all([
            fetch(item._links.location.href).then(resp => resp.json()).then(resp => {
                return fetch(resp._links.self.href, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({location})
                });
            }),
            fetch(item._links.categories.href, {
                method: "PUT",
                headers: {
                    "Content-Type": "text/uri-list",
                    "Accept": "application/json"
                },
                body: /*[...*/categories.join("\n")/*.map(c => c._links.self.href)]*/
            }).then(resp=>{
                if(resp.ok){
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
                body: JSON.stringify(data)
            })
        ])

            .then(async resp => {
                const jsons = [];
                for(let i=0;i<resp.length;i++){
                    const ct = resp[i].headers.get("Content-Type");
                    console.log(ct);
                    let result;
                    if(ct && ct.indexOf("application/json")!==-1){
                        result = await resp[i].json();
                    }
                    else{
                        result = await resp[i].text();
                    }
                    jsons.push(result);
                }
                return jsons;
            })
            .then(jsons => {
                onUpdate({
                    categories: jsons[1]._embedded.categories,
                    location: jsons[0],
                    // ...JSON.parse(jsons[2])
                    // ...jsons
                    ...jsons[2]
                });
                console.log(jsons);
            })
            // .catch(err => alert(err));
    }

    return (
        <AnnouncementForm init={item} onSubmit={onSubmit}/>
    );
}