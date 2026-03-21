// ---------------------------------------------------------------------------
// NeoByteWriter — Email HTML templates (inline CSS for email compatibility)
// All text in Italian.
// ---------------------------------------------------------------------------

const BRAND_COLOR = "#000000";
const BRAND_BG = "#f9f9f9";
const UNSUBSCRIBE_URL = "{{UNSUBSCRIBE_URL}}";

// ---------------------------------------------------------------------------
// Base wrapper – header / footer shared by every email
// ---------------------------------------------------------------------------

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:${BRAND_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND_BG};">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;">
        <!-- Header -->
        <tr>
          <td style="padding:32px 40px;background-color:${BRAND_COLOR};text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">NeoByteWriter</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;background-color:#fafafa;border-top:1px solid #e5e5e5;text-align:center;">
            <p style="margin:0 0 8px;color:#999999;font-size:12px;">
              NeoByteWriter &mdash; Il tuo assistente di scrittura creativa
            </p>
            <p style="margin:0;color:#999999;font-size:12px;">
              <a href="${UNSUBSCRIBE_URL}" style="color:#999999;text-decoration:underline;">Annulla iscrizione</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

export function welcomeEmail(name: string): { subject: string; html: string } {
  const displayName = name || "Scrittore";
  return {
    subject: "Benvenuto su NeoByteWriter!",
    html: baseTemplate(`
      <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;font-weight:600;">
        Ciao ${displayName}, benvenuto!
      </h2>
      <p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.6;">
        Siamo felici di averti a bordo. NeoByteWriter ti aiuterà a dare vita
        alle tue storie con strumenti di scrittura avanzati e assistenza AI.
      </p>
      <p style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.6;">
        Ecco cosa puoi fare subito:
      </p>
      <ul style="margin:0 0 24px;padding-left:20px;color:#333333;font-size:15px;line-height:1.8;">
        <li>Crea il tuo primo progetto di scrittura</li>
        <li>Organizza capitoli, personaggi e ambientazioni</li>
        <li>Usa l'AI per superare il blocco dello scrittore</li>
      </ul>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr><td style="background-color:${BRAND_COLOR};border-radius:6px;">
          <a href="{{APP_URL}}" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
            Inizia a scrivere
          </a>
        </td></tr>
      </table>
    `),
  };
}

export function trialExpiringEmail(
  name: string,
  daysLeft: number
): { subject: string; html: string } {
  const displayName = name || "Scrittore";
  const dayWord = daysLeft === 1 ? "giorno" : "giorni";
  return {
    subject: `Il tuo periodo di prova scade tra ${daysLeft} ${dayWord}`,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;font-weight:600;">
        Ciao ${displayName},
      </h2>
      <p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.6;">
        Il tuo periodo di prova gratuito su NeoByteWriter scade tra
        <strong>${daysLeft} ${dayWord}</strong>.
      </p>
      <p style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.6;">
        Per continuare ad usare tutte le funzionalità avanzate, inclusa
        l'assistenza AI e l'esportazione professionale, passa a un piano a
        pagamento.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr><td style="background-color:${BRAND_COLOR};border-radius:6px;">
          <a href="{{APP_URL}}/settings/billing" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
            Scopri i piani
          </a>
        </td></tr>
      </table>
    `),
  };
}

export function streakLostEmail(
  name: string,
  previousStreak: number
): { subject: string; html: string } {
  const displayName = name || "Scrittore";
  return {
    subject: "La tua serie di scrittura si è interrotta",
    html: baseTemplate(`
      <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;font-weight:600;">
        Ciao ${displayName},
      </h2>
      <p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.6;">
        La tua serie di scrittura di <strong>${previousStreak} giorni</strong>
        si è purtroppo interrotta. Non preoccuparti, succede a tutti!
      </p>
      <p style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.6;">
        La cosa importante è ricominciare. Anche solo poche righe al giorno
        possono fare una grande differenza per il tuo progetto.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr><td style="background-color:${BRAND_COLOR};border-radius:6px;">
          <a href="{{APP_URL}}" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
            Riprendi a scrivere
          </a>
        </td></tr>
      </table>
    `),
  };
}

export function inactivityEmail(
  name: string,
  daysSinceLastWrite: number
): { subject: string; html: string } {
  const displayName = name || "Scrittore";
  return {
    subject: "Ci manchi! Le tue storie ti aspettano",
    html: baseTemplate(`
      <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;font-weight:600;">
        Ciao ${displayName},
      </h2>
      <p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.6;">
        Sono passati <strong>${daysSinceLastWrite} giorni</strong> dalla tua
        ultima sessione di scrittura. Le tue storie ti stanno aspettando!
      </p>
      <p style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.6;">
        A volte basta riaprire un capitolo e rileggere qualche riga per
        ritrovare l'ispirazione. Provaci, ti sorprenderai.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr><td style="background-color:${BRAND_COLOR};border-radius:6px;">
          <a href="{{APP_URL}}" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
            Torna a scrivere
          </a>
        </td></tr>
      </table>
    `),
  };
}

export function exportReadyEmail(
  name: string,
  projectTitle: string
): { subject: string; html: string } {
  const displayName = name || "Scrittore";
  return {
    subject: `Il tuo export di "${projectTitle}" è pronto`,
    html: baseTemplate(`
      <h2 style="margin:0 0 16px;color:${BRAND_COLOR};font-size:20px;font-weight:600;">
        Ciao ${displayName},
      </h2>
      <p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.6;">
        L'esportazione del tuo progetto
        <strong>&ldquo;${projectTitle}&rdquo;</strong> è stata completata
        con successo.
      </p>
      <p style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.6;">
        Puoi scaricare il file dalla pagina del progetto.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr><td style="background-color:${BRAND_COLOR};border-radius:6px;">
          <a href="{{APP_URL}}" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
            Vai al progetto
          </a>
        </td></tr>
      </table>
    `),
  };
}
