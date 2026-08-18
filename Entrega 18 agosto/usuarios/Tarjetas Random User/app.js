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

    let usuarioActual = null;
    let botonFavoritoRef = null;

    const actualizarEstrella = () => {
        if (!usuarioActual || !botonFavoritoRef) return;

        if (esFavorito(usuarioActual)) {
            botonFavoritoRef.textContent = "★";
            botonFavoritoRef.classList.add("active");
        } else {
            botonFavoritoRef.textContent = "☆";
            botonFavoritoRef.classList.remove("active");
        }
    };

    try {
        const usuarioGuardado = localStorage.getItem("usuarioSeleccionado");

        let usuario = null;

        if (usuarioGuardado) {
            usuario = JSON.parse(usuarioGuardado);
        } else {
            const res = await axios.get("https://randomuser.me/api/");
            usuario = res.data.results[0];
        }

        usuarioActual = usuario;

        const tarjeta = document.querySelector(".tarjeta");
        const botonFavorito = document.createElement("button");
        botonFavorito.type = "button";
        botonFavorito.classList.add("profile-favorite");

        botonFavoritoRef = botonFavorito;

        actualizarEstrella();

        botonFavorito.addEventListener("click", () => {
            if (esFavorito(usuarioActual)) {
                guardarFavorito(usuarioActual, false);
            } else {
                guardarFavorito(usuarioActual, true);
            }
            actualizarEstrella();
        });

        tarjeta.prepend(botonFavorito);

        document.getElementById("foto").src = usuario.picture.large;
        document.getElementById("nombre").textContent = usuario.name.first + " " + usuario.name.last;
        document.getElementById("correo").textContent = usuario.email;
        document.getElementById("telefono").textContent = usuario.phone;
        document.getElementById("celular").textContent = usuario.cell;

        const nacimiento = new Date(usuario.dob.date);
        document.getElementById("fechaNacimiento").textContent = nacimiento.toLocaleDateString("es-CO");
        document.getElementById("edad").textContent = usuario.dob.age + " años";

        document.getElementById("ubicacion").textContent = usuario.location.city + ", " + usuario.location.state;
        document.getElementById("codigoPostal").textContent = usuario.location.postcode + " - " + usuario.location.country;

        const registro = new Date(usuario.registered.date);
        document.getElementById("registro").textContent = registro.toLocaleDateString("es-CO");
        document.getElementById("registroEdad").textContent = usuario.registered.age + " años";

        document.getElementById("identificacion").textContent = usuario.id.name + ": " + usuario.id.value;
    } catch (error) {
        console.error("Error al cargar el usuario:", error);
    }
});

// Actualizar estrella cuando volvemos a la página (desde favoritos)
window.addEventListener("pageshow", () => {
    actualizarEstrella();
});