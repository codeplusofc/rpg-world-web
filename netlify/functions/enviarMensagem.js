const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    const body = JSON.parse(event.body || "{}");
    const { chatId, message, sender } = body;

    if (!chatId || !message) {
      return { statusCode: 400, body: JSON.stringify({ error: "chatId and message required" }) };
    }

    await pusher.trigger("mensagem-rpg", "nova-mensagem", {
      chatId,
      message,
      sender: sender || "Jogador"
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sucesso: true })
    };
  } catch (err) {
    console.error("Erro enviarMensagem:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
  }
};