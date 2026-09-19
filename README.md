# 🎬 CineIngressos

> **Sistema web de venda e gerenciamento de ingressos de cinema desenvolvido com Django.**

O **CineIngressos** é um sistema desenvolvido para simular o processo de compra e gerenciamento de ingressos de cinema, permitindo controlar a disponibilidade de ingressos por faixa etária, registrar vendas e consultar a quantidade disponível.

O projeto começou como uma aplicação desenvolvida em **Python no terminal** e está sendo evoluído para uma aplicação web utilizando **Django**, proporcionando uma arquitetura mais organizada, persistência de dados e uma interface moderna e responsiva.

---

## 📸 Sobre o projeto

O CineIngressos foi desenvolvido com foco em **aprendizado prático de desenvolvimento web**, aplicando conceitos de:

* Desenvolvimento Back-end
* Desenvolvimento Front-end
* Banco de dados
* CRUD
* Django Models
* Django Templates
* Arquivos estáticos
* JavaScript
* Validação de dados
* Integração entre Front-end e Back-end

A proposta é transformar um sistema inicialmente executado no terminal em uma aplicação web completa para gerenciamento de ingressos.

---

## 🚀 Funcionalidades

### 🎟️ Compra de ingressos

O sistema permite que o usuário informe:

* Idade;
* Quantidade de ingressos desejada;
* Categoria correspondente à idade.

A categoria é determinada automaticamente:

| Faixa etária     | Categoria      |
| ---------------- | -------------- |
| Menor de 12 anos | 👶 Criança     |
| 12 a 17 anos     | 🧑 Adolescente |
| 18 anos ou mais  | 👨 Adulto      |

---

### 📊 Controle de disponibilidade

O sistema controla a quantidade disponível de ingressos por categoria.

Configuração inicial:

```text
Crianças       → 20 ingressos
Adolescentes   → 30 ingressos
Adultos        → 50 ingressos
```

Após uma compra, a quantidade disponível é atualizada.

Exemplo:

```text
Antes:
Adultos → 20

Compra:
2 ingressos

Depois:
Adultos → 18
```

---

### 🔎 Consulta de ingressos

O sistema permite consultar:

* Ingressos para crianças;
* Ingressos para adolescentes;
* Ingressos para adultos;
* Disponibilidade geral.

---

### 🗄️ Persistência de dados

A aplicação utiliza **SQLite** durante o desenvolvimento.

Os dados são armazenados através dos Models do Django.

Atualmente existem dois principais modelos:

```text
Categoria
Venda
```

Relacionamento:

```text
Categoria
    │
    │ 1:N
    ▼
Venda
```

Uma categoria pode possuir várias vendas associadas.

---

### ⚙️ Django Admin

O projeto utiliza o painel administrativo do Django para gerenciamento dos dados.

Através do Admin é possível visualizar e administrar:

* Categorias;
* Quantidade disponível;
* Vendas;
* Idade do cliente;
* Quantidade comprada;
* Data da venda.

---

## 🛠️ Tecnologias utilizadas

### Back-end

* 🐍 Python
* 🌐 Django
* 🗄️ SQLite

### Front-end

* HTML5
* CSS3
* JavaScript

### Ferramentas

* Visual Studio Code
* Git
* GitHub

---

## 📂 Estrutura do projeto

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

---

## 🧩 Arquitetura

O projeto utiliza a arquitetura baseada no padrão **MVT (Model-View-Template)** do Django.

```text
                    ┌─────────────────┐
                    │     Usuário     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │      URL        │
                    │     Django      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │      View       │
                    │    views.py     │
                    └────────┬────────┘
                             │
                  ┌──────────┴──────────┐
                  ▼                     ▼
          ┌───────────────┐     ┌───────────────┐
          │     Model     │     │    Template   │
          │   models.py   │     │    HTML/CSS   │
          └───────┬───────┘     └───────────────┘
                  │
                  ▼
          ┌───────────────┐
          │    SQLite     │
          │   Database    │
          └───────────────┘
```
---

