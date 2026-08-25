'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type QuoteData = {
  brand: string; division: string; agentName: string; agentGroup: string; headline: string; audience: string;
  offerLabel: string; installment: string; amount: string; duration: string; tan: string; taeg: string; teg: string;
  insurance: string; product: string; customerName: string; birthDate: string; hireDate: string; jobType: string;
  employer: string; branch: string; benefitOneTitle: string; benefitOneText: string; benefitTwoTitle: string;
  benefitTwoText: string; benefitThreeTitle: string; benefitThreeText: string; benefitFourTitle: string;
  benefitFourText: string; footerClaim: string; footerContact: string; phone: string;
};

const initialData: QuoteData = {
  brand: 'BENIFIN', division: 'Cessioni del Quinto e Deleghe', agentName: 'BIBANCA', agentGroup: 'Gruppo BPER',
  headline: 'LA CONVENIENZA\nCHE TI MERITI.', audience: 'TASSI IN CONVENZIONE PER\nDIPENDENTI STATALI, PUBBLICI\nE PENSIONATI.',
  offerLabel: 'OFFERTA AGOSTO', installment: '310,00', amount: '30.225,42', duration: '120 mesi', tan: '4,276%',
  taeg: '4,37%', teg: '4,37%', insurance: 'NET', product: 'MEF - CESSIONE DEL QUINTO',
  customerName: 'LAURA ANTONELLA PIRAS', birthDate: '04/03/1985', hireDate: '01/10/2026', jobType: 'DIPENDENTE STATALE',
  employer: "MINISTERO DELL’ISTRUZIONE\nE DEL MERITO", branch: '0554-LS G. MARCONI', benefitOneTitle: 'ZERO SPESE',
  benefitOneText: 'Istruttoria, bolli e\ncommissioni di distribuzione\n€ 0,00', benefitTwoTitle: 'TRASPARENZA TOTALE',
  benefitTwoText: 'Nessun costo nascosto,\nmassima chiarezza\nfin dal preventivo', benefitThreeTitle: 'RATA FISSA',
  benefitThreeText: 'Importo sempre\nuguale per tutta\nla durata', benefitFourTitle: 'ESITO RAPIDO',
  benefitFourText: 'Valutazione e risposta\nin tempi brevi', footerClaim: 'La soluzione semplice,\nsicura e conveniente.',
  footerContact: 'Contattaci subito per maggiori informazioni', phone: '327 3691751',
};

const sections: Array<{ title: string; description: string; fields: Array<{ key: keyof QuoteData; label: string; multiline?: boolean }> }> = [
  { title: 'Intestazione e offerta', description: 'Marchio, messaggio principale e rata', fields: [
    { key: 'brand', label: 'Marchio' }, { key: 'division', label: 'Divisione' }, { key: 'agentName', label: 'Agente' },
    { key: 'agentGroup', label: 'Gruppo' }, { key: 'headline', label: 'Titolo', multiline: true },
    { key: 'audience', label: 'Destinatari', multiline: true }, { key: 'offerLabel', label: 'Etichetta offerta' },
    { key: 'installment', label: 'Rata mensile (€)' },
  ] },
  { title: 'Dati finanziari', description: 'Importi, tassi e prodotto', fields: [
    { key: 'amount', label: 'Importo erogabile (€)' }, { key: 'duration', label: 'Durata' }, { key: 'tan', label: 'TAN fisso' },
    { key: 'taeg', label: 'TAEG' }, { key: 'teg', label: 'TEG' }, { key: 'insurance', label: 'Compagnia assicurativa' },
    { key: 'product', label: 'Prodotto' },
  ] },
  { title: 'Dati cliente', description: 'Anagrafica e informazioni lavorative', fields: [
    { key: 'customerName', label: 'Nome e cognome' }, { key: 'birthDate', label: 'Data di nascita' },
    { key: 'hireDate', label: 'Data di assunzione' }, { key: 'jobType', label: 'Tipo di lavoro' },
    { key: 'employer', label: 'Ente di appartenenza', multiline: true }, { key: 'branch', label: 'Sede di servizio' },
  ] },
  { title: 'Vantaggi e contatti', description: 'Testi finali e recapito', fields: [
    { key: 'benefitOneTitle', label: 'Vantaggio 1 — titolo' }, { key: 'benefitOneText', label: 'Vantaggio 1 — testo', multiline: true },
    { key: 'benefitTwoTitle', label: 'Vantaggio 2 — titolo' }, { key: 'benefitTwoText', label: 'Vantaggio 2 — testo', multiline: true },
    { key: 'benefitThreeTitle', label: 'Vantaggio 3 — titolo' }, { key: 'benefitThreeText', label: 'Vantaggio 3 — testo', multiline: true },
    { key: 'benefitFourTitle', label: 'Vantaggio 4 — titolo' }, { key: 'benefitFourText', label: 'Vantaggio 4 — testo', multiline: true },
    { key: 'footerClaim', label: 'Claim finale', multiline: true }, { key: 'footerContact', label: 'Invito al contatto' },
    { key: 'phone', label: 'Telefono' },
  ] },
];

