document.addEventListener("DOMContentLoaded", async () => {
    const getFavoritos = () => JSON.parse(localStorage.getItem("favoritos")) || [];

    const esFavorito = (usuario) => {
        const favoritos = getFavoritos();

        return favoritos.some((item) => {
            const id = typeof item === "string" ? item : item?.login?.uuid;
            return id === usuario.login.uuid;
        });
    };

    const guardarFavorito = (usuario, activar) => {
        const favoritosActuales = getFavoritos();

        if (activar) {
            const yaExiste = favoritosActuales.some((item) => {
                const id = typeof item === "string" ? item : item?.login?.uuid;
                return id === usuario.login.uuid;
            });

            if (!yaExiste) {
                favoritosActuales.push(usuario);
            }
        } else {
            const nuevos = favoritosActuales.filter((item) => {
                const id = typeof item === "string" ? item : item?.login?.uuid;
                return id !== usuario.login.uuid;
            });

            localStorage.setItem("favoritos", JSON.stringify(nuevos));
            return;
        }

        localStorage.setItem("favoritos", JSON.stringify(favoritosActuales));
    };

    try {
        const respuesta = await fetch("https://randomuser.me/api/?results=100");
        const datos = await respuesta.json();

        const listaUsuarios = document.getElementById("usuarios");

        datos.results.forEach((usuario) => {
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("user-card");
            tarjeta.setAttribute("data-uuid", usuario.login.uuid);

            const favorito = document.createElement("button");
            favorito.classList.add("favorite-button");
            favorito.textContent = "☆";

            if (esFavorito(usuario)) {
                favorito.textContent = "★";
                favorito.classList.add("active");
            }

            favorito.addEventListener("click", (evento) => {
                evento.stopPropagation();

                if (esFavorito(usuario)) {
                    guardarFavorito(usuario, false);
                    favorito.textContent = "☆";
                    favorito.classList.remove("active");
                } else {
                    guardarFavorito(usuario, true);
                    favorito.textContent = "★";
                    favorito.classList.add("active");
                }
            });

            const imagen = document.createElement("img");
            imagen.classList.add("user-image");
            imagen.src = usuario.picture.large;
            imagen.alt = "Foto de " + usuario.name.first;

            const informacion = document.createElement("div");
            informacion.classList.add("user-info");

            const nombre = document.createElement("h2");
            nombre.textContent = usuario.name.first + " " + usuario.name.last;

            const genero = document.createElement("p");
            genero.textContent = "Género: " + usuario.gender;

            const edad = document.createElement("p");
            edad.textContent = "Edad: " + usuario.dob.age;

            informacion.appendChild(nombre);
            informacion.appendChild(genero);
            informacion.appendChild(edad);

            tarjeta.appendChild(favorito);
            tarjeta.appendChild(imagen);
            tarjeta.appendChild(informacion);

            tarjeta.addEventListener("click", () => {
                localStorage.setItem("usuarioSeleccionado", JSON.stringify(usuario));
                window.location.href = "../Tarjetas Random User/index.html";
            });

            listaUsuarios.appendChild(tarjeta);
        });
    } catch (error) {
        console.error("Error al cargar los usuarios:", error);
    }

    // Actualizar estado cuando volvemos a la página (desde favoritos o cualquier otro lado)
    window.addEventListener("pageshow", () => {
        document.querySelectorAll(".user-card").forEach((tarjeta) => {
            const botonFav = tarjeta.querySelector(".favorite-button");
            const uuidGuardado = tarjeta.getAttribute("data-uuid");

            if (!botonFav || !uuidGuardado) return;

            const favoritos = getFavoritos();
            const esActualmenteFavorito = favoritos.some((item) => {
                const id = typeof item === "string" ? item : item?.login?.uuid;
                return id === uuidGuardado;
            });

            if (esActualmenteFavorito) {
                botonFav.textContent = "★";
                botonFav.classList.add("active");
            } else {
                botonFav.textContent = "☆";
                botonFav.classList.remove("active");
            }
        });
    });
});