## 💻 Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/CineIngressos.git
```

Entre na pasta:

```bash
cd CineIngressos
```

---

### 2. Crie um ambiente virtual

Windows:

```bash
python -m venv venv
```

---

### 3. Ative o ambiente virtual

PowerShell:

```bash
venv\Scripts\Activate
```

---

### 4. Instale as dependências

```bash
pip install -r requirements.txt
```

Caso o arquivo ainda não exista:

```bash
pip install django
```

E depois:

```bash
pip freeze > requirements.txt
```

---

### 5. Execute as migrations

```bash
python manage.py makemigrations
```

Depois:

```bash
python manage.py migrate
```

---

### 6. Crie um usuário administrador

```bash
python manage.py createsuperuser
```

Preencha:

```text
Username:
Email:
Password:
```

---

### 7. Inicie o servidor

```bash
python manage.py runserver
```

Acesse:

```text
http://127.0.0.1:8000/
```

Para acessar o painel administrativo:

```text
http://127.0.0.1:8000/admin/
```

---

## 🎨 Interface

A interface foi desenvolvida buscando uma identidade visual relacionada ao universo cinematográfico.

Principais elementos:

* 🎬 Tema de cinema;
* 🎟️ Elementos relacionados a ingressos;
* 🌌 Imagem de fundo cinematográfica;
* 📱 Design responsivo;
* ✨ Interações utilizando JavaScript;
* 🧭 Navegação entre as diferentes áreas do sistema;
* 🎨 Favicon personalizado em SVG.

---

## 🔄 Fluxo de compra

O fluxo planejado para a compra funciona da seguinte maneira:

```text
Usuário acessa o CineIngressos
            │
            ▼
    Seleciona "Comprar"
            │
            ▼
      Informa a idade
            │
            ▼
   Sistema identifica categoria
            │
            ▼
    Informa quantidade desejada
            │
            ▼
 Sistema verifica disponibilidade
            │
       ┌────┴────┐
       │         │
    Disponível  Indisponível
       │         │
       ▼         ▼
   Registra    Exibe
     venda     mensagem
       │
       ▼
 Atualiza estoque
       │
       ▼
 Confirma compra
```

---

## 🧪 Validações

O sistema possui validações para evitar situações como:

* Idade negativa;
* Quantidade igual a zero;
* Quantidade negativa;
* Compra acima da disponibilidade;
* Opções inválidas;
* Valores não numéricos.

Exemplo:

```text
Digite sua idade: -5

Idade inválida.
```

E:

```text
Digite a quantidade: 50

Não há ingressos suficientes disponíveis.
```

---

## 📈 PRÓXIMAS MELHORIAS AQUI A BAIXO: 

O projeto ainda está em desenvolvimento e possui diversas funcionalidades planejadas.

### 🎬 Catálogo de filmes

* Cadastro de filmes;
* Poster;
* Sinopse;
* Classificação indicativa;
* Gênero;
* Duração;
* Filmes em cartaz.

### 🪑 Seleção de assentos

Implementação de uma sala de cinema interativa:

```text
[ A01 ][ A02 ][ A03 ][ A04 ]

[ B01 ][ B02 ][ B03 ][ B04 ]

[ C01 ][ C02 ][ C03 ][ C04 ]
```

Com estados:

```text
🟩 Disponível
🟥 Ocupado
🟦 Selecionado
```

### 💳 Pagamento

Futuramente poderá ser implementado um fluxo de pagamento simulado ou integração com um gateway de pagamentos.

### 🎫 Ingresso digital

Após a compra:

```text
┌──────────────────────────────┐
│       🎬 CINEINGRESSOS       │
│                              │
│ Filme: __________________    │
│ Sessão: _________________    │
│ Sala: ___________________    │
│ Assento: ________________    │
│                              │
│        QR CODE               │
│                              │
└──────────────────────────────┘
```

### 👤 Sistema de usuários

* Cadastro;
* Login;
* Logout;
* Histórico de compras;
* Perfil do usuário.

### 📊 Dashboard administrativo

Futuramente o administrador poderá visualizar:

```text
Vendas do dia
       ↓
Ingressos vendidos
       ↓
Ingressos disponíveis
       ↓
Filmes mais vendidos
       ↓
Faturamento
```

---

## 🔐 Melhorias de segurança planejadas

Entre as melhorias futuras:

* Autenticação de usuários;
* Controle de permissões;
* Proteção de rotas;
* Validação no back-end;
* Proteção contra manipulação dos dados pelo cliente;
* Configuração adequada de variáveis de ambiente;
* Configuração de `DEBUG=False` em produção;
* Banco de dados apropriado para produção.

---

## 📚 Objetivo acadêmico

O CineIngressos também funciona como um projeto prático para aplicar conceitos estudados durante a formação em **Engenharia de Software**.

O desenvolvimento permite praticar conceitos como:

```text
Programação
     │
     ├── Python
     ├── JavaScript
     │
     ▼
Desenvolvimento Web
     │
     ├── HTML
     ├── CSS
     └── Django
     │
     ▼
Banco de Dados
     │
     └── SQLite
     │
     ▼
Engenharia de Software
     │
     ├── Organização
     ├── Arquitetura
     ├── Validação
     └── Evolução do sistema
```
---

## 👨‍💻 Desenvolvedor

**Alberto Henrique**

Estudante de **Engenharia de Software**, com foco em desenvolvimento de aplicações, programação e construção de projetos práticos.

Este projeto faz parte da jornada de aprendizado e evolução no desenvolvimento de software.

---

## 📌 Observação

O CineIngressos é um projeto educacional desenvolvido para fins de estudo e demonstração de conhecimentos em desenvolvimento de software.

Novas funcionalidades serão adicionadas progressivamente conforme o projeto evolui.

---

## ⭐ Contribuição

Sugestões, melhorias e contribuições são bem-vindas.

Caso encontre algum problema ou tenha uma ideia para melhorar o projeto, abra uma **Issue** ou envie um **Pull Request**.

---

## 📄 Licença

Este projeto pode receber uma licença específica futuramente, conforme a definição de sua estratégia de distribuição e uso.
