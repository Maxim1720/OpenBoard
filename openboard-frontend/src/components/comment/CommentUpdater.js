import CommentForm from "../form/CommentForm";


function CommentUpdater({item}) {

    return(
        <div>
            <h2>Обновите комментарий</h2>
            <CommentForm init={item} onSubmit={(data)=>{
                fetch(item._links.self.href, {
                    method: "PATCH",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(data)
                })
                    .then(resp=>{
                        window.location.reload();
                    })
            }}/>
        </div>
    );

}