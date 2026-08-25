# Preventivatore Benifin

Applicazione locale per creare preventivi modificando testi, importi e dati del cliente senza alterare la grafica del modello.

## Installazione su Windows

Aprire **PowerShell** e incollare:

```powershell
irm https://raw.githubusercontent.com/OmarPrampolini/preventivatoreluc/main/install.ps1 | iex
```

L’installer:

- prepara automaticamente un motore Node.js portatile se necessario, senza privilegi amministrativi;
- scarica e prepara l’app in `%LOCALAPPDATA%\PreventivatoreBenifin`;
- crea il collegamento **Preventivatore Benifin** sul desktop;
- apre automaticamente l’app nel browser.

Dopo la prima installazione basta usare il collegamento sul desktop. I preventivi vengono salvati automaticamente nel browser e possono essere esportati in PNG, stampati in PDF oppure salvati come file dati JSON.

## Avvio per sviluppo

```powershell
npm install
npm run dev
```
