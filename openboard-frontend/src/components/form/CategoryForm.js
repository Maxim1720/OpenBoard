import {useEffect, useState} from "react";

export default function CategoryForm({item, onSubmit}) {

    const [formData, setFormData] = useState({name: ""});

    useEffect(() => {
        if(item){
            setFormData(item);
        }
    }, []);

    const onChange = (e)=>{
        console.log(e);
        const name = e.target.name;
        const value = e.target.value;

        setFormData(prevState => ({
            ...prevState,
            [name]:value
        }))
    }

    return(
        <form
            className=" text-center d-flex flex-column justify-content-between align-items-center"
            onSubmit={()=>{
            onSubmit(formData)
        }}>
            <div className="w-100 d-flex align-items-center justify-content-between p-2">
                {/*<label className="" htmlFor="name">Наименование</label>*/}
                <input className="form-control me-2" type="text" value={formData.name} onInput={onChange} name={"name"}
                placeholder={"Наименование категории"}
                />

            <div className="btn-group">
                <input className="btn btn-sm btn-success" type={"submit"} value={"Сохранить"}/>
            </div>
            </div>
        </form>
    );

}