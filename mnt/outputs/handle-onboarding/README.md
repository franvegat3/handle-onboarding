# Handle Onboarding App

Formulario de onboarding para clientes de Handle. Cuando un cliente lo llena, Claude hace el setup automáticamente en app.handle.run.

## Deploy en 5 minutos

### 1. Obtén tu API Key de Anthropic
1. Ve a https://console.anthropic.com/settings/keys
2. Click "Create Key"
3. Copia la key (empieza con `sk-ant-...`)

### 2. Sube el código a GitHub
```bash
cd handle-onboarding
git init
git add .
git commit -m "Handle onboarding app"
gh repo create handle-onboarding --public --push
```

### 3. Despliega en Vercel
```bash
npx vercel --prod
```
O ve a https://vercel.com/new → Import Git Repository → selecciona `handle-onboarding`

### 4. Agrega tu API Key en Vercel
- Ve a tu proyecto en vercel.com → Settings → Environment Variables
- Agrega: `ANTHROPIC_API_KEY` = tu key de Anthropic

### 5. Listo
Tu form estará disponible en: `https://handle-onboarding.vercel.app`
Compártelo con los clientes para que llenen su info.

## Desarrollo local
```bash
cp .env.example .env.local
# Agrega tu API key en .env.local
npm install
npm run dev
# Abre http://localhost:3000
```

## Estructura
```
app/
  page.tsx          ← Form multi-paso (cliente lo ve)
  api/submit/       ← API que recibe datos y llama a Claude
components/steps/
  StepAgents.tsx    ← Selección de agentes
  StepCompany.tsx   ← Datos de la empresa
  StepTeam.tsx      ← Equipo de usuarios
  StepCotizador.tsx ← Aseguradoras + ramos + correos
  StepValidador.tsx ← Portales + config de reportes
  StepSuccess.tsx   ← Pantalla de éxito
```
