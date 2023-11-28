import CategoryForm from "./form/CategoryForm";

export default function AnnouncementItemCategory({category}) {

    const hexChars = "0123456789abcdef";

    let hex = "#";

    for (let i = 0; i < 6; i++) {
        hex += hexChars[Math.floor(Math.random() * hexChars.length)];
    }

    return (
        <>
            <li className="list-unstyled rounded-1 ps-2 pe-2 col-sm-12 col-md-12"
                key={category._links.self.href.split('/').reverse()[0]}
                style={
                    {
                        backgroundColor: hex
                    }
                }
            >

                <button key={category}
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target={"#categoryForm"+category._links.self.href.split('/').reverse()[0]}
                        className="w-100 btn text-break">
                {category.name}
                </button>

                <div className="modal fade"
                    // data-bs-backdrop="static"
                     data-bs-keyboard="false"
                     id={"categoryForm" + category._links.self.href.split('/').reverse()[0]}>

                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="d-flex justify-content-center">
                                    <CategoryForm item={category} onSubmit={data => {
                                        fetch(category._links.self.href, {
                                            method: "PATCH",
                                            headers: {
                                                "content-type": "application/json",
                                                "accept": "application/json"
                                            },
                                            body: JSON.stringify(data)
                                        }).then(resp => {
                                            if (resp.ok) {
                                                window.location.reload();
                                            } else {
                                                resp.json().then(json => alert(json.message));
                                            }
                                        })
                                    }}/>
                                    <button
                                        className="btn btn-outline-danger h-100 align-self-center"
                                        type="submit"
                                        onClick={(e)=>{
                                           /* Promise.all(Object.keys(category._links)
                                                .filter(k=>!["self", "category"].includes(k))
                                                .map(key=>fetch(category._links[key].href, {
                                                            method: key.endsWith("s") ? "PATCH" : "DELETE",
                                                            headers: {
                                                                "Content-Type": "text/uri-list",
                                                                "Accept": "application/json"
                                                            },
                                                            body: []
                                                        }
                                                    )
                                                )
                                            )*/
                                            /*fetch()
                                                .then(resp=>{
                                                    console.log(resp);
                                                    fetch(category._links.self.href, {
                                                        method:"DELETE"
                                                    })
                                                        .then(r=>r.json())
                                                        .then(j=>{
                                                            console.log(j);
                                                            // window.location.reload();
                                                        });
                                                })*/
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

            </li>


        </>

    );

}