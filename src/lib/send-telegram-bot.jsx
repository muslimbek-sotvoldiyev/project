const TELEGRAM_BOT_TOKEN = "8544432738:AAETY9YvsxmaT4qFmsSyBzogTGlLV0jFpos"
const TELEGRAM_CHAT_ID = "5399593238"
// const TELEGRAM_BOT_TOKEN = "TOKEN"
// const TELEGRAM_CHAT_ID = "CHAT_ID"

function escapeMarkdown(text = "") {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

export async function sendToTelegram(data) {
  const message = [
    "🎓 *Yangi o'quvchi ro'yxatdan o'tdi\\!*",
    "",
    `👤 *Ismi:* ${escapeMarkdown(data.firstname)}`,
    `👤 *Familiyasi:* ${escapeMarkdown(data.lastname)}`,
    `👨 *Otasining ismi:* ${escapeMarkdown(data.fathername)}`,
    `📱 *Telefon \\(bosh\\):* ${escapeMarkdown(data.phone)}`,
    data.phone2
      ? `📱 *Telefon \\(ikkinchi\\):* \\+998 ${escapeMarkdown(data.phone2)}`
      : null,
    `🏫 *Maktab:* ${escapeMarkdown(data.school)}`,
    `📚 *Sinfi:* ${escapeMarkdown(data.grade)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "MarkdownV2",
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Telegram API error: ${JSON.stringify(errorData)}`)
  }
}