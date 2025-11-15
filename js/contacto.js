function validarFormularios(evento) {
    evento.preventDefault();
    let nombre = document.querySelector("input[name='nombre']").value.trim();
    let email = document.querySelector("input[name='correo']").value.trim();
    let mensaje = document.querySelector("textarea[name='mensaje']").value.trim();
    if (nombre == "" || email == "" || mensaje == "") { alert("Por favor, complete todos los campos."); return false; }
    let emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) { alert("Por favor, ingrese un email válido."); return false; }
    alert("Enviando Formulario...");
    evento.target.submit();
    return true;
}
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector("form.contact-form");
    if (formulario) { formulario.addEventListener('submit', validarFormularios); } else { console.error("ERROR: No se encontró el formulario. Revise que tenga la clase 'contact-form'."); }
});
function validarFormularios(evento) {
    evento.preventDefault();

    let nombre = document.querySelector("input[name='nombre']").value.trim();
    let email = document.querySelector("input[name='correo']").value.trim();
    let mensaje = document.querySelector("textarea[name='mensaje']").value.trim();
    
    if (nombre == "" || email == "" || mensaje == "") {
        alert("Por favor, complete todos los campos.");
        return false;
    }

    let emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(email)) {
        alert("Por favor, ingrese un email válido.");
        return false;
    }
    alert("Enviando Formulario...");
    evento.target.submit();
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.querySelector("form.contact-form");

    if (formulario) {

        formulario.addEventListener('submit', validarFormularios);
    } else {
        console.error("ERROR: No se encontró el formulario. Revise que tenga la clase 'contact-form'.");
    }
});
