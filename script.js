
document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------
    // 1. Controle de Navegação e Visualização de Seções
    // ----------------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = {
        '#inicio': document.getElementById('inicio'),
        '#produtos': document.getElementById('produtos'),
        '#contato': document.getElementById('contato')
    };

    function showSection(targetId) {
        // Oculta todas as seções (exceto o hero, que começa visível)
        Object.keys(sections).forEach(id => {
            if (id !== '#inicio') {
                sections[id].classList.add('hidden-section');
            }
        });

        // Remove a classe 'active' de todos os links
        navLinks.forEach(link => link.classList.remove('active'));

        // Mostra a seção desejada e define o link como 'active'
        const targetSection = sections[targetId];
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            showSection(targetId);
            // Rola suavemente para o topo da seção
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Inicia na seção de Início (se não estiver já)
    if (window.location.hash) {
        showSection(window.location.hash);
    } else {
        showSection('#inicio');
    }

    // ----------------------------------------------------------------
    // 2. Formulário Fale Conosco (Simulação de Envio)
    // ----------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const contactMessage = document.getElementById('contact-message');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulação de envio
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const mensagem = document.getElementById('mensagem').value;

        // Limpa a mensagem anterior
        contactMessage.textContent = '';
        contactMessage.style.color = 'var(--color-success)';

        // Atraso para simular o processamento do servidor
        setTimeout(() => {
            contactMessage.textContent = `Obrigado, ${nome}! Sua mensagem foi enviada com sucesso. Responderemos em breve no e-mail ${email}.`;
            contactForm.reset();
        }, 1000);
    });

    // ----------------------------------------------------------------
    // 3. Modal de Compra e Simulação de Processo
    // ----------------------------------------------------------------
    const modal = document.getElementById('purchase-modal');
    const purchaseForm = document.getElementById('purchase-form');
    const purchaseSuccess = document.getElementById('purchase-success');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductPrice = document.getElementById('modal-product-price');
    const inputProductId = document.getElementById('p-product-id');
    const trackingCodeSpan = document.getElementById('tracking-code');
    const deliveryDateSpan = document.getElementById('delivery-date');

    // Função para abrir o modal
    window.openPurchaseModal = function(button) {
        const card = button.closest('.product-card');
        const productId = card.getAttribute('data-product-id');
        const price = card.getAttribute('data-price');
        const name = card.getAttribute('data-name');

        modalProductName.textContent = name;
        modalProductPrice.textContent = `Preço: R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
        inputProductId.value = productId;

        // Reseta o estado do modal
        purchaseForm.classList.remove('hidden');
        purchaseSuccess.classList.add('hidden');
        modal.style.display = 'block';
    }

    // Função para fechar o modal
    window.closePurchaseModal = function() {
        modal.style.display = 'none';
        purchaseForm.reset(); // Limpa o formulário
    }

    // Fechar ao clicar fora do modal
    window.onclick = function(event) {
        if (event.target == modal) {
            closePurchaseModal();
        }
    }

    // Simulação de Compra
    purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Simulação de validação (simplificada)
        if (!validatePurchaseForm()) {
            alert("Por favor, preencha todos os campos obrigatórios corretamente.");
            return;
        }

        // 2. Simulação de processamento da compra
        setTimeout(() => {
            // Gerar Código de Rastreio e Data
            const trackingCode = generateTrackingCode();
            const deliveryDate = generateDeliveryDate();

            trackingCodeSpan.textContent = trackingCode;
            deliveryDateSpan.textContent = deliveryDate;

            // Transição para a tela de sucesso
            purchaseForm.classList.add('hidden');
            purchaseSuccess.classList.remove('hidden');
            
            // Ativa o primeiro passo do rastreamento (Pedido Recebido)
            const trackerSteps = document.querySelectorAll('.tracker-steps .step');
            trackerSteps.forEach(step => step.classList.remove('active'));
            if (trackerSteps.length > 0) {
                 trackerSteps[0].classList.add('active');
            }

        }, 1500);
    });

    // Validação do formulário de compra (Exemplo básico)
    function validatePurchaseForm() {
        const requiredFields = purchaseForm.querySelectorAll('[required]');
        let allValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                allValid = false;
            }
        });

        // Validação de formato (exemplo: e-mail)
        const emailInput = document.getElementById('p-email');
        if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
            allValid = false;
        }

        // Simulação de validação de cartão (apenas se tiver 16 dígitos)
        const cardInput = document.getElementById('p-card');
        const cleanCard = cardInput.value.replace(/\s/g, '');
        if (cleanCard.length < 16) {
            // Se for um campo real, você pode adicionar uma classe de erro aqui
            // cardInput.style.border = '1px solid red'; 
            allValid = false;
        }

        return allValid;
    }

    // Função para gerar código de rastreio simulado
    function generateTrackingCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const year = new Date().getFullYear();
        return `TNX-${year}-${result}`;
    }

    // Função para gerar data de entrega simulada
    function generateDeliveryDate() {
        const minDays = 5;
        const maxDays = 10;
        return `${minDays} a ${maxDays} dias úteis`;
    }

    // Copiar Código de Rastreio
    window.copyTrackingCode = function() {
        const trackingCodeText = trackingCodeSpan.textContent;
        navigator.clipboard.writeText(trackingCodeText).then(() => {
            alert(`Código de rastreio copiado: ${trackingCodeText}`);
        }).catch(err => {
            console.error('Erro ao copiar: ', err);
            // Fallback para navegadores antigos
            const tempInput = document.createElement('textarea');
            tempInput.value = trackingCodeText;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert(`Código de rastreio copiado (via fallback): ${trackingCodeText}`);
        });
    }

});