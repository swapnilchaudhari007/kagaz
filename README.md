# Kagaz — never make a second trip

![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?logo=javascript&logoColor=white) ![i18n](https://img.shields.io/badge/i18n-EN%20%C2%B7%20%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A5%80%20%C2%B7%20%E0%A4%AE%E0%A4%B0%E0%A4%BE%E0%A4%A0%E0%A5%80-orange) ![hackathon](https://img.shields.io/badge/hackathon-Hyperbloom%20October-purple) [![demo](https://img.shields.io/badge/demo-live-success)](https://swapnilchaudhari007.github.io/kagaz/) [![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Kagaz** (कागज़, "paper") helps you walk into a government office with every document you need, the first time.

You pick the task — passport, licence renewal, Aadhaar address change, income certificate — and Kagaz shows you exactly what to carry, how many photocopies, and how many photos. Before you leave home, a one-minute **Door Check** goes through your bag with you, one card at a time. And **My papers** keeps an eye on the stuff that expires quietly, like PUC and insurance.

Built for the **Hyperbloom October — UI/UX and Web Design** hackathon.

**Live demo:** https://swapnilchaudhari007.github.io/kagaz/

---

## Why

Almost everyone in India has a story about going back to an office because of one missing paper. A photocopy you didn't know about. The "any one of these" rule nobody explained. The medical certificate you only need after 40.

The information is usually out there, but it's buried in long PDFs and written for the office, not for the person standing in the queue. Kagaz turns it into a checklist you can actually follow.

## What it does

| Feature | What it means for you |
|---|---|
| **Task checklists** | Documents grouped the way offices think about them: *bring all of these*, *pick any ONE*, *only if it applies*. |
| **Bag count** | Live total of originals, photocopies and photos — so you know to make 6 xerox, not 4. |
| **Readiness ring + stamp** | Fills as you tick things off. When you're done, it gets a "READY" stamp. |
| **Door Check** | Full-screen, one document per card, big buttons. "It's in my bag" / "I don't have it". Ends with either "you're good to go" or the exact list of what's missing. Works with keyboard (Y / N, arrow keys). |
| **My papers** | Add any document with an expiry date. Colour-coded timeline: expired, renew soon (30 days), all good. |
| **Read aloud** | Reads the whole checklist using the browser's voice, in English, Hindi or Marathi. |
| **Print / Share** | A clean printable list, or share it on WhatsApp with a family member who's going instead of you. |

## Accessibility

This was the starting point, not an add-on. The people who struggle most with paperwork are often elderly parents, first-time applicants, and people more comfortable in their own language.

- **Comfort panel**: English / हिंदी / मराठी, three text sizes, high-contrast mode, an easy-read font (Lexend), and a "less motion" switch. Choices stay on the device.
- Atkinson Hyperlegible as the default font — designed for low-vision readers.
- Every tap target is at least 44px. The Door Check buttons are 64px tall.
- Skip link, visible focus rings, landmarks, labelled controls, focus trap in the Door Check dialog, `aria-live` updates when your readiness changes.
- Respects `prefers-reduced-motion`.
- Works at 320px wide with no sideways scrolling. On phones, a bottom dock keeps your progress and the Door Check button in reach.

## Run it

No build step. No backend.

```bash
git clone https://github.com/Swapnilchaudhari007/kagaz.git
cd kagaz
python3 -m http.server 8000
# open http://localhost:8000
```

Or just open `index.html` in a browser.

## Tech

Plain HTML, CSS and JavaScript. Hash routing, `localStorage` for your ticks and papers, the Web Speech API for read-aloud, and the Web Share API for sharing. About 30 KB total before fonts.

```
index.html   page shell, comfort panel
styles.css   design tokens, layouts, print styles, contrast + easy-read themes
app.js       router, checklist logic, Door Check, My papers, read-aloud
data.js      task + document data
i18n.js      English / Hindi / Marathi strings
```

## A note on the data

The document lists are a general guide I put together for this prototype. Rules differ by state and change over time, so every task links to its official portal. Please check there before you go.

## What's next

- Office-specific notes added by people who just visited ("counter 3 needs two copies, not one")
- Reminders by SMS / WhatsApp before a paper expires
- More tasks and more Indian languages
- A "send this list to someone" mode for family members running the errand

## License

MIT — see [LICENSE](LICENSE).

Made by [Swapnil Chaudhari](https://www.linkedin.com/in/swapnil-chaudhari-533a25105) in Thane.
