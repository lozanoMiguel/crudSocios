"use strict";
const btnEnviar = document.getElementById("submit");
const cerrar = document.getElementById("cerrar");
const infoBack = document.getElementById("backInfo");
const sociosBack = document.getElementById("backSocios");
const modalInfo = document.querySelector(".modal-info");
const nombre = document.getElementById("name").value;

const socios = document.getElementById("socios");
const modalSocios = document.querySelector(".modal-tabla");

socios.addEventListener("click", (e)=>{
	e.preventDefault();
	sociosBack.classList.add("show");
	modalSocios.style.animation = "aparecerModal 1s forwards";
	if(document.querySelectorAll(".tabla-item")){
		for(let item of document.querySelectorAll(".tabla-item")){
			modalSocios.removeChild(item);
		}
	 }
	leerObjetos();
});

window.addEventListener("keydown", cerrarTabla, false);

function cerrarTabla(key){
	if(key.keyCode == "27"){
		sociosBack.classList.remove("show");
		modalSocios.removeAttribute("style");
	}
}

btnEnviar.addEventListener("click", (e)=>{
	e.preventDefault();
	infoBack.classList.add("show");
	modalInfo.style.animation = "aparecerModal 1s forwards";
	let socio = ingresoSocio();
	addObjeto(socio);
});

cerrar.addEventListener("click", (e)=>{
	e.preventDefault();
	infoBack.classList.remove("show");
	modalInfo.removeAttribute("style");
});

/* index db*/

const IDBRequest = indexedDB.open("proyectoDb", 1);

IDBRequest.addEventListener("upgradeneeded", ()=>{
	const db = IDBRequest.result;
	db.createObjectStore("socios",{
		autoIncrement: true
	});
});

IDBRequest.addEventListener("success", ()=>{
	console.log("todo salió correctamente");
});

IDBRequest.addEventListener("error", ()=>{
	console.log("ocurrió un error al abrir la base de datos");
});

const getIDBData = (mode,msg) =>{
	const db = IDBRequest.result;
	const IDBtransaction = db.transaction("socios", mode);
	const objectStore = IDBtransaction.objectStore("socios");
	IDBtransaction.addEventListener("complete", ()=>{
		console.log(msg);
	});
	return objectStore;
};

const addObjeto = objeto => {
	const IDBData = getIDBData("readwrite", "Objeto creado correctamente");
	IDBData.add(objeto);
};

const leerObjetos = () =>{
	const IDBData = getIDBData("readonly");
	const cursor = IDBData.openCursor();
	
	cursor.addEventListener("success", ()=>{
		if(cursor.result){
			leerSocios(cursor.result.key ,cursor.result.value);
			cursor.result.continue();
		} else console.log("todos los datos fueron leidos")
	});
};

const modificarObjeto = (key, objeto) => {
	const IDBData = getIDBData("readwrite", "Objeto modificado correctamente");
	IDBData.put(objeto, key);
};	

const eliminarObjeto = key => {
	const IDBData = getIDBData("readwrite","Objeto eliminado correctamente");
	IDBData.delete(key);
};

const ingresoSocio = () => {
	let objeto = {nombre:`${window.document.getElementById("name").value}`,
				  apellido:`${window.document.getElementById("lastName").value}`,
				  dni: `${window.document.getElementById("dni").value}`,
				  email: `${window.document.getElementById("email").value}`,
				  nroSocio:`${window.document.getElementById("nroSocio").value}`};
	return objeto;
}

/*desde la funcion de leer los datos de indexDB, vamos a hacer la funcion de modificar y eliminar*/

const leerSocios = (key, objeto)=> {
	let nya = document.createElement("DIV");
	let nroSocio = document.createElement("DIV");
	let email = document.createElement("DIV");
	let botonera = document.createElement("DIV");
	let btnEditar = document.createElement("BUTTON");
	let btnEliminar = document.createElement("BUTTON");

	let frag = document.createDocumentFragment();

	nya.classList.add("tabla-item");
	nroSocio.classList.add("tabla-item");
	email.classList.add("tabla-item");
	botonera.classList.add("tabla-item");

	nya.setAttribute("name", "nya");
	nroSocio.setAttribute("name", "nroSocio");
	email.setAttribute("name", "email");

	btnEditar.classList.add("boton");
	btnEliminar.classList.add("boton");

	nya.innerHTML = `${objeto.nombre} ${objeto.apellido}`;
	nroSocio.innerHTML = `${objeto.nroSocio}`;
	email.innerHTML = `${objeto.email}`;
	btnEditar.innerHTML = "editar";
	btnEliminar.innerHTML = "eliminar";
	botonera.appendChild(btnEditar);
	botonera.appendChild(btnEliminar);
	botonera.setAttribute("id", `${objeto.dni}`);

	frag.appendChild(nya);
	frag.appendChild(nroSocio);
	frag.appendChild(email);
	frag.appendChild(botonera);

	modalSocios.appendChild(frag);

	btnEditar.addEventListener("dblclick", (e)=>{
		nroSocio.setAttribute("contenteditable", "true");
		nroSocio.setAttribute("spellcheck", "false");
		email.setAttribute("contenteditable", "true");
		email.setAttribute("spellcheck", "false");
		nya.setAttribute("contenteditable", "true");
		nya.setAttribute("spellcheck", "false");
		btnEditar.innerHTML = "guardar";
	});

	btnEditar.addEventListener("click", (e)=>{
		objeto.nroSocio = nroSocio.textContent;
		objeto.email = email.textContent;
		let cadena = nya.textContent.split(" ", 2);
		objeto.nombre = cadena[0];
		objeto.apellido = cadena[1];
		modificarObjeto(key,objeto);
		nroSocio.setAttribute("contenteditable", "false");
		btnEditar.innerHTML = "editar";
	});

	btnEliminar.addEventListener("click", (e)=>{
		modalSocios.removeChild(nya);
		modalSocios.removeChild(nroSocio);
		modalSocios.removeChild(email);
		modalSocios.removeChild(botonera);
		eliminarObjeto(key);
	})

}