function Lines({ value }: { value: string }) {
  const lines = value.split('\n');
  return lines.map((line, index) => <span key={`${line}-${index}`}>{line}{index < lines.length - 1 ? <br /> : null}</span>);
}

function Metric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return <div className="metric"><span className="metric-icon" aria-hidden="true">{icon}</span><span className="metric-copy"><span className="metric-label">{label}</span><strong>{value}</strong></span></div>;
}

function PersonDatum({ icon, label, value }: { icon: string; label: string; value: string }) {
  return <div className="person-datum"><span className="person-icon" aria-hidden="true">{icon}</span><span><span className="person-label">{label}</span><strong><Lines value={value} /></strong></span></div>;
}

function Benefit({ icon, title, value }: { icon: string; title: string; value: string }) {
  return <div className="benefit"><span className="benefit-icon" aria-hidden="true">{icon}</span><span><strong>{title}</strong><small><Lines value={value} /></small></span></div>;
}

export default function Home() {
  const [data, setData] = useState<QuoteData>(initialData);
  const [openSections, setOpenSections] = useState<number[]>([0, 1, 2]);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem('benifin-quote-draft');
    if (!stored) return;
    try { setData({ ...initialData, ...JSON.parse(stored) }); }
    catch { window.localStorage.removeItem('benifin-quote-draft'); }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.localStorage.setItem('benifin-quote-draft', JSON.stringify(data));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1200);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [data]);

  const fileName = useMemo(() => {
    const customer = data.customerName.trim().toLowerCase().replace(/[^a-z0-9à-ÿ]+/gi, '-').replace(/^-|-$/g, '');
    return `preventivo-${customer || 'cliente'}`;
  }, [data.customerName]);

  const update = (key: keyof QuoteData, value: string) => setData((current) => ({ ...current, [key]: value }));
  const toggleSection = (index: number) => setOpenSections((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `${fileName}.json`; link.click(); URL.revokeObjectURL(link.href);
  };

  const importJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    try { setData({ ...initialData, ...JSON.parse(await file.text()) }); }
    catch { window.alert('Il file selezionato non è un preventivo valido.'); }
    event.target.value = '';
  };

  const downloadPng = async () => {
    if (!quoteRef.current) return;
    setExporting(true);
    try {
      const { toPng } = await import('html-to-image');
      const url = await toPng(quoteRef.current, { width: 700, height: 1058, pixelRatio: 2, cacheBust: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a'); link.href = url; link.download = `${fileName}.png`; link.click();
    } catch { window.alert('Non è stato possibile creare il PNG. Riprova tra qualche istante.'); }
    finally { setExporting(false); }
  };

  return <main className="app-shell">
    <header className="app-header">
      <div className="app-brand"><span className="brand-mark">B</span><span><strong>Preventivatore</strong><small>Benifin · Cessione del quinto</small></span></div>
      <div className="header-actions">
        <span className={`save-status ${saved ? 'is-visible' : ''}`}>✓ Salvato</span>
        <button className="button ghost" type="button" onClick={() => setData(initialData)}>Ripristina</button>
        <button className="button secondary" type="button" onClick={() => window.print()}>Stampa / PDF</button>
        <button className="button primary" type="button" onClick={downloadPng} disabled={exporting}>{exporting ? 'Creo il file…' : 'Scarica PNG'}</button>
      </div>
    </header>

    <div className="workspace">
      <aside className="editor-panel">
        <div className="editor-intro"><span className="eyebrow">Contenuti del preventivo</span><h1>Modifica solo ciò che serve.</h1><p>La grafica rimane bloccata. Ogni variazione appare subito nell’anteprima.</p></div>
        <div className="section-list">
          {sections.map((section, sectionIndex) => {
            const isOpen = openSections.includes(sectionIndex);
            return <section className={`form-section ${isOpen ? 'is-open' : ''}`} key={section.title}>
              <button className="section-trigger" type="button" onClick={() => toggleSection(sectionIndex)} aria-expanded={isOpen}>
                <span className="section-number">{sectionIndex + 1}</span><span className="section-title"><strong>{section.title}</strong><small>{section.description}</small></span><span className="chevron">⌄</span>
              </button>
              {isOpen ? <div className="field-grid">{section.fields.map((field) => <label className="field" key={field.key}><span>{field.label}</span>{field.multiline ? <textarea value={data[field.key]} rows={3} onChange={(event) => update(field.key, event.target.value)} /> : <input value={data[field.key]} onChange={(event) => update(field.key, event.target.value)} />}</label>)}</div> : null}
            </section>;
          })}
        </div>
        <div className="draft-tools"><div><strong>Bozza portatile</strong><small>Salva i dati e riaprili su un altro dispositivo.</small></div><div className="draft-buttons"><button className="button ghost compact" type="button" onClick={() => importRef.current?.click()}>Carica</button><button className="button ghost compact" type="button" onClick={downloadJson}>Salva dati</button><input ref={importRef} type="file" accept="application/json" hidden onChange={importJson} /></div></div>
      </aside>

      <section className="preview-panel" aria-label="Anteprima preventivo">
        <div className="preview-topline"><div><span className="eyebrow">Anteprima live</span><strong>Formato verticale · 700 × 1058 px</strong></div><span className="locked-pill">🔒 Grafica bloccata</span></div>
        <div className="sheet-viewport">
          <div className="quote-sheet" ref={quoteRef}>
            <img className="template-art" src="/preventivo-base.png" alt="" aria-hidden="true" />
            <div className="top-division">{data.division}</div>
            <div className="top-copy"><div className="sheet-brand">{data.brand}</div><div className="brand-arc" /><div className="agent-line">Agente <strong>{data.agentName}</strong></div><div className="agent-group">{data.agentGroup}</div><div className="main-headline"><Lines value={data.headline} /></div><div className="lime-rule" /><div className="audience-copy"><Lines value={data.audience} /></div></div>
            <div className="offer-label">{data.offerLabel}</div>
            <div className="installment-card"><span>RATA MENSILE</span><strong><i>€</i> {data.installment}</strong></div>
            <div className="metrics-card"><div className="metrics-grid">
              <Metric icon="€" label="IMPORTO EROGABILE" value={`€ ${data.amount}`} /><Metric icon="▣" label="DURATA" value={data.duration} /><Metric icon="%" label="TAN FISSO" value={data.tan} />
              <Metric icon="%" label="TAEG" value={data.taeg} /><Metric icon="%" label="TEG" value={data.teg} /><Metric icon="◇" label="COMPAGNIA ASSICURATIVA" value={data.insurance} />
            </div><div className="product-ribbon"><span>✓</span> PRODOTTO: {data.product}</div></div>
            <div className="person-card"><div className="person-column"><PersonDatum icon="●" label="NOME E COGNOME" value={data.customerName} /><PersonDatum icon="▦" label="DATA DI NASCITA" value={data.birthDate} /><PersonDatum icon="▣" label="DATA DI ASSUNZIONE" value={data.hireDate} /></div><div className="person-column"><PersonDatum icon="♜" label="TIPO DI LAVORO" value={data.jobType} /><PersonDatum icon="▰" label="ENTE DI APPARTENENZA" value={data.employer} /><PersonDatum icon="▤" label="SEDE DI SERVIZIO" value={data.branch} /></div></div>
            <div className="benefits-row"><Benefit icon="♢" title={data.benefitOneTitle} value={data.benefitOneText} /><Benefit icon="▤" title={data.benefitTwoTitle} value={data.benefitTwoText} /><Benefit icon="▣" title={data.benefitThreeTitle} value={data.benefitThreeText} /><Benefit icon="◷" title={data.benefitFourTitle} value={data.benefitFourText} /></div>
            <div className="sheet-footer"><div className="footer-stamp"><strong>{data.brand}</strong><span>Agente {data.agentName}</span><small>{data.agentGroup}</small></div><div className="footer-claim"><Lines value={data.footerClaim} /></div><div className="footer-contact"><small>{data.footerContact}</small><strong><span>◔</span> {data.phone}</strong></div></div>
          </div>
        </div>
        <p className="preview-note">Il preventivo viene salvato automaticamente in questo browser.</p>
      </section>
    </div>
  </main>;
}
