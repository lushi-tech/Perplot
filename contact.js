// ==================================
// PERPLOT - FORMA E KONTAKTIT
// ==================================

// !!! NDRYSHO KËTU: emaili i biznesit ku do të vijnë mesazhet
const CONTACT_EMAIL = "info@perplot.al";

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contact-form");
    if (!form) return;

    const submitButton = document.getElementById("contact-submit");
    const statusEl = document.getElementById("form-status");

    const fields = {
        firstName: document.getElementById("contact-first-name"),
        lastName: document.getElementById("contact-last-name"),
        email: document.getElementById("contact-email"),
        phone: document.getElementById("contact-phone"),
        message: document.getElementById("contact-message")
    };

    const errorEls = {
        firstName: document.getElementById("err-first-name"),
        lastName: document.getElementById("err-last-name"),
        email: document.getElementById("err-email"),
        phone: document.getElementById("err-phone"),
        message: document.getElementById("err-message")
    };

    // ---------- Rregullat e validimit ----------
    // Çdo funksion kthen tekstin e gabimit, ose "" nëse vlera është në rregull.

    const validators = {

        firstName: (v) => validateName(v, "emrin"),

        lastName: (v) => validateName(v, "mbiemrin"),

        email: function (v) {
            if (v === "") return "Ju lutem shkruani adresën e emailit.";

            const emailPattern =
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

            if (!emailPattern.test(v)) {
                return "Adresa e emailit nuk është e vlefshme (p.sh. emri@shembull.com).";
            }
            return "";
        },

        // Opsional: validohet vetëm nëse është plotësuar
        phone: function (v) {
            if (v === "") return "";

            // heq hapësirat, vijat, kllapat dhe pikat
            const cleaned = v.replace(/[\s\-().]/g, "");

            // +355..., 00355... ose 06..., 04... (8 deri 15 shifra)
            if (!/^(\+|00)?[0-9]{8,15}$/.test(cleaned)) {
                return "Numri i telefonit nuk është i vlefshëm (p.sh. +355 69 123 4567).";
            }
            return "";
        },

        message: function (v) {
            if (v === "") return "Ju lutem shkruani mesazhin tuaj.";
            if (v.length < 10) return "Mesazhi duhet të ketë të paktën 10 karaktere.";
            if (v.length > 2000) return "Mesazhi është shumë i gjatë (maksimumi 2000 karaktere).";
            return "";
        }
    };

    function validateName(v, label) {
        if (v === "") return "Ju lutem shkruani " + label + ".";
        if (v.length < 2) return "Të paktën 2 shkronja.";
        // vetëm shkronja (përfshirë ë, ç), hapësira, apostrof dhe viza
        if (!/^[\p{L}][\p{L}\s'’-]*$/u.test(v)) {
            return "Lejohen vetëm shkronja.";
        }
        return "";
    }

    function validateField(name) {
        const value = fields[name].value.trim();
        const error = validators[name](value);

        errorEls[name].textContent = error;
        fields[name].classList.toggle("invalid", error !== "");
        fields[name].setAttribute("aria-invalid", error !== "" ? "true" : "false");

        return error === "";
    }

    // Validim gjatë shkrimit/largimit nga fusha
    Object.keys(fields).forEach(function (name) {
        fields[name].addEventListener("blur", function () {
            validateField(name);
        });

        fields[name].addEventListener("input", function () {
            if (fields[name].classList.contains("invalid")) {
                validateField(name);
            }
        });
    });


    // ---------- Statusi ----------
    function setStatus(type, html) {
        statusEl.className = type;
        statusEl.innerHTML = html;
    }


    // ---------- Dërgimi ----------
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        setStatus("", "");

        // Kontrollo të gjitha fushat
        const results = Object.keys(fields).map(function (name) {
            return { name: name, valid: validateField(name) };
        });

        const firstInvalid = results.find(r => !r.valid);
        if (firstInvalid) {
            fields[firstInvalid.name].focus();
            return;
        }

        // Honeypot: nëse është plotësuar, është bot
        if (form.elements["_honey"].value !== "") {
            form.reset();
            return;
        }

        const payload = {
            "Emri": fields.firstName.value.trim(),
            "Mbiemri": fields.lastName.value.trim(),
            "Email": fields.email.value.trim(),
            "Telefoni": fields.phone.value.trim() || "(nuk është dhënë)",
            "Mesazhi": fields.message.value.trim(),
            "_subject": "Mesazh i ri nga faqja Përplot - " +
                fields.firstName.value.trim() + " " + fields.lastName.value.trim(),
            "_replyto": fields.email.value.trim(),
            "_template": "table",
            "_captcha": "false"
        };

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Po dërgohet...';

        try {
            const response = await fetch(
                "https://formsubmit.co/ajax/" + encodeURIComponent(CONTACT_EMAIL),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok || data.success === "false" || data.success === false) {
                throw new Error(data.message || "Dërgimi dështoi.");
            }

            setStatus("success", "Faleminderit! Mesazhi u dërgua me sukses. Do t'ju përgjigjemi sa më shpejt.");
            form.reset();

            Object.keys(fields).forEach(function (name) {
                fields[name].classList.remove("invalid");
                errorEls[name].textContent = "";
            });

        } catch (error) {
            console.error("Gabim gjatë dërgimit:", error);

            setStatus(
                "error",
                'Mesazhi nuk u dërgua. Provoni përsëri ose na shkruani direkt te ' +
                '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.'
            );

        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Dërgo';
        }
    });
});