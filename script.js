/* =====================================================
   LOACON - JAVASCRIPT
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       IMÁGENES CON FALLBACK
    ========================= */

    document.querySelectorAll("img[data-fallback]").forEach(img => {

        img.addEventListener("error", () => {

            const fallback = img.dataset.fallback;

            if (
                fallback &&
                img.src !== new URL(fallback, window.location.href).href
            ) {
                img.src = fallback;
                return;
            }

            img.style.display = "none";

            const parent = img.closest(".hero-image");

            if (parent) {

                const fallbackBox =
                    parent.querySelector(".hero-image-fallback");

                if (fallbackBox) {
                    fallbackBox.style.display = "flex";
                }
            }

            const logoFallback =
                img.closest(".logo")?.querySelector(".logo-fallback");

            if (logoFallback) {
                logoFallback.style.display = "block";
            }

        });

    });


    /* =========================
       MENÚ MÓVIL
    ========================= */

    const menuToggle =
        document.querySelector(".menu-toggle");

    const mainNav =
        document.querySelector(".main-nav");


    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {

            mainNav.classList.toggle("open");

        });


        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("open");

            });

        });

    }


    /* =====================================================
       SERVICIOS DINÁMICOS LOACON
    ===================================================== */

    const serviciosLoacon = {

    refrigeradores: {
        imagen: "imagenes/servicios/refrigeradores.png",
        icono: "❄",
        titulo: "Refrigerador",
        descripcion: "Diagnóstico, reparación y mantenimiento de refrigeradores.",
        opciones: [
            "✓ Diagnóstico de fallas",
            "✓ Mantenimiento preventivo",
            "✓ Reparación"
        ]
    },

    lavadoras: {
        imagen: "imagenes/servicios/lavadora.png",
        icono: "🧺",
        titulo: "Lavadora",
        descripcion: "Reparación de fallas, mantenimiento y revisión general.",
        opciones: [
            "✓ Diagnóstico",
            "✓ Reparación",
            "✓ Mantenimiento"
        ]
    },

    estufas: {
        imagen: "imagenes/servicios/estufa.png",
        icono: "🔥",
        titulo: "Estufa y/o horno",
        descripcion: "Servicio técnico para estufas, hornos y equipos de cocina.",
        opciones: [
            "✓ Diagnóstico",
            "✓ Reparación",
            "✓ Mantenimiento"
        ]
    },

    secadoras: {
        imagen: "imagenes/servicios/secadora.png",
        icono: "🌬️",
        titulo: "Secadora",
        descripcion: "Diagnóstico y reparación de secadoras domésticas.",
        opciones: [
            "✓ Diagnóstico",
            "✓ Reparación",
            "✓ Mantenimiento"
        ]
    },

    lavavajillas: {
        imagen: "imagenes/servicios/lavavajillas.png",
        icono: "💧",
        titulo: "Lavavajilla",
        descripcion: "Mantenimiento y reparación de lavavajillas.",
        opciones: [
            "✓ Diagnóstico",
            "✓ Reparación",
            "✓ Mantenimiento"
        ]
    },

    mantenimiento: {
        imagen: "imagenes/servicios/mantenimiento.png",
        icono: "🔧",
        titulo: "Mantenimiento",
        descripcion: "Mantenimiento preventivo para prolongar la vida de tus equipos.",
        opciones: [
            "✓ Revisión general",
            "✓ Mantenimiento preventivo",
            "✓ Recomendaciones técnicas"
        ]
    }

};


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const detalleImagen = document.getElementById("detalleImagen");    const detalleTitulo = document.getElementById("detalleTitulo");
    const detalleDescripcion = document.getElementById("detalleDescripcion");
    const detalleLista = document.getElementById("detalleLista");
    const detalleWhatsApp = document.getElementById("detalleWhatsApp");


/* =====================================================
   MOSTRAR SERVICIO
===================================================== */

function mostrarServicio(tipo) {

    const servicio = serviciosLoacon[tipo];

    if (!servicio) {
        console.error("Servicio no encontrado:", tipo);
        return;
    }

    /* =========================
       BOTÓN ACTIVO
    ========================= */

    document.querySelectorAll(".servicio-option").forEach(boton => {
        boton.classList.remove("active");
    });

    const botonActivo = document.querySelector(
        `.servicio-option[data-servicio="${tipo}"]`
    );

    if (botonActivo) {
        botonActivo.classList.add("active");
    }


    /* =========================
       IMAGEN
    ========================= */

    if (detalleImagen) {
        detalleImagen.src = servicio.imagen;
        detalleImagen.alt = servicio.titulo;
    }


    /* =========================
       INFORMACIÓN
    ========================= */

    if (detalleTitulo) {
        detalleTitulo.textContent = servicio.titulo;
    }

    if (detalleDescripcion) {
        detalleDescripcion.textContent = servicio.descripcion;
    }


    /* =========================
       LISTA
    ========================= */

    if (detalleLista) {

        detalleLista.innerHTML = "";

        servicio.opciones.forEach(opcion => {

            const elemento = document.createElement("div");

            elemento.textContent = opcion;

            detalleLista.appendChild(elemento);

        });

    }


    /* =========================
       WHATSAPP
    ========================= */

    if (detalleWhatsApp) {

        let equipo;

        switch (tipo) {

            case "refrigeradores":
                equipo = "mi refrigerador";
                break;

            case "lavadoras":
                equipo = "mi lavadora";
                break;

            case "estufas":
                equipo = "mi estufa u horno";
                break;

            case "secadoras":
                equipo = "mi secadora";
                break;

            case "lavavajillas":
                equipo = "mi lavavajillas";
                break;

            case "mantenimiento":
                equipo = "un servicio de mantenimiento";
                break;

            default:
                equipo = "mi electrodoméstico";
        }


        const mensaje =
            `Hola, LOACON. Me interesa solicitar servicio para ${equipo}.

Quisiera recibir información sobre disponibilidad, costo de diagnóstico y servicio a domicilio.

Gracias.`;


        detalleWhatsApp.href =
            "https://wa.me/525538827062?text=" +
            encodeURIComponent(mensaje);

    }


    /* =========================
       ANIMACIÓN
    ========================= */

    const detalle =
        document.getElementById("servicioDetalle");

    if (detalle) {

        detalle.style.opacity = "0";
        detalle.style.transform = "translateY(8px)";

        setTimeout(() => {

            detalle.style.opacity = "1";
            detalle.style.transform = "translateY(0)";

        }, 120);

    }

}
   /* =====================================================
   CLIC EN LOS SERVICIOS
===================================================== */

const botonesServicios = document.querySelectorAll(".servicio-option");

botonesServicios.forEach(boton => {

    boton.addEventListener("click", function () {

        const tipo = this.getAttribute("data-servicio");

        console.log("Servicio seleccionado:", tipo);

        mostrarServicio(tipo);

    });

});


/* =====================================================
   SERVICIO INICIAL
===================================================== */

mostrarServicio("refrigeradores");


/* =====================================================
   CIERRE DOMContentLoaded
===================================================== */

});