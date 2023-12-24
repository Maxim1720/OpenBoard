import CategoryForm from "./form/CategoryForm";
import { useState } from "react";

export default function AnnouncementItemCategory({ category, onUpdate }) {
  const [deleted, setDeleted] = useState(false);

  const hexChars = "0123456789abcdef";

  let hex = "#";

  let bgColor = hex;

  for (let i = 0; i < 6; i++) {
    bgColor += hexChars[Math.floor(Math.random() * hexChars.length)];
  }
  let color =
    hex +
    (Number(bgColor[1]) >= 8 || isNaN(Number(bgColor[1])) ? "0" : "f").repeat(
      6
    );

  const deleteArray = async (url, name) => {
    const resp = await fetch(url);
    const json = await resp.json();
    const arr = [...json._embedded[name]];

    arr.forEach(async (item) => {
      const resp = await fetch(item._links.self.href, { method: "DELETE" });
    });
  };

  const deleteCategory = async () => {
    // Получаем все объявления, связанные с категорией
    const announcementsResponse = await fetch(
      category._links.announcements.href
    );
    const announcementsJson = await announcementsResponse.json();
    const announcements = announcementsJson._embedded.announcements;

    // Удаляем связи между объявлениями и категорией
    await Promise.all(
      announcements.map(async (announcement) => {
        const response = await fetch(announcement._links.self.href, {
          method: "DELETE",
          body: JSON.stringify({ categories: [] }),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          console.error(
            `Failed to remove category from announcement with id ${announcement.id}`
          );
        }
      })
    );

    // Удаляем категорию
    const deleteCategoryResponse = await fetch(category._links.self.href, {
      method: "DELETE",
    });
    if (!deleteCategoryResponse.ok) {
      console.error(`Failed to delete category with id ${category.id}`);
    } else {
      onUpdate();
    }
  };

  return (
    <>
      <li
        className="list-unstyled rounded-1 ps-2 pe-2 col-sm-12 col-md-12"
        key={category._links.self.href.split("/").reverse()[0]}
        style={{
          backgroundColor: bgColor,
        }}
      >
        <button
          key={category}
          type="button"
          data-bs-toggle="modal"
          data-bs-target={
            "#categoryForm" + category._links.self.href.split("/").reverse()[0]
          }
          className="w-100 btn text-break"
          style={{
            color: color,
          }}
        >
          {category.name}
        </button>

        <div
          className="modal fade"
          // data-bs-backdrop="static"
          data-bs-keyboard="false"
          id={
            "categoryForm" + category._links.self.href.split("/").reverse()[0]
          }
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="d-flex justify-content-center">
                  <CategoryForm
                    item={category}
                    onSubmit={(data) => {
                      fetch(category._links.self.href, {
                        method: "PATCH",
                        headers: {
                          "content-type": "application/json",
                          accept: "application/json",
                        },
                        body: JSON.stringify(data),
                      }).then((resp) => {
                        if (resp.ok) {
                          window.location.reload();
                        } else {
                          resp.json().then((json) => alert(json.message));
                        }
                      });
                    }}
                  />
                  <button
                    className="btn btn-outline-danger h-100 align-self-center"
                    type="submit"
                    data-bs-dismiss="modal"
                    onClick={(e) => {
                      console.log("click!");
                      if (!deleted) {
                        // Promise.all(
                        //   Object.keys(category._links)
                        //     .filter((k) => !["self", "category"].includes(k))
                        //     .map((key) =>
                        //       fetch(category._links[key].href, {
                        //         method: key.endsWith("s") ? "PATCH" : "DELETE",
                        //         headers: {
                        //           "Content-Type": "text/uri-list",
                        //           Accept: "application/json",
                        //         },
                        //         body: [],
                        //       })
                        //     )
                        // ).then((resp) => {
                        //   console.log(resp);
                        //   fetch(category._links.self.href, {
                        //     method: "DELETE",
                        //   })
                        //     .then((r) => r.json())
                        //     .then((j) => {
                        //       console.log(j);
                        //       setDeleted(true);
                        //       // window.location.reload();
                        //     });
                        // });
                        deleteCategory();
                      }
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
