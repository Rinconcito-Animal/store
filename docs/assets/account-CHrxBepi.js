import{i as y}from"./navbar-Cq2JaEci.js";y();const v={name:"Juan Pérez",email:"juan.perez@email.com",phone:"+56 9 1234 5678",address:"Calle Los Aromos 123, Providencia, Santiago"},E=[{id:"BOL-2026-001",date:"15 Feb 2026",amount:65e3,status:"Completado"},{id:"BOL-2026-045",date:"02 Feb 2026",amount:15e3,status:"Completado"},{id:"BOL-2026-102",date:"20 Jan 2026",amount:42500,status:"Completado"}],L=[{name:"Max",type:"Perro",breed:"Golden Retriever",age:"3 años",image:"https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400"},{name:"Luna",type:"Gato",breed:"Siamés",age:"2 años",image:"https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400"}],l=document.querySelectorAll(".account-nav-btn"),B=document.querySelectorAll(".account-section"),I=document.getElementById("profile-data"),c=document.getElementById("receipts-list"),h=document.getElementById("pets-grid"),a=document.getElementById("pet-modal"),o=document.getElementById("add-pet-form"),d=document.getElementById("open-pet-modal"),r=document.getElementById("close-pet-modal"),n=document.getElementById("profile-modal"),m=document.getElementById("edit-profile-form"),p=document.getElementById("open-profile-modal"),u=document.getElementById("close-profile-modal");l.forEach(e=>{e.addEventListener("click",()=>{const s=e.getAttribute("data-target");l.forEach(t=>t.classList.remove("active")),e.classList.add("active"),B.forEach(t=>t.classList.remove("active")),document.getElementById(s).classList.add("active")})});openModalBtn&&closeModalBtn&&a&&(openModalBtn.addEventListener("click",()=>{a.classList.add("active")}),closeModalBtn.addEventListener("click",()=>{a.classList.remove("active")}),a.addEventListener("click",e=>{e.target===a&&a.classList.remove("active")}));d&&r&&a&&(d.addEventListener("click",()=>{a.classList.add("active")}),r.addEventListener("click",()=>{a.classList.remove("active")}),a.addEventListener("click",e=>{e.target===a&&a.classList.remove("active")}));p&&u&&n&&(p.addEventListener("click",()=>{const e=JSON.parse(localStorage.getItem("user_profile"))||v;document.getElementById("user-name").value=e.name,document.getElementById("user-email").value=e.email,document.getElementById("user-phone").value=e.phone,document.getElementById("user-address").value=e.address,n.classList.add("active")}),u.addEventListener("click",()=>{n.classList.remove("active")}),n.addEventListener("click",e=>{e.target===n&&n.classList.remove("active")}));function g(){const e=JSON.parse(localStorage.getItem("user_profile"))||v;I.innerHTML=`
        <div class="info-group">
            <span class="info-label">Nombre Completo</span>
            <span class="info-value">${e.name}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Email</span>
            <span class="info-value">${e.email}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Teléfono</span>
            <span class="info-value">${e.phone}</span>
        </div>
        <div class="info-group">
            <span class="info-label">Dirección de Despacho</span>
            <span class="info-value">${e.address}</span>
        </div>
    `}function S(){const s=[...JSON.parse(localStorage.getItem("purchase_history"))||[],...E];if(s.length===0){c.innerHTML='<p style="text-align: center; opacity: 0.5; margin-top: 40px;">No tienes compras registradas</p>';return}c.innerHTML=s.map(t=>`
        <div class="receipt-card">
            <div class="receipt-icon">📄</div>
            <div class="receipt-details">
                <h4>Compra #${t.id}</h4>
                <p>Fecha: ${t.date}</p>
                ${t.items?`<p style="font-size: 0.8rem; opacity: 0.5;">${t.items.map(i=>`${i.quantity}x ${i.name}`).join(", ")}</p>`:""}
            </div>
            <div class="receipt-amount">$${t.total?t.total.toLocaleString("es-CL"):t.amount.toLocaleString("es-CL")}</div>
            <div class="receipt-status status-completed">${t.status}</div>
        </div>
    `).join("")}function f(){const s=[...JSON.parse(localStorage.getItem("user_pets"))||[],...L];h.innerHTML=s.map(t=>`
        <div class="pet-card">
            <div class="pet-img">
                <img src="${t.image||"https://images.unsplash.com/photo-1541364983171-a496838382d6?auto=format&fit=crop&q=80&w=400"}" alt="${t.name}">
            </div>
            <div class="pet-info">
                <span class="pet-type">${t.type} • ${t.breed}</span>
                <h3 class="pet-name">${t.name}</h3>
                <p class="pet-meta">Edad: ${t.age}</p>
            </div>
        </div>
    `).join("")}o&&o.addEventListener("submit",e=>{e.preventDefault();const s={name:document.getElementById("pet-name").value,type:document.getElementById("pet-type").value,breed:document.getElementById("pet-breed").value,age:document.getElementById("pet-age").value,image:document.getElementById("pet-image").value},t=JSON.parse(localStorage.getItem("user_pets"))||[];t.unshift(s),localStorage.setItem("user_pets",JSON.stringify(t)),o.reset(),a.classList.remove("active"),f()});m&&m.addEventListener("submit",e=>{e.preventDefault();const s={name:document.getElementById("user-name").value,email:document.getElementById("user-email").value,phone:document.getElementById("user-phone").value,address:document.getElementById("user-address").value};localStorage.setItem("user_profile",JSON.stringify(s)),n.classList.remove("active"),g()});document.addEventListener("DOMContentLoaded",()=>{g(),S(),f()});
