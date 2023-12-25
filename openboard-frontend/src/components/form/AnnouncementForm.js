import React, { useCallback, useEffect, useState } from "react";
import Loading from "../utils/Loading";

export default function AnnouncementForm({ init, onSubmit}) {
  console.log(init);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    ...(init
      ? init
      : {
          title: "",
          description: "",
          categories: [],
          location: {
            city: "",
            region: "",
          },
        }),
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const onInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onInputLocation = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(form);
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const loadLocation = useCallback(async ()=>{
    const resp = await fetch(init._links.location.href);
    const json = await resp.json();
    return json;
  }, [init]);

  const loadAllCategories = useCallback(async ()=>{
    const resp = await fetch("http://localhost:8080/categories");
    const json = await resp.json();
    console.log(json);
    return json._embedded.categories;
  }, []);

  useEffect(() => {
    loadAllCategories().then(categories => {
      setCategories(categories);
      if (init) {
        loadLocation().then(l => {
          setForm(prevState => ({
            ...prevState,
            ...init,
            location: l
          }));
          setIsLoaded(true);
        });
      } else {
        setIsLoaded(true);
      }
    });
  }, [init, loadAllCategories, loadLocation]);

  useEffect(() => {
    if (init) {
      setForm(prevState => ({
        ...prevState,
        ...init,
        location: init._links.location.href
      }));
    }
  }, [init]);



  if (!isLoaded) {
    return (
      <div
        className="position-absolute
            d-flex flex-column justify-content-center align-items-center
             z-1 bg-opacity-25
             bg-dark w-100 h-100"
      >
        <Loading />
      </div>
    );
  }
  return (
    <form
      className="d-flex flex-column justify-content-center form-control"
      onSubmit={(e) => {
        console.log(form);
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="form-label">
        <label className="form-label" htmlFor="title">
          Заголовок
        </label>
        <input
          className="form-control"
          name="title"
          value={form.title?form.title: "Лол"}
          required={true}
          onInput={onInput}
        />
      </div>

      <div className="form-label">
        <label className="form-label" htmlFor="description">
          Описание
        </label>
        <input
          className="form-control"
          name="description"
          value={form.description}
          onInput={onInput}
          required={true}
        />
      </div>

      <div className="form-label">
        <label className="form-label" htmlFor="description">
          Категории
        </label>
        <select
          name="categories"
          className="form-select form-select-lg text-center"
          required={true}
          value={form.categories /*.map(c=>c._links.self.href)*/}
          onInput={(e) => {
            console.log(e);
            onInput({
              target: {
                name: e.target.name,
                value: (e.target.value = Array.from(
                  e.target.selectedOptions
                ).map((o) => o.value)),
              },
            });
          }}
          multiple={true}
        >
          {categories.map((i) => (
            <option
              key={i._links.self.href /*.split('/').reverse()[0]*/}
              value={i._links.self.href}
            >
              {i.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-control">
        <label className="form-label" htmlFor="location">
          Местоположение
        </label>
        <div>
          <label className="form-label" htmlFor="city">
            Город
          </label>
          <input
            className="form-control"
            name="city"
            value={form.location ? form.location.city : ''}
            required={true}
            onInput={onInputLocation}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="region">
            Район
          </label>
          <input
            className="form-control"
            name="region"
            value={form.location ? form.location.region : ''}
            required={true}
            onInput={onInputLocation}
          />
        </div>
      </div>

      <input
        type="submit"
        className="btn btn-success"
        data-bs-dismiss="modal"
      />
    </form>
  );
}