/**
 * WhatsApp Floating Button Module
 * Injects a floating WhatsApp chat button into the bottom-right corner of the page.
 */

export function initWhatsAppButton() {
    // Prevent duplicate injection
    if (document.getElementById('whatsapp-floating-btn')) return;

    const waNumber = '56954422446';
    const waUrl = `https://wa.me/${waNumber}`;
    const invitationText = "¿Buscas algo en particular?";

    const btnHtml = `
        <a href="${waUrl}" 
           id="whatsapp-floating-btn" 
           target="_blank" 
           rel="noopener noreferrer" 
           aria-label="Contactar por WhatsApp"
           class="wa-float-btn">
            <svg viewBox="0 0 32 32" class="wa-icon" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 3.012.83 5.825 2.275 8.243L0 32l7.989-2.1c2.344 1.272 5.041 2.1 7.911 2.1 8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333c-2.585 0-5.011-.715-7.108-1.996l-.508-.31-4.707 1.237 1.258-4.594-.34-.54c-1.403-2.227-2.196-4.856-2.196-4.856-2.196-4.856-2.196-7.63 0-7.351 5.982-13.333 13.333-13.333s13.333 5.982 13.333 13.333-5.982 13.333-13.333 13.333zM23.111 20.37c-.389-.194-2.3-.136-2.67-.272-.37-.136-.639-.204-.91.204-.271.408-1.054 1.332-1.288 1.604-.234.272-.468.306-.857.112-.389-.194-1.643-.606-3.13-1.932-1.157-1.032-1.938-2.307-2.165-2.695-.227-.388-.024-.598.17-.791.175-.173.389-.456.584-.684.195-.228.26-.388.39-.648.13-.26.065-.488-.033-.682-.098-.194-.91-2.188-1.248-3.004-.329-.795-.663-.687-.91-.699l-.78-.014c-.271 0-.714.102-1.088.51-.374.408-1.428 1.396-1.428 3.404s1.46 3.952 1.664 4.224c.204.272 2.873 4.388 6.96 6.16 4.087 1.772 4.087 1.181 4.823 1.113.736-.068 2.373-.969 2.709-1.905.337-.936.337-1.737.237-1.907-.1-.17-.37-.272-.759-.466z" fill="white"/>
            </svg>
            <span class="wa-invitation">${invitationText}</span>
        </a>
    `;

    document.body.insertAdjacentHTML('beforeend', btnHtml);

    // Fade in after a short delay
    const btn = document.getElementById('whatsapp-floating-btn');
    setTimeout(() => {
        if (btn) btn.classList.add('visible');
    }, 1500);
}
