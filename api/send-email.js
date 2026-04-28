export const config = { runtime: 'edge' };

const RESEND_KEY = "re_3sQMf6qG_CkGvbL5VMGF3VYhXM9Ad89YH";

export default async function handler(req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { tipo, nome, email, argomento, risposta } = await req.json();

    const topicLabels = {
      solitudine:  "🌙 Solitudine e compagnia",
      stress:      "🌊 Stress e lavoro",
      famiglia:    "🏡 Famiglia e relazioni",
      tristezza:   "🍂 Tristezza e umore",
      chiacchiere: "☀️ Chiacchiere e tutto il resto",
    };
    const topicLabel = topicLabels[argomento] || argomento;

    let subject, html;

    if (tipo === 'conferma') {
      subject = "La tua lettera è arrivata 📜";
      html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#1a0d05;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">
        <tr><td style="background:linear-gradient(135deg,#2a1208,#1a0a04);padding:30px 40px;text-align:center;border-radius:4px 4px 0 0;border:1px solid rgba(180,120,30,0.4);border-bottom:none;">
          <div style="font-family:Georgia,serif;font-size:28px;color:#f0c030;letter-spacing:6px;margin-bottom:6px;">UN AMICO</div>
          <div style="font-size:13px;color:rgba(200,155,50,0.65);font-style:italic;">unamico.eu</div>
        </td></tr>
        <tr><td style="background:linear-gradient(160deg,#f8ebb5,#f2dc90,#f8e8b0,#edd878);padding:40px 44px;border-left:1px solid rgba(140,90,20,0.4);border-right:1px solid rgba(140,90,20,0.4);">
          <div style="font-family:Georgia,serif;font-size:13px;color:rgba(60,28,4,0.55);text-align:center;letter-spacing:4px;margin-bottom:24px;">✦ ── ✦ ── ✦</div>
          <div style="font-family:Georgia,serif;font-size:22px;color:#1a0c02;text-align:center;letter-spacing:3px;margin-bottom:20px;">Caro ${nome},</div>
          <div style="font-size:16px;color:#1a0c02;line-height:1.9;margin-bottom:20px;">
            la tua lettera è arrivata.<br/><br/>
            Hai scelto di scrivere di <strong>${topicLabel}</strong>.<br/><br/>
            Leggerò le tue parole con attenzione e ti risponderò con calma, come farebbe un vero amico.<br/><br/>
            <em>L'attesa fa parte del viaggio.</em>
          </div>
          <div style="font-family:Georgia,serif;font-size:13px;color:rgba(60,28,4,0.55);text-align:center;letter-spacing:4px;margin-top:28px;">✦ ── ✦ ── ✦</div>
        </td></tr>
        <tr><td style="background:#1a0a04;padding:20px 40px;text-align:center;border-radius:0 0 4px 4px;border:1px solid rgba(140,90,20,0.4);border-top:none;">
          <div style="font-size:12px;color:rgba(200,155,50,0.5);font-style:italic;">Un Amico · unamico.eu</div>
          <div style="font-size:11px;color:rgba(200,155,50,0.35);margin-top:4px;">Non rispondere a questa email — usa il sito per scrivere</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
    } else {
      subject = `${nome}, hai ricevuto una lettera 📜`;
      html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#1a0d05;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">
        <tr><td style="background:linear-gradient(135deg,#2a1208,#1a0a04);padding:30px 40px;text-align:center;border-radius:4px 4px 0 0;border:1px solid rgba(180,120,30,0.4);border-bottom:none;">
          <div style="font-family:Georgia,serif;font-size:28px;color:#f0c030;letter-spacing:6px;margin-bottom:6px;">UN AMICO</div>
          <div style="font-size:13px;color:rgba(200,155,50,0.65);font-style:italic;">unamico.eu</div>
        </td></tr>
        <tr><td style="background:linear-gradient(160deg,#f8ebb5,#f2dc90,#f8e8b0,#edd878);padding:40px 44px;border-left:1px solid rgba(140,90,20,0.4);border-right:1px solid rgba(140,90,20,0.4);">
          <div style="font-family:Georgia,serif;font-size:13px;color:rgba(60,28,4,0.55);text-align:center;letter-spacing:4px;margin-bottom:24px;">✦ ── ✦ ── ✦</div>
          <div style="font-size:16px;color:#1a0c02;line-height:2;white-space:pre-line;">${risposta}</div>
          <div style="font-family:Georgia,serif;font-size:13px;color:rgba(60,28,4,0.55);text-align:center;letter-spacing:4px;margin-top:28px;">✦ ── ✦ ── ✦</div>
          <div style="text-align:center;margin-top:20px;">
            <a href="https://unamico.eu" style="display:inline-block;padding:12px 28px;background:#1a0a04;color:#f0c030;text-decoration:none;font-family:Georgia,serif;font-size:13px;letter-spacing:3px;border:1px solid rgba(180,120,30,0.5);border-radius:3px;">SCRIVI ANCORA</a>
          </div>
        </td></tr>
        <tr><td style="background:#1a0a04;padding:20px 40px;text-align:center;border-radius:0 0 4px 4px;border:1px solid rgba(140,90,20,0.4);border-top:none;">
          <div style="font-size:12px;color:rgba(200,155,50,0.5);font-style:italic;">Un Amico · unamico.eu</div>
          <div style="font-size:11px;color:rgba(200,155,50,0.35);margin-top:4px;">Non rispondere a questa email — usa il sito per scrivere</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_KEY}`
      },
      body: JSON.stringify({
        from: "Un Amico <ciao@unamico.eu>",
        to: [email],
        subject,
        html,
      })
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
