module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.RESEND_FROM;
  if (!apiKey || !sender) {
    return res.status(503).json({ error: "El envío de correo todavía no está configurado en el servidor." });
  }

  const body = req.body || {};
  if (typeof body.website === "string" && body.website.trim()) {
    return res.status(200).json({ ok: true });
  }

  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().slice(0, 254);
  const topic = String(body.topic || "").trim().slice(0, 120);
  const budget = String(body.budget || "No especificado").trim().slice(0, 80);
  const message = String(body.message || "").trim().slice(0, 5000);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !emailPattern.test(email) || !topic || !message) {
    return res.status(400).json({ error: "Revisa tu nombre, correo y los campos obligatorios." });
  }

  const text = [
    "Nueva solicitud desde la web de Tormenta Studio",
    "",
    `Nombre: ${name}`,
    `Correo del cliente: ${email}`,
    `Motivo: ${topic}`,
    `Presupuesto aproximado: ${budget}`,
    "",
    "Detalles del proyecto:",
    message
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: sender,
        to: ["tormenta-studio.ofc@proton.me"],
        reply_to: email,
        subject: `Nueva solicitud: ${topic}`,
        text
      })
    });

    if (!response.ok) {
      return res.status(502).json({ error: "El servicio de correo no pudo aceptar el mensaje. Inténtalo más tarde." });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(502).json({ error: "No fue posible conectar con el servicio de correo." });
  }
};
