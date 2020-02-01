//get all id from format
/*console.log(form[0].elements);
const elements = form[0].elements;
for (element in elements) {
  if (elements[element].id) {
    console.log(elements[element].id);
  }
}*/

let DB;

const form = document.getElementsByTagName("form");
const mascota = document.querySelector("#mascota");
const cliente = document.querySelector("#cliente");
const telefono = document.querySelector("#telefono");
const fecha = document.querySelector("#fecha");
const hora = document.querySelector("#hora");
const sintomas = document.querySelector("#sintomas");

document.addEventListener("DOMContentLoaded", () => {
  let create_db = window.indexedDB.open("citas", 1);
  create_db.onerror = function() {
    console.error("Error db!");
  };

  create_db.onsuccess = function() {
    DB = create_db.result;
    console.info("Db creted ok!");
    console.log(DB);
  };
  //Using run once to avoid changes when reload page
  create_db.onupgradeneeded = function() {
    console.log("Only Once");
  };
});
