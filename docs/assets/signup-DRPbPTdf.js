import{i as S,p as q,a as I,r as x,h as C,u as N,j as A,t as P,b as D,d as F}from"./navbar-CZ8R87mY.js";S();const i=document.getElementById("email-signup-form"),L=document.getElementById("pets-container"),R=document.getElementById("add-pet-btn"),l=document.getElementById("toggle-password"),c=document.getElementById("password");l&&c&&l.addEventListener("click",()=>{const e=c.getAttribute("type")==="password"?"text":"password";c.setAttribute("type",e),l.querySelector(".icon").textContent=e==="password"?"👁️":"🔒"});R.addEventListener("click",()=>{const e=document.createElement("div");e.className="pet-entry",e.innerHTML=`
        <div class="form-group">
            <label>Nombre de la Mascota</label>
            <input type="text" class="pet-name" placeholder="Ej: Pelusa" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Especie</label>
                <select class="pet-species" required>
                    <option value="">Selecciona</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>
            <div class="form-group">
                <label>Fecha Nacimiento (Aprox.)</label>
                <input type="date" class="pet-birthdate" required>
            </div>
        </div>
        <div class="form-group" style="margin-top: 15px;">
            <label>Foto de la Mascota</label>
            <input type="file" class="pet-image" accept="image/*" required>
        </div>
    `,L.appendChild(e)});i.addEventListener("submit",async e=>{e.preventDefault();const v=document.getElementById("fullName").value,f=document.getElementById("address").value,E=document.getElementById("phone").value,d=document.getElementById("email").value,w=document.getElementById("password").value,u=document.querySelectorAll(".pet-entry");try{const t=i.querySelector('button[type="submit"]'),s=t.textContent;t.disabled=!0,t.textContent="Creando cuenta...";const n=(await q(I,d,w)).user;t.textContent="Subiendo fotos...";const p=[];for(let r=0;r<u.length;r++){const o=u[r],m=o.querySelector(".pet-name").value.trim(),g=o.querySelector(".pet-species").value,y=o.querySelector(".pet-birthdate").value,a=o.querySelector(".pet-image").files[0];if(m!==""||g!==""||y!==""||a){let b="";if(a){const h=x(C,`pets/${n.uid}/${Date.now()}_${a.name}`),B=await N(h,a);b=await A(B.ref)}p.push({name:m,species:g,birthdate:y,image:b})}}await P(D(F,"users",n.uid),{fullName:v,address:f,phone:E,email:d,pets:p,createdAt:new Date().toISOString()}),console.log("Usuario registrado con email y guardado en Firestore:",n),alert("¡Registro exitoso!"),window.location.href="/account.html"}catch(t){console.error("Error en registro de email:",t),alert("Error: "+t.message);const s=i.querySelector('button[type="submit"]');s.disabled=!1,s.textContent="Registrarse"}});
