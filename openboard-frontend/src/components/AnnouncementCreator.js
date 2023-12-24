import AnnouncementForm from "./form/AnnouncementForm";

export default function AnnouncementCreator({ onCreate }) {
  return (
    <AnnouncementForm
      onSubmit={(form) => {
        Promise.all([postLocation(form.location), postAnnouncement(form)])
          .then(async (resp) => {
            return resp.map(async (i) => await i.json());
          })
          .then(async (resp) => {
            const locationResp = await resp[0];
            // resp.forEach((r) => console.log(r));
            let locationHref = locationResp._links.self.href;

            const announcementResp = await resp[1];

            const addLocation = await fetch(announcementResp._links.self.href, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({ location: locationHref }),
            });
            console.log(addLocation);
            const json = await addLocation.json();
            console.log(json);
            // putAnnouncement(await resp[1], locationHref)
            //     .then(resp => console.log(resp))
            //     .catch(err => alert(err.message));
            onCreate();
          })
        //   .catch((error) => alert(error.message + " " + error.cause));
        console.log("Creating data...");
      }}
    />
  );
}

const postLocation = (location) => {
  console.log(location);
  return fetch(process.env.REACT_APP_API_LOCATIONS, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(location),
  });
};

const postAnnouncement = (i) => {
  return fetch(process.env.REACT_APP_API_ANNOUNCEMENTS, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(i),
  });
};

const putAnnouncement = (announcement, locationHref) => {
  console.log(locationHref);
  return fetch(announcement._links.location.href, {
    method: "PUT",
    headers: {
      "Content-Type": "text/uri-list",
    },
    body: locationHref,
  });
};
