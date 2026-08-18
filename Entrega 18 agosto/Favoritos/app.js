document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("favoritos");
    const getFavoritos = () => JSON.parse(localStorage.getItem("favoritos")) || [];

    const favoritos = getFavoritos();
    const usuariosFavoritos = favoritos.filter((item) => item && item.login && item.login.uuid);

    if (!usuariosFavoritos.length) {
        contenedor.innerHTML = "<p class='vacio'>No hay usuarios favoritos todavía.</p>";
        return;
    }

    usuariosFavoritos.forEach((usuario) => {
        const card = document.createElement("article");
        card.classList.add("favorito-card");

        const imagen = document.createElement("img");
        imagen.src = usuario.picture.large;
        imagen.alt = "Foto de " + usuario.name.first;
        imagen.classList.add("favorito-img");

        const info = document.createElement("div");
        info.classList.add("favorito-info");

        const nombre = document.createElement("h2");
        nombre.textContent = usuario.name.first + " " + usuario.name.last;

        const email = document.createElement("p");
        email.textContent = usuario.email;

        const boton = document.createElement("button");
        boton.textContent = "Quitar favorito";
        boton.classList.add("quitar");

        boton.addEventListener("click", () => {
            const actuales = getFavoritos();
            const nuevos = actuales.filter((item) => {
                const id = typeof item === "string" ? item : item?.login?.uuid;
                return id !== usuario.login.uuid;
            });

            localStorage.setItem("favoritos", JSON.stringify(nuevos));
            card.remove();

            if (!document.querySelector(".favorito-card")) {
                contenedor.innerHTML = "<p class='vacio'>No hay usuarios favoritos todavía.</p>";
            }
        });

        card.addEventListener("click", () => {
            localStorage.setItem("usuarioSeleccionado", JSON.stringify(usuario));
            window.location.href = "../usuarios/Tarjetas Random User/index.html";
        });

        boton.addEventListener("click", (evento) => {
            evento.stopPropagation();
        });

        info.appendChild(nombre);
        info.appendChild(email);
        info.appendChild(boton);

        card.appendChild(imagen);
        card.appendChild(info);
        contenedor.appendChild(card);
    });
});
