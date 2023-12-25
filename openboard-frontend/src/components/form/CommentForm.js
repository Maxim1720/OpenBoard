import {useState} from "react";

export default function CommentForm({init, onSubmit}) {

    const [formData, setFormData] = useState({
        text: ''
    });

    if (init) {
        setFormData(init);
    }

    const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        console.log(`${name} : ${value}`);
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <form className="form-control d-flex flex-column" onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
            setFormData({text: ""})
        }}>
            <div className="form-label">
                <label className="form-label" htmlFor="text">Введите текст комментария</label>
                <textarea className="form-control" name="text" value={formData.text} onInput={(e) => {
                    onChange(e);
                }
                }/>
            </div>
            <input className="btn btn-success" type={"submit"} value={"Комментировать"}/>
        </form>
    );
}


