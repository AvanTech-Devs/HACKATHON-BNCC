# Hackathon: Sistema Inteligente de Materiais Didáticos de Cultura Digital

## Contexto

Projeto desenvolvido para o Hackathon de Desenvolvimento de Sistema Inteligente para Geração de Materiais Didáticos de Cultura Digital, promovido pelo curso TADS do IFPI Campus Piripiri, em 07/01/2026.

O sistema tem como objetivo auxiliar professores do Ensino Fundamental e Médio na geração de planos de aula e atividades avaliativas alinhadas à BNCC, utilizando Inteligência Artificial Generativa e o conceito de RAG (Recuperação Aumentada por Geração).

Protótipo de referência:
https://v0-digital-culture-platform.vercel.app/login

## Objetivos

Objetivo geral  
Desenvolver um sistema web que gere automaticamente materiais didáticos de Cultura Digital organizados por disciplinas e unidades, alinhados à BNCC.

Objetivos específicos  
Apoiar o planejamento pedagógico  
Organizar conteúdos por disciplinas e unidades  
Permitir criação manual ou automática de aulas  
Gerar planos de aula alinhados à BNCC  
Gerar atividades avaliativas  
Explorar o uso de IA como ferramenta pedagógica  

## Público-alvo

Professores do Ensino Fundamental e Médio

## Tecnologias Utilizadas

Frontend  
React  
Next.js  
Tailwind CSS  

Backend  
Supabase (PostgreSQL e Auth)

IA e RAG  
Modelo de linguagem: GPT-4o-mini  
Embeddings: text-embedding-3-small  
Base de conhecimento: BNCC e documentos oficiais do MEC  

Outros  
React Icons  
pptxgenjs (opcional)

## Estrutura do Projeto

/cultural.sql           Banco de dados inicial  
/public/wireframe       Wireframes das telas  
/app                    Código-fonte Next.js  
/components              Componentes de interface  
/constants               Constantes do projeto  
/utils                   Funções utilitárias  
/viewmodels              Lógica de estado e integração com Supabase  
/styles                  Estilos globais  
.env.local               Variáveis de ambiente  

## Variáveis de Ambiente

Exemplo de arquivo .env.local

```env
LLAMA_CLOUD_API_KEY=
MODEL_PROVIDER=openai
MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
OPENAI_API_KEY=sk-XXXX

SYSTEM_PROMPT=You are a helpful assistant who helps users with their questions.
SYSTEM_CITATION_PROMPT=You have provided information from a knowledge base.

NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx
SUPABASE_SERVICE_ROLE_KEY=xxxx
```


## Funcionalidades

Cadastro e gerenciamento de disciplinas  
Criação manual de unidades e aulas  
Sugestão automática de unidades por meio de IA  
Geração automática de planos de aula alinhados à BNCC  
Geração automática de atividades avaliativas  
Geração opcional de slides de apoio  
Visualização de materiais e atividades recentes  
Navegação simples baseada nos wireframes do projeto  

## Wireframes

Os wireframes utilizados como base para o desenvolvimento da interface estão disponíveis no diretório:

/public/wireframe

Dashboard inicial  
Tela de disciplina  
Tela de cadastro de nova disciplina  
Tela de cadastro de nova unidade  

## Como Executar o Projeto

Clonar o repositório  
```bash
git clone <repo_url>
cd <repo>
```
Instalar dependências  
```bash
npm install
```
Configurar variáveis de ambiente  
```bash
.env
```

Gerar os dados do RAG 
```bash
npm run generate
```

Iniciar o servidor de desenvolvimento  
```bash
npm run dev
```

Acessar pelo navegador
```bash
http://localhost:3000
```

## Integrantes do Projeto

- Francisco Igor Silva Santos
- Sávyo Francisco Barbosa Nascimento
- Mardone Silva Pereira

## Site em deploy
O sistema está disponível em: https://hackathon-bncc.onrender.com