document.addEventListener('DOMContentLoaded', () => {
    // VARIÁVEIS DE ESTADO
    let categoriaAtual = '';
    let idadeAtual = 0;
    let precoAtual = 0;
    let vagasAtual = 0;

    const inputNome = document.getElementById('inputNome');
    const inputIdade = document.getElementById('inputIdade');
    const categoriaHint = document.getElementById('categoriaHint');
    const inputQtd = document.getElementById('inputQtd');

    // Função para identificar a categoria
    function getCategoria(idade) {
        if (idade <= 12) return 'Criança';
        if (idade <= 17) return 'Adolescente';
        return 'Adulto';
    }

    // PONTO 1: Feedback dinâmico ao digitar a idade
    if (inputIdade) {
        inputIdade.addEventListener('input', (e) => {
            const idade = parseInt(e.target.value);
            if (idade >= 0) {
                categoriaAtual = getCategoria(idade);
                vagasAtual = ESTOQUE_DJANGO[categoriaAtual]?.disponivel || 0;
                precoAtual = ESTOQUE_DJANGO[categoriaAtual]?.preco || 0;

                categoriaHint.innerHTML = `Categoria: <b>${categoriaAtual}</b> | Vagas disponíveis: <b>${vagasAtual}</b>`;
                categoriaHint.style.color = 'var(--gold)';
            } else {
                categoriaHint.textContent = 'Informe sua idade para descobrirmos sua categoria de ingresso.';
                categoriaHint.style.color = '';
            }
        });
    }

    // PONTO 2: Atualizar Card do Passo 2 (Quantidade)
    document.getElementById('btnParaQuantidade')?.addEventListener('click', () => {
        idadeAtual = parseInt(inputIdade.value);
        if (!inputNome.value || isNaN(idadeAtual)) return alert("Preencha nome e idade!");
        if (vagasAtual <= 0) return alert("Não há vagas para esta categoria!");

        document.getElementById('qtyCategoriaCard').innerHTML = `
            <div>
                <b>Categoria ${categoriaAtual}</b><br>
                <span>Preço unitário: R$ ${precoAtual.toFixed(2)}</span>
            </div>
            <span class="ticket-card__label">${vagasAtual} vagas restantes</span>
        `;
        inputQtd.value = 1; // Reseta para 1
        mudarPassoCompra(2);
    });

    // Controle de Quantidade (+ e -)
    document.getElementById('qtyMenos')?.addEventListener('click', () => {
        if (inputQtd.value > 1) inputQtd.value = parseInt(inputQtd.value) - 1;
    });
    document.getElementById('qtyMais')?.addEventListener('click', () => {
        const limit = Math.min(5, vagasAtual);
        if (parseInt(inputQtd.value) < limit) inputQtd.value = parseInt(inputQtd.value) + 1;
    });

    // PONTO 3: Atualizar Card do Passo 3 (Confirmação)
    document.getElementById('btnParaConfirmacao')?.addEventListener('click', () => {
        const qtd = parseInt(inputQtd.value);
        const total = qtd * precoAtual;

        document.getElementById('reviewBox').innerHTML = `
            <dl>
                <dt>Categoria:</dt>
                <dd>${categoriaAtual} (${idadeAtual} anos)</dd>
                <dt>Quantidade:</dt>
                <dd>${qtd}x</dd>
                <dt>Valor Unitário:</dt>
                <dd>R$ ${precoAtual.toFixed(2)}</dd>
                <div class="review__total">
                    <dt>Total a pagar:</dt>
                    <dd>R$ ${total.toFixed(2)}</dd>
                </div>
            </dl>
        `;
        mudarPassoCompra(3);
    });

    // FINALIZAR COMPRA VIA FETCH AJAX
    document.getElementById('btnConfirmarCompra')?.addEventListener('click', async () => {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const data = {
            nome_cliente: inputNome.value,
            idade: inputIdade.value,
            quantidade: inputQtd.value
        };

        const response = await fetch('/comprar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.sucesso) {
            // PONTO 3.1: Geração do Ticket idêntico à imagem de referência
            document.getElementById('ticketStub').innerHTML = `
                <div class="stub__main">
                    <p class="stub__eyebrow">Ingresso Confirmado</p>
                    <h3 class="stub__film">CineIngressos Digital</h3>
                    <div class="stub__row" style="margin-top: 24px;">
                        <div>
                            <span>Categoria</span>
                            <b style="color: #1D0B02;">${result.categoria}</b>
                        </div>
                        <div>
                            <span>Qtd</span>
                            <b style="color: #1D0B02;">${result.quantidade}x</b>
                        </div>
                        <div>
                            <span>Total</span>
                            <b style="color: #1D0B02;">R$ ${result.total.toFixed(2)}</b>
                        </div>
                    </div>
                </div>
                <div class="stub__side">
                    <div class="stub__code">${result.codigo}</div>
                    <div class="stub__barcode"></div>
                </div>
            `;
            mudarPassoCompra('sucesso');

            // Chama a notificação de SUCESSO
            mostrarToast(`Compra de ${result.quantidade} ingresso(s) confirmada!`, 'success');

        } else {
            // Troca o alert antigo por uma notificação de ERRO elegante
            mostrarToast(result.erro, 'error');
        }
    });

    // PONTO 4: Consultar Ingressos via Fetch
    document.getElementById('btnBuscarCodigo')?.addEventListener('click', async () => {
        const codigo = document.getElementById('inputCodigo').value.trim();
        if (!codigo) return;

        const response = await fetch(`/buscar/${codigo}/`);
        const result = await response.json();
        const box = document.getElementById('lookupResult');

        if (result.sucesso) {
            box.innerHTML = `
                <div class="lookup-result is-ok">
                    <p style="color: var(--success); margin-bottom: 12px;"><strong>Ingresso Válido!</strong></p>
                    <dl>
                        <dt>Código:</dt> <dd style="color: var(--cream);">${result.codigo}</dd>
                        <dt>Categoria:</dt> <dd style="color: var(--cream);">${result.categoria}</dd>
                        <dt>Quantidade:</dt> <dd style="color: var(--cream);">${result.quantidade}x</dd>
                        <dt>Total:</dt> <dd style="color: var(--cream);">R$ ${result.total.toFixed(2)}</dd>
                        <dt>Data Compra:</dt> <dd style="color: var(--cream);">${result.data}</dd>
                    </dl>
                </div>
            `;
        } else {
            box.innerHTML = `<div class="lookup-result is-error"><p>${result.erro}</p></div>`;
        }
    });

    // PONTO DE CORREÇÃO: Fazer os botões "Voltar" funcionarem (Delegação de Eventos)
    document.addEventListener('click', (e) => {
        const btnBack = e.target.closest('[data-back]');
        if (btnBack) {
            e.preventDefault(); // Bloqueia qualquer envio de formulário acidental
            mudarPassoCompra(btnBack.getAttribute('data-back'));
        }
    });

    // Função utilitária para mudar o painel visual (Refatorada para maior segurança)
    function mudarPassoCompra(passo) {
        const passoNum = parseInt(passo, 10); // Converte para número de forma segura

        // Alterna os painéis visíveis
        document.querySelectorAll('.purchase__panel').forEach(p => p.classList.remove('is-active'));
        const painelAlvo = document.querySelector(`.purchase__panel[data-panel="${passo}"]`);
        if (painelAlvo) painelAlvo.classList.add('is-active');

        // Atualiza a barra de progresso (Idade > Quantidade > Confirmação)
        document.querySelectorAll('.progress__item').forEach(item => {
            const stepNum = parseInt(item.getAttribute('data-step'), 10);
            item.classList.remove('is-active', 'is-done');

            if (stepNum === passoNum) {
                item.classList.add('is-active');
            } else if (stepNum < passoNum || passo === 'sucesso') {
                item.classList.add('is-done');
            }
        });
    }



    /* =========================================================
       1. NAVEGAÇÃO DE ABAS / VIEWS (SPA)
    ========================================================= */
    function navegarPara(targetNav) {
        document.querySelectorAll('[data-nav]').forEach(btn => {
            if (btn.getAttribute('data-nav') === targetNav && btn.classList.contains('mainnav__link')) {
                btn.classList.add('is-active');
            } else if (btn.classList.contains('mainnav__link')) {
                btn.classList.remove('is-active');
            }
        });

        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('is-active');
        });

        const targetView = document.getElementById(`view-${targetNav}`);
        if (targetView) {
            targetView.classList.add('is-active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    document.addEventListener('click', (e) => {
        const navBtn = e.target.closest('[data-nav]');
        if (navBtn) {
            if (navBtn.tagName !== 'BUTTON' && navBtn.tagName !== 'A') e.preventDefault();
            const targetNav = navBtn.getAttribute('data-nav');
            navegarPara(targetNav);
        }
    });


    /* =========================================================
        2. CARROSSEL DE FILMES & MODAL (Refatorado para Scroll Nativo)
        ========================================================= */
    const movieViewport = document.getElementById('movieViewport');
    const moviePrev = document.getElementById('moviePrev');
    const movieNext = document.getElementById('movieNext');

    if (moviePrev && movieNext && movieViewport) {
        // Define a quantidade de pixels para rolar (Largura do card + gap)
        const scrollAmount = 276;

        movieNext.addEventListener('click', () => {
            movieViewport.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        moviePrev.addEventListener('click', () => {
            movieViewport.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // Modal de Descrição (mantém igual)
    const movieModal = document.getElementById('movieModal');
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => {
            document.getElementById('movieModalTitle').textContent = card.getAttribute('data-title');
            document.getElementById('movieModalYear').textContent = card.getAttribute('data-year');
            document.getElementById('movieModalDescription').textContent = card.getAttribute('data-description');

            movieModal.classList.add('is-open');
            movieModal.setAttribute('aria-hidden', 'false');
        });
    });

    document.querySelectorAll('[data-close-modal]').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            movieModal.classList.remove('is-open');
            movieModal.setAttribute('aria-hidden', 'true');
        });
    });


    // =========================================================
    // BLOQUEAR ENVIO PREMATURO COM A TECLA "ENTER"
    // =========================================================
    document.querySelectorAll('.purchase input').forEach(input => {
        input.addEventListener('keypress', function (e) {
            // Se a tecla pressionada for o Enter
            if (e.key === 'Enter') {
                e.preventDefault(); // Impede que o formulário seja enviado para o Django

                // Se estiver no campo de idade, simula o clique no botão "Continuar"
                if (this.id === 'inputIdade') {
                    const btnContinuar = document.getElementById('btnParaQuantidade');
                    if (btnContinuar) btnContinuar.click();
                }
            }
        });
    });

    // =========================================================
    // ANIMAÇÃO DAS NOTIFICAÇÕES (TOASTS)
    // =========================================================
    // Função para gerar Toasts dinâmicos via JavaScript
    function mostrarToast(mensagem, tipo = 'success') {
        let container = document.querySelector('.toast-container');

        // Se o container não existir, cria um na hora
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Cria o elemento do toast
        const toast = document.createElement('div');
        toast.className = `toast toast--${tipo}`;
        toast.textContent = mensagem;

        container.appendChild(toast);

        // Dispara a animação de entrada
        setTimeout(() => toast.classList.add('is-visible'), 100);

        // Remove a notificação após 4 segundos
        setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 400); // Remove do HTML após a transição
        }, 4000);
    }

});