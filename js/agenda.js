const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

/* =========================================
   WHATSAPP LOACON
   ========================================= */

const WHATSAPP = "525538827062";

/* =========================================
   CALENDARIO
   ========================================= */

function renderCalendar() {

    calendarDays.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleDateString("es-MX", {
        month: "long",
        year: "numeric"
    });

    monthYear.textContent =
        monthName.charAt(0).toUpperCase() + monthName.slice(1);


    // Primer día del mes
    const firstDay = new Date(year, month, 1);

    // Último día
    const lastDay = new Date(year, month + 1, 0);

    // Convertimos domingo = 0 a lunes = 0
    let startDay = firstDay.getDay();

    if (startDay === 0) {
        startDay = 6;
    } else {
        startDay--;
    }


    // Días vacíos antes del primer día
    for (let i = 0; i < startDay; i++) {

        const empty = document.createElement("div");

        calendarDays.appendChild(empty);
    }


    // Fecha de hoy
    const today = new Date();

    today.setHours(0, 0, 0, 0);


    // =========================================
    // PRIMER DÍA DISPONIBLE = MAÑANA
    // =========================================

    const minDate = new Date(today);

    minDate.setDate(minDate.getDate() + 1);
    minDate.setHours(0, 0, 0, 0);


    // =========================================
    // DÍAS DEL MES
    // =========================================

    for (let day = 1; day <= lastDay.getDate(); day++) {

        const button = document.createElement("button");

        button.type = "button";
        button.textContent = day;


        const date = new Date(year, month, day);

        date.setHours(0, 0, 0, 0);


        // =========================================
        // FECHAS NO DISPONIBLES
        // Hoy y fechas anteriores
        // =========================================

        if (date < minDate) {

            button.classList.add("disabled");
            button.disabled = true;

        } else {

            // =========================================
            // FECHA SELECCIONADA
            // =========================================

            if (
                selectedDate &&
                date.getTime() === selectedDate.getTime()
            ) {

                button.classList.add("selected");

            }


            // =========================================
            // SELECCIONAR FECHA
            // =========================================

            button.addEventListener("click", () => {

                selectedDate = date;

                renderCalendar();

            });

        }


        calendarDays.appendChild(button);
    }
}


/* =========================================
   CAMBIAR MES
   ========================================= */

prevMonth.addEventListener("click", () => {

    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    renderCalendar();

});


nextMonth.addEventListener("click", () => {

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    renderCalendar();

});


/* =========================================
   HORARIOS
   ========================================= */

const timeSelect =
    document.getElementById("horario");


timeSelect.addEventListener("change", () => {

    selectedTime = timeSelect.value;

});


/* =========================================
   FOTOGRAFÍAS
   ========================================= */

const photoInput =
    document.getElementById("fotos");

const preview =
    document.getElementById("preview");


/* =========================================
   CONFIGURACIÓN CLOUDINARY
   ========================================= */

const CLOUDINARY_CLOUD_NAME = "nhkedhtw";
const CLOUDINARY_UPLOAD_PRESET = "loacon_fotos";


/* =========================================
   VISTA PREVIA DE FOTOS
   ========================================= */

photoInput.addEventListener("change", () => {

    preview.innerHTML = "";

    const files = Array.from(photoInput.files);

    files.forEach(file => {

        if (!file.type.startsWith("image/")) {
            return;
        }

        const reader = new FileReader();

        reader.onload = event => {

            const image =
                document.createElement("img");

            image.src = event.target.result;
            image.alt = "Fotografía seleccionada";

            preview.appendChild(image);

        };

        reader.readAsDataURL(file);

    });

});


/* =========================================
   SUBIR FOTOS A CLOUDINARY
   ========================================= */

async function subirFotosCloudinary() {

    const files =
        Array.from(photoInput.files);

    if (files.length === 0) {
        return [];
    }

    const urls = [];

    for (const file of files) {

        if (!file.type.startsWith("image/")) {
            continue;
        }

        const formData =
            new FormData();

        formData.append(
            "file",
            file
        );

        formData.append(
            "upload_preset",
            CLOUDINARY_UPLOAD_PRESET
        );

        const response =
            await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData
                }
            );

        if (!response.ok) {
            throw new Error(
                "No se pudo subir una de las fotografías."
            );
        }

        const data =
            await response.json();

        urls.push(data.secure_url);
    }

    return urls;
}

