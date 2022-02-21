let nav = 0;
let clicked = null;
let events = window.localStorage.getItem("events")
  ? JSON.parse(window.localStorage.getItem("events"))
  : [];

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const calender = document.querySelector(".calender");
const newEventModal = document.getElementById("newEventModal");
const backDropModal = document.querySelector(".modal");
const deleteEventModal = document.getElementById("deleteEventModal");
const eventTitleInput = document.getElementById("eventTitleInput");

function openModal(date) {
  clicked = date;
  const isEvent = events.find((e) => e.date === clicked);

  if (isEvent) {
    document.getElementById("eventText").innerText = isEvent.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }
  backDropModal.style.display = "block";
}

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  backDropModal.style.display = "none";
  deleteEventModal.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");
    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function load() {
  const date = new Date();

  if (nav !== 0) {
    date.setMonth(new Date().getMonth() + nav);
  }

  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  console.log(firstDayOfMonth);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  console.log(daysInMonth);
  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  console.log(dateString);
  const paddedDays = weekdays.indexOf(dateString.split(", ")[0]);
  console.log(paddedDays);

  const monthStr =
    firstDayOfMonth.toLocaleDateString("en-us", { month: "long" }) +
    ", " +
    year;

  document.querySelector(".monthDisplay").innerText = monthStr;

  calender.innerHTML = "";

  for (let i = 1; i <= paddedDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${i - paddedDays}/${month + 1}/${year}`;

    if (i > paddedDays) {
      daySquare.innerText = i - paddedDays;
      if (i - paddedDays === new Date().getDate() && nav === 0)
        daySquare.id = "currentDay";
      const isEvent = events.find((e) => e.date === dayString);
      if (isEvent) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = isEvent.title;
        daySquare.appendChild(eventDiv);
      }
      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }
    // console.log(daySquare);
    calender.appendChild(daySquare);
  }
}

function initializeBtn() {
  document.querySelector(".back").addEventListener("click", () => {
    nav--;
    load();
  });

  document.querySelector(".next").addEventListener("click", () => {
    nav++;
    load();
  });

  document
    .getElementById("saveButton")
    .addEventListener("click", () => saveEvent());

  document
    .getElementById("cancelButton")
    .addEventListener("click", () => closeModal());

  document
    .getElementById("closeButton")
    .addEventListener("click", () => closeModal());

  document
    .getElementById("deleteButton")
    .addEventListener("click", () => deleteEvent());
}

initializeBtn();
load();
