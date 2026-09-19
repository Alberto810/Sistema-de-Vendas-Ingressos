# 📖 Documentação Técnica - CineIngressos

## 1. Visão Geral do Sistema
O **CineIngressos** é uma plataforma digital de bilheteria desenvolvida para otimizar o fluxo de compra e validação de ingressos de cinema. O sistema atua com uma interface **Single Page Application (SPA)**, garantindo navegação fluida sem recarregamento de páginas, suportada por um back-end construído em **Django** (Python) que atua como uma API interna para processamento de regras de negócio, cálculo de preços e gerenciamento de concorrência de estoque.

## 2. Arquitetura do Sistema
O projeto adota um padrão arquitetural que separa a camada de apresentação da camada de dados e negócios:
*   **Front-end (Cliente):** Responsável exclusivamente pela renderização da interface, capturas de eventos (DOM) e requisições assíncronas.
*   **Back-end (Servidor):** Responsável por autenticar as requisições (CSRF), aplicar regras de negócio (limites de compra, precificação), realizar transações de banco de dados e retornar respostas estruturadas em formato JSON.

### 2.1. Fluxo de Comunicação
1. O cliente preenche o formulário SPA.
2. O JavaScript intercepta o envio e emite uma requisição HTTP via `Fetch API` para os endpoints do Django.
3. O Django processa a requisição, atualiza o banco de dados e retorna o status.
4. O Front-end atualiza a DOM dinamicamente (ex: exibindo o Ticket Digital ou um Toast de erro) com base na resposta HTTP.

## 3. Tecnologias Utilizadas

### Front-end
*   **HTML5:** Semântica estrutural e injeção inicial de estado via Django Templates.
*   **CSS3:** Estilização responsiva utilizando Variáveis Nativas, Flexbox, Grid Layout e CSS Scroll Snap para carrosséis nativos focados em usabilidade *mobile-first*.
*   **Vanilla JavaScript (ES6+):** Manipulação de DOM, delegação de eventos e chamadas assíncronas (async/await).

### Back-end
*   **Python:** Linguagem base.
*   **Django:** Framework web utilizado para roteamento, segurança (CSRF Protection) e mapeamento objeto-relacional (ORM).
*   **SQLite:** Banco de dados relacional leve utilizado para persistência local.

## 4. Modelagem de Dados (Schema)

O banco de dados relacional foi estruturado em duas entidades principais: `Categoria` e `Venda`.

### Entidade: `Categoria`
Armazena os tipos de ingresso, seus estoques e valores de precificação.

| Campo | Tipo | Descrição | Regras |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Chave primária | Auto-incremento |
| `nome` | CharField | Nome da categoria (Criança, Adolescente, Adulto) | max_length=50, unique=True |
| `quantidade_disponivel`| PositiveIntegerField | Controle de vagas disponíveis em tempo real | default=0 |
| `preco` | DecimalField | Valor base do ingresso | max_digits=6, decimal_places=2, default=25.00 |

### Entidade: `Venda`
Registra a transação individual de compra atrelada a uma categoria.

| Campo | Tipo | Descrição | Regras |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Chave primária | Auto-incremento |
| `codigo` | CharField | Hash único do bilhete gerado no *save* | max_length=10, unique=True |
| `nome_cliente` | CharField | Nome do comprador fornecido no formulário | max_length=100 |
| `categoria` | ForeignKey | Relacionamento 1:N com `Categoria` | on_delete=CASCADE |
| `idade_cliente` | PositiveIntegerField | Idade declarada no momento da compra | - |
| `quantidade` | PositiveIntegerField | Número de ingressos adquiridos na transação | Limite front-end: 5 |
| `valor_total` | DecimalField | Valor total (quantidade * preco) calculado no back-end | max_digits=8, decimal_places=2 |
| `data_venda` | DateTimeField | Timestamp da transação | auto_now_add=True |

## 5. Endpoints da API Interna

A comunicação entre o Front-end SPA e o Back-end Django ocorre através de rotas dedicadas retornando JSON.

| Rota | Método HTTP | Parâmetros Recebidos (Body/URL) | Resposta Esperada (JSON) | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `/comprar/` | POST | `nome_cliente`, `idade`, `quantidade` | `sucesso`, `codigo`, `categoria`, `quantidade`, `total`, `erro` | Processa a compra, deduz o estoque, calcula o valor e gera o código único. |
| `/buscar/<codigo>/`| GET | URL Param: `codigo` | `sucesso`, `codigo`, `categoria`, `quantidade`, `total`, `data`, `erro` | Realiza a consulta de um bilhete no banco de dados através do seu hash único. |

## 6. Regras de Negócio Implementadas

1.  **Classificação Etária:** O enquadramento na categoria é determinado estritamente pela idade informada no checkout (Criança: ≤ 12 anos, Adolescente: 13 a 17 anos, Adulto: ≥ 18 anos).
2.  **Garantia de Concorrência:** O back-end valida o estoque real da categoria no ato do POST. Se `quantidade_disponivel` for menor que a solicitada, a transação é bloqueada, retornando erro, independentemente do estado no front-end.
3.  **Segurança de Precificação:** O valor total é calculado no servidor (`valor_total = quantidade * categoria.preco`), impedindo que alterações no HTML do cliente manipulem os preços da transação.
4.  **Emissão de Hash:** O método `save()` do modelo `Venda` sobrescreve a criação para gerar um prefixo padronizado (`CI-`) seguido de 5 caracteres alfanuméricos aleatórios para cada bilhete.

## 7. Estrutura de Diretórios

```text
CineIngressos/
├── config/                 # Configurações globais do Django (settings.py, urls.py)
├── ingressos/              # Core Application do projeto
│   ├── migrations/         # Histórico estrutural do banco de dados
│   ├── static/             # Assets estáticos (CSS, JS, Imagens, SVG)
│   │   └── ingressos/
│   │       ├── css/style.css
│   │       ├── js/script.js
│   │       └── images/
│   ├── templates/          # HTML base consumido pelas Views
│   │   └── ingressos/
│   │       └── index.html
│   ├── admin.py            # Registro de modelos no painel de administração
│   ├── models.py           # Modelagem de dados (Categoria, Venda)
│   ├── urls.py             # Rotas do aplicativo
│   └── views.py            # Lógica de controle (Renderização inicial e endpoints)
├── db.sqlite3              # Banco de dados local
├── manage.py               # Utilitário de linha de comando do Django
├── requirements.txt        # Dependências do projeto
└── .gitignore              # Regras de exclusão para versionamento (Git)