/* =========================================
   FORMULARIO
   ========================================= */

const form =
    document.getElementById("appointmentForm");


/* =========================================
   GENERAR FOLIO
   ========================================= */

function generarFolio() {

    const ahora = new Date();

    const fecha =
        ahora.getFullYear().toString() +
        String(ahora.getMonth() + 1).padStart(2, "0") +
        String(ahora.getDate()).padStart(2, "0");

    let consecutivo =
        parseInt(localStorage.getItem("loaconConsecutivo")) || 0;

    consecutivo++;

    localStorage.setItem(
        "loaconConsecutivo",
        consecutivo
    );

    return `LOA-${fecha}-${String(consecutivo).padStart(3, "0")}`;
}


form.addEventListener("submit", async event => {

    event.preventDefault();

    const folio = generarFolio();

    console.log("Folio generado:", folio);


    // =========================================
    // VALIDAR FECHA
    // =========================================

        if (!selectedDate) {

        alert("Selecciona una fecha para tu cita.");

        return;
    }


    // =========================================
    // VALIDAR HORARIO
    // =========================================

    if (!selectedTime) {

        alert("Selecciona un horario para tu cita.");

        return;
    }


    // =========================================
    // OBTENER DATOS
    // =========================================

    const formData =
        new FormData(form);


    const nombre =
        formData.get("nombre") || "No proporcionado";

    const telefono =
        formData.get("telefono") || "No proporcionado";

    const electrodomestico =
        formData.get("electrodomestico") || "No proporcionado";

    const marca =
        formData.get("marca") || "No proporcionada";

    const servicio =
        formData.get("servicio") || "No proporcionado";

    const direccion =
        formData.get("direccion") || "No proporcionada";

    const referencias =
         formData.get("referencias") || "Sin referencias";

    const comentarios =
        formData.get("descripcion") || "Sin comentarios";

        /* =========================================
   SUBIR FOTOGRAFÍAS
   ========================================= */

let fotosUrls = [];

try {

    fotosUrls =
        await subirFotosCloudinary();

} catch (error) {

    console.error(
        "Error al subir fotografías:",
        error
    );

    alert(
        "No se pudieron subir las fotografías. " +
        "Por favor intenta nuevamente."
    );

    return;
}

    // =========================================
    // FORMATO DE FECHA
    // =========================================

    const fecha =
        selectedDate.toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });


    // =========================================
    // MENSAJE PARA WHATSAPP
    // =========================================

    const mensaje = `
🔧 *SOLICITUD DE SERVICIO - LOACON*

🎫 *FOLIO:*
${folio}

👤 *Cliente:*
${nombre}

📱 *Teléfono:*
${telefono}

🏠 *Electrodoméstico:*
${electrodomestico}

🏷️ *Marca:*
${marca}

🛠️ *Servicio solicitado:*
${servicio}

📅 *Fecha solicitada:*
${fecha}

⏰ *Horario:*
${selectedTime}

📍 *Dirección Completa:*
${direccion}

📌 *Referencias:*
${referencias}

📝 *Comentarios:*
${comentarios}

${fotosUrls.length > 0
    ? `📸 *Fotografías del equipo:*
${fotosUrls.map((url, index) =>
    `${index + 1}. ${url}`
).join("\n")}`
    : ""
}

━━━━━━━━━━━━━━━━━━
Solicitud enviada desde LOACON`;


    // Codificar mensaje
    const mensajeCodificado =
        encodeURIComponent(mensaje);


    // =========================================
    // CREAR ENLACES DE WHATSAPP
    // =========================================

    const urlWhatsApp =
    `https://wa.me/${WHATSAPP}?text=${mensajeCodificado}`;

    

    // =========================================
    // ABRIR WHATSAPP
    // =========================================

    window.open(urlWhatsApp, "_blank");


    // =========================================
    // CONFIRMACIÓN
    // =========================================

    alert(
    "¡Solicitud preparada!\n\n" +
    "Folio: " + folio + "\n\n" +
    "Cliente: " + nombre + "\n" +
    "Fecha: " + fecha + "\n" +
    "Horario: " + selectedTime + "\n\n" +
    "Se abrirán las conversaciones de WhatsApp para enviar tu solicitud."
);

});


/* =========================================
   INICIAR
   ========================================= */

renderCalendar();