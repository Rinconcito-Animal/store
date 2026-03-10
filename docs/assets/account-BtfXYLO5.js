import{a as A,i as k,o as q,b as f,h as z,c as E,d as g,r as C,j as N,u as P,k as T,l as b,q as F,e as j,m as R,g as _,n as G}from"./whatsapp-BU_qbHFx.js";A();A();k();const $=document.querySelectorAll(".account-nav-btn"),Q=document.querySelectorAll(".account-section"),H=document.getElementById("profile-data"),v=document.getElementById("receipts-list"),L=document.getElementById("pets-grid"),d=document.getElementById("pet-modal"),p=document.getElementById("profile-modal"),h=document.getElementById("add-pet-form"),I=document.getElementById("edit-profile-form"),M=document.getElementById("open-pet-modal"),w=document.getElementById("close-pet-modal"),D=document.getElementById("open-profile-modal"),x=document.getElementById("close-profile-modal");let r=null;$.forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-target");$.forEach(a=>a.classList.remove("active")),t.classList.add("active"),Q.forEach(a=>a.classList.remove("active")),document.getElementById(e).classList.add("active")})});const i=(t,e)=>{e?t.classList.add("active"):t.classList.remove("active")};M&&M.addEventListener("click",()=>i(d,!0));w&&w.addEventListener("click",()=>i(d,!1));d&&d.addEventListener("click",t=>{t.target===d&&i(d,!1)});D&&D.addEventListener("click",()=>{r&&(document.getElementById("user-name").value=r.fullName||"",document.getElementById("user-email").value=r.email||"",document.getElementById("user-phone").value=r.phone||"",document.getElementById("user-address").value=r.address||""),i(p,!0)});x&&x.addEventListener("click",()=>i(p,!1));p&&p.addEventListener("click",t=>{t.target===p&&i(p,!1)});q(f,async t=>{t?(console.log("Usuario detectado:",t.uid),await B(t.uid)):(console.log("No hay usuario logueado, redirigiendo..."),window.location.href="/signup.html")});async function B(t){try{const e=await z(E(g,"users",t));e.exists()?(r=e.data(),W(r),J(r.pets||[]),await O()):(console.error("No se encontró el perfil en Firestore"),H.innerHTML="<p>Error al cargar el perfil. Por favor intenta de nuevo.</p>")}catch(e){console.error("Error cargando datos:",e)}}function W(t){H.innerHTML=`
        <div class="info-group">
            <span class="info-label">Nombre Completo</span>
            <span class="info-value">${t.fullName||"No especificado"}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Email</span>
            <span class="info-value">${t.email||"No especificado"}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Teléfono</span>
            <span class="info-value">${t.phone||"No especificado"}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Dirección de Despacho</span>
            <span class="info-value">${t.address||"No especificada"}</span>
        </div>
    `}function J(t){if(t.length===0){L.innerHTML='<p style="grid-column: 1/-1; text-align: center; opacity: 0.5;">Aún no has registrado mascotas.</p>';return}L.innerHTML=t.map((e,a)=>`
        <div class="pet-card">
            <div class="pet-img">
                <img src="${e.image||"https://images.unsplash.com/photo-1541364983171-a496838382d6?auto=format&fit=crop&q=80&w=400"}" alt="${e.name}">
                <button class="update-photo-btn" data-index="${a}" title="Actualizar Foto">
                    <span>📷</span>
                </button>
            </div>
            <div class="pet-info">
                <span class="pet-type">${e.species}</span>
                <h3 class="pet-name">${e.name}</h3>
                <p class="pet-meta">Nacimiento: ${e.birthdate}</p>
                ${e.breed?`<p class="pet-meta">Raza: ${e.breed}</p>`:""}
            </div>
        </div>
    `).join(""),document.querySelectorAll(".update-photo-btn").forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-index");K(a)})})}async function K(t){const e=f.currentUser;if(!e||!r)return;const a=document.createElement("input");a.type="file",a.accept="image/*",a.onchange=async c=>{const n=c.target.files[0];if(n)try{const o=document.querySelector(`.update-photo-btn[data-index="${t}"]`),s=o.innerHTML;o.innerHTML="<span>⏳</span>",o.disabled=!0;const l=C(N,`pets/${e.uid}/${Date.now()}_${n.name}`),m=await P(l,n),u=await T(m.ref),y=[...r.pets];y[t].image=u,await b(E(g,"users",e.uid),{pets:y}),await B(e.uid),alert("¡Foto actualizada con éxito!")}catch(o){console.error("Error al actualizar foto:",o),alert("Hubo un error al subir la foto.");const s=document.querySelector(`.update-photo-btn[data-index="${t}"]`);s.innerHTML="<span>📷</span>",s.disabled=!1}},a.click()}async function O(){const t=f.currentUser;if(t){v.innerHTML='<p style="text-align:center; opacity:0.5; padding:20px;">Cargando historial...</p>';try{const e=F(j(g,"orders"),R("userId","==",t.uid)),a=await _(e);if(a.empty){v.innerHTML='<p style="text-align:center; opacity:0.5; padding:20px;">Aún no tienes compras registradas.</p>';return}const c=a.docs.map(n=>n.data()).sort((n,o)=>{const s=n.createdAt?.toMillis?.()||0;return(o.createdAt?.toMillis?.()||0)-s});v.innerHTML=c.map(n=>{const o=n.items?n.items.map(l=>`${l.name} x${l.quantity}`).join(", "):"",s=n.deliveryDate?new Date(n.deliveryDate+"T00:00:00").toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"}):null;return`
            <div class="receipt-card">
                <div class="receipt-icon">📄</div>
                <div class="receipt-details">
                    <h4>Compra #${n.id||"N/A"}</h4>
                    <p>Fecha Compra: ${n.date||"Sin fecha"}</p>
                    ${s?`<p style="font-weight: 700; color: var(--accent-sage);">📅 Entrega: ${s} (18:00 - 22:00)</p>`:""}
                    <p style="font-size:0.8rem; opacity:0.7; margin-top:4px;">${o}</p>
                    <p style="font-size:0.8rem; opacity:0.7;">${n.paymentMethod||""} · ${n.deliveryMethod||""}${n.deliveryAddress?" · "+n.deliveryAddress:""}</p>
                </div>
                <div class="receipt-amount">$${(n.total||0).toLocaleString("es-CL")}</div>
                <div class="receipt-status status-completed">${n.status||"Completado"}</div>
            </div>`}).join("")}catch(e){console.error("Error cargando historial de compras:",e),v.innerHTML='<p style="text-align:center; color:#ff4444; padding:20px;">Error al cargar el historial. Intenta de nuevo más tarde.</p>'}}}I&&I.addEventListener("submit",async t=>{t.preventDefault();const e=f.currentUser;if(!e)return;const a={fullName:document.getElementById("user-name").value,phone:document.getElementById("user-phone").value,address:document.getElementById("user-address").value};try{await b(E(g,"users",e.uid),a),i(p,!1),B(e.uid),alert("Perfil actualizado correctamente")}catch(c){console.error("Error al actualizar perfil:",c),alert("Error al actualizar el perfil.")}});h&&h.addEventListener("submit",async t=>{t.preventDefault();const e=f.currentUser;if(!e)return;const a=h.querySelector('button[type="submit"]'),c=a.textContent,n=document.getElementById("pet-name").value,o=document.getElementById("pet-type").value,s=document.getElementById("pet-breed").value,l=document.getElementById("pet-age").value,m=document.getElementById("pet-image").files[0];try{a.disabled=!0,a.textContent="Subiendo...";let u="";if(m){const S=C(N,`pets/${e.uid}/${Date.now()}_${m.name}`),U=await P(S,m);u=await T(U.ref)}const y={name:n,species:o,breed:s,birthdate:l,image:u};await b(E(g,"users",e.uid),{pets:G(y)}),h.reset(),i(d,!1),B(e.uid),alert("Mascota registrada correctamente")}catch(u){console.error("Error al agregar mascota:",u),alert("Error al registrar la mascota.")}finally{a.disabled=!1,a.textContent=c}});
