import{i as I}from"./navbar-xBuXVDAC.js";class k{constructor(){this.items=JSON.parse(localStorage.getItem("cart_items"))||[],this.listeners=[]}save(){localStorage.setItem("cart_items",JSON.stringify(this.items)),this.notify()}addItem(t){const a=this.items.find(s=>s.id===t.id);a?a.quantity+=1:this.items.push({...t,quantity:1}),this.save()}removeItem(t){this.items=this.items.filter(a=>a.id!==t),this.save()}updateQuantity(t,a){const s=this.items.find(n=>n.id===t);s&&(s.quantity=Math.max(1,a),this.save())}clear(){this.items=[],this.save()}getTotal(){return this.items.reduce((t,a)=>t+a.price*a.quantity,0)}getCount(){return this.items.reduce((t,a)=>t+a.quantity,0)}subscribe(t){this.listeners.push(t)}notify(){this.listeners.forEach(t=>t(this.items))}}const o=new k;I();const B=document.getElementById("cart-toggle"),S=document.getElementById("cart-close"),T=document.getElementById("cart-drawer"),f=document.getElementById("cart-overlay"),y=document.getElementById("cart-items"),w=document.getElementById("cart-count"),x=document.getElementById("cart-total-amount");function m(){T.classList.toggle("active"),f.classList.toggle("active")}function L(e){if(w.textContent=o.getCount(),x.textContent=`$${o.getTotal().toLocaleString("es-CL")}`,e.length===0){y.innerHTML='<p style="text-align: center; opacity: 0.5; margin-top: 40px;">Tu carrito está vacío</p>';return}y.innerHTML=e.map(t=>`
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${t.image}" alt="${t.name}">
          </div>
          <div class="cart-item-info">
            <h4>${t.name}</h4>
            <p>$${t.price.toLocaleString("es-CL")}</p>
            <div class="cart-quantity-controls">
              <button class="qty-btn" onclick="updateQty(${t.id}, ${t.quantity-1})">-</button>
              <span>${t.quantity}</span>
              <button class="qty-btn" onclick="updateQty(${t.id}, ${t.quantity+1})">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="removeItem(${t.id})">&times;</button>
        </div>
      `).join("")}async function M(){if(o.items.length===0){alert("Tu carrito está vacío. ¡Agrega algunos productos antes de comprar!");return}if(!confirm("¿Confirmas que deseas finalizar tu compra?"))return;const t={id:`BOL-${new Date().getFullYear()}-${Math.floor(Math.random()*9e3)+1e3}`,date:new Date().toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"}),items:o.items.map(s=>({name:s.name,quantity:s.quantity,price:s.price})),total:o.getTotal(),status:"Completado"},a=JSON.parse(localStorage.getItem("purchase_history"))||[];a.unshift(t),localStorage.setItem("purchase_history",JSON.stringify(a)),alert(`¡Compra exitosa!
Tu número de boleta es: ${t.id}
Puedes ver los detalles en "Mi Cuenta".`),o.clear(),m()}B.addEventListener("click",m);S.addEventListener("click",m);f.addEventListener("click",m);document.querySelector(".checkout-btn").addEventListener("click",M);o.subscribe(L);L(o.items);const l=document.getElementById("products-grid"),A=document.querySelectorAll(".filter-btn"),C=document.getElementById("product-search"),i=document.getElementById("search-suggestions"),d=document.getElementById("product-modal"),q=document.getElementById("modal-close"),h=document.getElementById("modal-img"),P=document.getElementById("modal-category"),N=document.getElementById("modal-title"),H=document.getElementById("modal-price"),O=document.getElementById("modal-description"),p=document.getElementById("modal-add-btn");let c=[],r={category:"all",species:"all",search:""};async function j(){try{const e=await fetch("/store/products.json");if(!e.ok)throw new Error("Failed to load products");c=await e.json(),$(c)}catch(e){console.error("Error loading products:",e),l.innerHTML='<div class="error">Error al cargar productos. Por favor, intenta de nuevo más tarde.</div>'}}function $(e){if(l.innerHTML="",e.length===0){l.innerHTML='<div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px; opacity: 0.5;">No se encontraron productos con los filtros seleccionados.</div>';return}e.forEach(t=>{const a=document.createElement("div");a.classList.add("product-card"),a.innerHTML=`
            <div class="product-image">
                <img src="${t.image}" alt="${t.name}" loading="lazy">
                <div class="product-badges">
                    ${t.species?t.species.map(n=>`<span class="species-badge">${n}</span>`).join(""):""}
                </div>
            </div>
            <div class="product-info">
                <div class="product-top">
                    <span class="product-category">${t.category}</span>
                    <span class="product-sku">#${t.sku||""}</span>
                </div>
                <h3 class="product-name">${t.name}</h3>
                <span class="product-brand">${t.brand||"Marca propia"}</span>
                <p class="product-price">$${t.price.toLocaleString("es-CL")}</p>
                <button class="add-to-cart" data-id="${t.id}">Agregar al Carrito</button>
            </div>
        `;const s=a.querySelector(".add-to-cart");s.addEventListener("click",n=>{n.stopPropagation(),o.addItem(t),s.textContent="¡Agregado!",s.style.background="var(--accent-sage)",s.style.color="var(--white)",setTimeout(()=>{s.textContent="Agregar al Carrito",s.style.background="",s.style.color=""},1e3)}),a.addEventListener("click",()=>{D(t)}),l.appendChild(a)})}function v(){const e=c.filter(t=>{const a=r.category==="all"||t.category===r.category,s=r.species==="all"||t.species&&t.species.includes(r.species),n=r.search.toLowerCase().trim(),g=n===""||t.name.toLowerCase().includes(n)||t.brand&&t.brand.toLowerCase().includes(n)||t.sku&&t.sku.toLowerCase().includes(n);return a&&s&&g});$(e)}function D(e){h.src=e.image,h.alt=e.name,P.textContent=`${e.category} • ${e.subcategoria||""}`,N.textContent=e.name,H.textContent=`$${e.price.toLocaleString("es-CL")}`,O.innerHTML=`
        <p style="margin-bottom: 20px;">${e.description}</p>
        <div style="font-size: 0.9rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 15px;">
            <p><strong>Marca:</strong> ${e.brand||"N/A"}</p>
            <p><strong>Especies:</strong> ${e.species?e.species.join(", "):"N/A"}</p>
            <p><strong>Código:</strong> ${e.sku||"N/A"}</p>
        </div>
    `,p.onclick=()=>{o.addItem(e),p.textContent="¡Agregado!",setTimeout(()=>p.textContent="Agregar al Carrito",1e3)},d.classList.add("active"),document.body.style.overflow="hidden"}function b(){d.classList.remove("active"),document.body.style.overflow=""}q.addEventListener("click",b);d.addEventListener("click",e=>{e.target===d&&b()});A.forEach(e=>{e.addEventListener("click",()=>{const t=e.getAttribute("data-filter"),a=e.getAttribute("data-value");r[t]=a,document.querySelectorAll(`.filter-btn[data-filter="${t}"]`).forEach(n=>n.classList.remove("active")),e.classList.add("active"),v()})});function J(e,t){let a;return(...s)=>{clearTimeout(a),a=setTimeout(()=>e.apply(this,s),t)}}function _(e){if(!i)return;if(e.length<2){i.classList.remove("active");return}const t=e.toLowerCase().trim(),a=c.filter(s=>s.name.toLowerCase().includes(t)||s.brand&&s.brand.toLowerCase().includes(t)||s.sku&&s.sku.toLowerCase().includes(t)).slice(0,5);if(a.length===0){i.classList.remove("active");return}i.innerHTML=a.map(s=>`
        <div class="suggestion-item" data-id="${s.id}">
            <img src="${s.image}" alt="${s.name}" class="suggestion-img">
            <div class="suggestion-info">
                <span class="suggestion-name">${s.name}</span>
                <span class="suggestion-brand">${s.brand||"Marca propia"}</span>
            </div>
            <span class="suggestion-price">$${s.price.toLocaleString("es-CL")}</span>
        </div>
    `).join(""),i.classList.add("active"),i.querySelectorAll(".suggestion-item").forEach(s=>{s.addEventListener("click",n=>{n.stopPropagation();const g=s.getAttribute("data-id"),u=c.find(E=>E.id==g);u&&(C.value=u.name,r.search=u.name,i.classList.remove("active"),v())})})}const z=J(e=>{r.search=e,v(),_(e)},300);C.addEventListener("input",e=>{z(e.target.value)});document.addEventListener("click",e=>{i&&!e.target.closest(".search-container")&&i.classList.remove("active")});document.addEventListener("DOMContentLoaded",j);
