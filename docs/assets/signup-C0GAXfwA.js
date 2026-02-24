import{i as S,n as q,a as I,r as x,h as C,u as N,j as A,p as P,f as D,d as F}from"./navbar-BaqoyTjM.js";S();const l=document.getElementById("email-signup-form"),L=document.getElementById("pets-container"),R=document.getElementById("add-pet-btn"),i=document.getElementById("toggle-password"),c=document.getElementById("password");i&&c&&i.addEventListener("click",()=>{const e=c.getAttribute("type")==="password"?"text":"password";c.setAttribute("type",e),i.querySelector(".icon").textContent=e==="password"?"👁️":"🔒"});R.addEventListener("click",()=>{const e=document.createElement("div");e.className="pet-entry",e.innerHTML=`
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
    `,L.appendChild(e)});l.addEventListener("submit",async e=>{e.preventDefault();const g=document.getElementById("fullName").value,y=document.getElementById("address").value,v=document.getElementById("phone").value,d=document.getElementById("email").value,b=document.getElementById("password").value,u=document.querySelectorAll(".pet-entry");try{const t=l.querySelector('button[type="submit"]'),a=t.textContent;t.disabled=!0,t.textContent="Creando cuenta...";const s=(await q(I,d,b)).user;t.textContent="Subiendo fotos...";const p=[];for(let n=0;n<u.length;n++){const o=u[n],f=o.querySelector(".pet-name").value,E=o.querySelector(".pet-species").value,w=o.querySelector(".pet-birthdate").value,r=o.querySelector(".pet-image").files[0];let m="";if(r){const h=x(C,`pets/${s.uid}/${Date.now()}_${r.name}`),B=await N(h,r);m=await A(B.ref)}p.push({name:f,species:E,birthdate:w,image:m})}await P(D(F,"users",s.uid),{fullName:g,address:y,phone:v,email:d,pets:p,createdAt:new Date().toISOString()}),console.log("Usuario registrado con email y guardado en Firestore:",s),alert("¡Registro exitoso!"),window.location.href="/account.html"}catch(t){console.error("Error en registro de email:",t),alert("Error: "+t.message);const a=l.querySelector('button[type="submit"]');a.disabled=!1,a.textContent="Registrarse"}});
