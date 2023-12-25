import CommentForm from "../form/CommentForm";

export default function CommentCreator({announcement, onCreate}){

    const onSubmit = (data)=> {

        const body = {
            ...data,
            announcement: {
                href: announcement._links.self.href
            }
        };
        console.log(body);

        fetch("http://localhost:8080/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                accept: "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(r => r.json())
            .then(r=>{
                console.log(r);

                fetch(r._links.announcement.href, {
                    method:"PUT",
                    headers:{
                        "Content-Type":"text/uri-list",
                        accept: "application/json"
                    },
                    body: announcement._links.self.href
                })
                    .then(resp=>{
                        console.log(resp);
                        onCreate();
                    })
                    .catch(er=>alert(er));


            })
        .catch(err => alert(err.message));
        // onCreate();
    }

    return(
        <div className="">
            <h4 className="text-center text-bg-success rounded-2">Напишите комментарий к объявлению!</h4>
            <CommentForm announcement={announcement} onSubmit={(data)=> {
                Promise.resolve(onSubmit(data)).then(r => onCreate())

            }
            }/>
        </div>

    );

}