import { useCallback, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap";
import Loading from "./utils/Loading";
import AnnouncementItem from "./AnnouncementItem";
import AnnouncementCreator from "./AnnouncementCreator";
import CategoryForm from "./form/CategoryForm";

export default function Announcements() {
  const [loadState, setLoadState] = useState({
    items: [],
    isLoaded: false,
  });

  const fetchItems = useCallback(async () => {
    try {
          const resp = await fetch(process.env.REACT_APP_API_ANNOUNCEMENTS);
          if (!resp.ok) {
              throw new Error(resp.statusText);
          }
          const json = await resp.json();
          console.log(json);
          return json._embedded.announcements;
      } catch (error) {
          return { error };
      }
  }, []);


  const loadItems = useCallback(()=>{
    fetchItems().then((resp) => {
      let loadStateData;
      if (resp.hasOwnProperty("error")) {
        loadStateData = {
          error: resp.error,
        };
      } else {
        loadStateData = {
          items: resp,
          isLoaded: true,
        };
      }
      setLoadState({
        ...loadStateData,
      });

    });
  }, [fetchItems])

  useEffect(() => {
    loadItems()
  }, [loadItems]);

  if (loadState.error) {
    alert(loadState.error.message);
  } else if (!loadState.isLoaded) {
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

  const renderItems = () =>
    loadState.items.map((i) => (
      <AnnouncementItem
        item={i}
        key={i._links.self.href}
        onEdit={() => {
          loadItems();
        }}
      />
    ));

  return (
    <div
      style={{ backgroundColor: "#ffffff" }}
      className="h-100 min-vh-100 d-flex flex-column justify-content-between
        p-2"
    >
      <ul className="row row-gap-1 m-0 p-0 h-100 flex-grow-1">
        {loadState.items.length ? (
          renderItems()
        ) : (
          <li className="d-flex flex-column align-items-center justify-content-center">
            <h2>Пока что объявлений нет</h2>
          </li>
        )}
      </ul>

      <button
        className="btn border border-success shadow align-self-center"
        data-bs-target="#createForm"
        data-bs-toggle="modal"
      >
        Создать новое
      </button>

      <div className="modal fade" id="createForm">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#announcement"
                >
                  Объявление
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#category">
                  Категория
                </a>
              </li>
            </ul>

            <div className="tab-content shadow-lg p-2">
              <div className="tab-pane active" id="announcement">
                <AnnouncementCreator
                  onCreate={() => {
                    fetchItems().then((json) => {
                      setLoadState((prevState) => ({
                        isLoaded: prevState.isLoaded,
                        items: json,
                      }));
                    });
                  }}
                />
              </div>
              <div className="tab-pane" id="category">
                <CategoryForm
                  onSubmit={(data) => {
                    fetch(process.env.REACT_APP_API_CATEGORIES, {
                      method: "POST",
                      headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(data),
                    })
                      .then(() => {})
                      .catch((error) => alert(error));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
