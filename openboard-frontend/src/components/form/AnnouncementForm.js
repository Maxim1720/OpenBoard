import React, { useCallback, useEffect, useState } from "react";
import Loading from "../utils/Loading";

export default function AnnouncementForm({ init, onSubmit }) {
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

    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  useEffect(() => {
    fetch("http://localhost:8080/categories")
      .then((resp) => resp.json())
      .then((json) => {
        setCategories([...json._embedded.categories]);
        setForm((prev) => ({
          ...(init ? init : prev),
          location: init
            ? init.location
              ? init.location
              : prev.location
            : prev.location,
        }));
        setIsLoaded(true);
      })
      .then(() => console.log(form))
      .catch((error) => alert(error.message));
  }, []);

  //     const onSubmit = (e) => {

  //     onSubmit(form);
  //   };

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
          value={form.title}
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
            value={form.location.city}
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
            value={form.location.region}
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

// export default class AnnouncementForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loaded: {
//         categories: [],
//       },
//       form: {
//         title: "",
//         description: "",
//         categories: [],
//         location: {
//           city: "",
//           region: "",
//         },
//       },
//       isLoaded: false,
//     };
//   }

//   onInput = (e) => {
//     let name = e.target.name;
//     let value = e.target.value;

//     this.setState(
//       (prev) => ({
//         ...prev,
//         form: {
//           ...prev.form,
//           [name]: value,
//         },
//       }),
//       () => console.log(this.state)
//     );
//   };

//   onInputLocation = (e) => {
//     let name = e.target.name;
//     let value = e.target.value;

//     this.setState((prev) => ({
//       ...prev,
//       form: {
//         ...prev.form,
//         location: {
//           ...prev.form.location,
//           [name]: value,
//         },
//       },
//     }));
//   };
//   componentDidMount() {
//     console.log(this.props.init);

//     fetch("http://localhost:8080/categories")
//       .then((resp) => resp.json())
//       .then((json) => {
//         this.setState(
//           (prev) => ({
//             ...prev,
//             form: {
//               location: this.props.init
//                 ? this.props.init.location
//                   ? this.props.init.location
//                   : prev.form.location
//                 : prev.form.location,
//               ...(this.props.init ? this.props.init : prev.form),
//             },
//             loaded: {
//               categories: [...json._embedded.categories],
//             },
//             isLoaded: true,
//           }),
//           () => {
//             console.log(this.state);
//           }
//         );
//       })
//       .then(() => console.log(this.state))
//       .catch((error) => alert(error.message));
//   }

//   onSubmit = (e) => {
//     e.preventDefault();
//     this.props.onSubmit(this.state.form);
//   };
//   render() {
//     if (!this.state.isLoaded) {
//       return (
//         <div
//           className="position-absolute
//             d-flex flex-column justify-content-center align-items-center
//              z-1 bg-opacity-25
//              bg-dark w-100 h-100"
//         >
//           <Loading />
//         </div>
//       );
//     }
//     return (
//       <form
//         className="d-flex flex-column justify-content-center form-control"
//         onSubmit={this.onSubmit}
//       >
//         <div className="form-label">
//           <label className="form-label" htmlFor="title">
//             Заголовок
//           </label>
//           <input
//             className="form-control"
//             name="title"
//             value={this.state.form.title}
//             required={true}
//             onInput={this.onInput}
//           />
//         </div>

//         <div className="form-label">
//           <label className="form-label" htmlFor="description">
//             Описание
//           </label>
//           <input
//             className="form-control"
//             name="description"
//             value={this.state.form.description}
//             onInput={this.onInput}
//             required={true}
//           />
//         </div>

//         <div className="form-label">
//           <label className="form-label" htmlFor="description">
//             Категории
//           </label>
//           <select
//             name="categories"
//             className="form-select form-select-lg text-center"
//             required={true}
//             value={this.state.form.categories /*.map(c=>c._links.self.href)*/}
//             onInput={(e) => {
//               console.log(e);
//               this.onInput({
//                 target: {
//                   name: e.target.name,
//                   value: (e.target.value = Array.from(
//                     e.target.selectedOptions
//                   ).map((o) => o.value)),
//                 },
//               });
//             }}
//             multiple={true}
//           >
//             {this.state.loaded.categories.map((i) => (
//               <option
//                 key={i._links.self.href /*.split('/').reverse()[0]*/}
//                 value={i._links.self.href}
//               >
//                 {i.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-control">
//           <label className="form-label" htmlFor="location">
//             Местоположение
//           </label>
//           <div>
//             <label className="form-label" htmlFor="city">
//               Город
//             </label>
//             <input
//               className="form-control"
//               name="city"
//               value={this.state.form.location.city}
//               required={true}
//               onInput={this.onInputLocation}
//             />
//           </div>
//           <div>
//             <label className="form-label" htmlFor="region">
//               Район
//             </label>
//             <input
//               className="form-control"
//               name="region"
//               value={this.state.form.location.region}
//               required={true}
//               onInput={this.onInputLocation}
//             />
//           </div>
//         </div>

//         <input
//           type="submit"
//           className="btn btn-success"
//           data-bs-dismiss="modal"
//         />
//       </form>
//     );
//   }
// }
