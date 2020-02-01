//get all id from format
/*console.log(form[0].elements);
const elements = form[0].elements;
for (element in elements) {
  if (elements[element].id) {
    console.log(elements[element].id);
  }
}*/

let DB;

const form = document.querySelector("form");
const mascota = document.querySelector("#mascota");
const cliente = document.querySelector("#cliente");
const telefono = document.querySelector("#telefono");
const fecha = document.querySelector("#fecha");
const hora = document.querySelector("#hora");
const sintomas = document.querySelector("#sintomas");
const citas = document.querySelector("#citas");
const admin = document.querySelector("#administra");

document.addEventListener("DOMContentLoaded", () => {
  let create_db = window.indexedDB.open("citas", 1);
  create_db.onerror = function() {
    console.error("Error db!");
  };

  create_db.onsuccess = function() {
    DB = create_db.result;
    showCitas();
  };
  //Using run once to avoid changes when reload page
  create_db.onupgradeneeded = function(e) {
    console.log("Only Once");
    let db = e.target.result;
    //create index
    let objectStore = db.createObjectStore("citas", {
      keyPath: "key",
      autoIncrement: true
    });

    objectStore.createIndex("mascota", "mascota", { unique: false });
    objectStore.createIndex("cliente", "cliente", { unique: false });
    objectStore.createIndex("telefono", "telefono", { unique: true });
    objectStore.createIndex("fecha", "fecha", { unique: false });
    objectStore.createIndex("hora", "hora", { unique: false });
    objectStore.createIndex("sintomas", "sintomas", { unique: false });
  };
});
console.log(form);
form.addEventListener("submit", e => {
  e.preventDefault();
  const newCita = {
    mascota: mascota.value,
    cliente: cliente.value,
    telefono: telefono.value,
    fecha: fecha.value,
    hora: hora.value,
    sintomas: sintomas.value
  };
  console.log(newCita);
  let transaction = DB.transaction(["citas"], "readwrite");
  let objectStore = transaction.objectStore("citas");
  console.log(objectStore);
  let petition = objectStore.add(newCita);
  petition.onsuccess = () => {
    form.reset();
  };
  transaction.oncomplete = () => {
    showCitas();
    console.info("Cita added!");
  };
  transaction.onerror = () => {
    console.error("ERROR Cita NOT added!");
  };
});

function showCitas() {
  //Clean citas block if any
  while (citas.firstChild) {
    citas.removeChild(citas.firstChild);
  }

  let objectStore = DB.transaction("citas").objectStore("citas");

  objectStore.openCursor().onsuccess = function(e) {
    let cursor = e.target.result;
    if (cursor) {
      let citaHTML = document.createElement("li");
      citaHTML.setAttribute("data-cita-id", cursor.value.key);
      citaHTML.classList.add("list-group-item");
      citaHTML.innerHTML = `
        <p class="font-weight-bold">mascota: <span class="font-weight-normal">${cursor.value.mascota}</span></p>
        <p class="font-weight-bold">cliente: <span class="font-weight-normal">${cursor.value.cliente}</span></p>
        <p class="font-weight-bold">telefono: <span class="font-weight-normal">${cursor.value.telefono}</span></p>
        <p class="font-weight-bold">fecha: <span class="font-weight-normal">${cursor.value.fecha}</span></p>
        <p class="font-weight-bold">hora: <span class="font-weight-normal">${cursor.value.hora}</span></p>
        <p class="font-weight-bold">sintomas: <span class="font-weight-normal">${cursor.value.sintomas}</span></p>
        `;
      const btn = document.createElement("button");
      btn.classList.add("btn", "btn-danger");
      btn.innerHTML = '<span aria-hidden="true">x</span> Delete';
      btn.onclick = deleteCita;
      citaHTML.appendChild(btn);
      citas.appendChild(citaHTML);
      cursor.continue();
      admin.textContent = "";
    } else {
      if (!citas.firstChild) {
        admin.textContent = "Add Citas to List";
        let p = document.createElement("p");
        p.classList.add("alert", "alert-warning", "text-center");
        p.textContent = "NO Citas! Add new!";
        citas.appendChild(p);
      } else {
        admin.textContent = "Edit Citas";
      }
    }
  };
}

function deleteCita(e) {
  let cita_id = e.target.parentElement.getAttribute("data-cita-id");
  console.log(e.target.parentElement.getAttribute("data-cita-id"));
}
