---
slug: pautan-phishing
nama: "Phishing links (fake links)"
ringkasan: "One link in an SMS, WhatsApp message, email or QR code that leads to a fake login page — and takes your ID, password and OTP."
risiko: sangat-tinggi
susunan: 7
platform:
  - sms
  - whatsapp
  - telegram
  - e-mel
  - facebook
  - laman-web
  - kod-qr
juga_dikenali:
  - "Phishing"
  - "Smishing (phishing by SMS)"
  - "Quishing (phishing by QR code)"
  - "Fake links"
  - "Fake login pages"
red_flags:
  - "The link arrives with time pressure: “within 12 hours”, “before your account is suspended”, “today only”."
  - "The domain is almost the same as the real one but not identical — extra hyphens, extra letters, or a different domain ending."
  - "A shortened link or a QR code that does not show the full address before you open it."
  - "The page asks for your ID, password AND TAC/OTP in the same form."
  - "The page asks you to download an app file (APK) to “continue”."
  - "A page claiming to be government but not ending in .gov.my."
  - "The login “fails” repeatedly and you are asked to try again with a new OTP."
  - "The address contains odd characters, or starts with xn-- when you copy it."
  - "The page looks right but none of its other buttons work."
contoh_taktik:
  - tajuk: "SMS: your account will be suspended"
    mesej: "Notice: Your internet banking account will be suspended on 30/09 as your details are not updated. Please verify now: hxxps://maybank2u-com-my[.]top/verify"
    kenapa_bahaya: "The real domain here is maybank2u-com-my[.]top, not maybank2u.com.my. The dots were swapped for hyphens so the brand name still reads correctly at a glance. Banks do not suspend accounts through SMS links."
  - tajuk: "A promotional QR code in a public place"
    mesej: "Scan to claim your RM50 voucher. Limited to the first 100 customers today."
    kenapa_bahaya: "A QR code hides the address completely until it opens. Fake QR stickers are often pasted over real ones on parking meters, posters and receipts. Read the address your phone shows before continuing."
  - tajuk: "A login page that asks for the OTP twice"
    mesej: "Verification failed. Please re-enter the TAC number sent to your phone to continue your session."
    kenapa_bahaya: "The page is not verifying anything. It relays what you type to the syndicate, who are logging into your real account at that moment. Each OTP you give approves one transaction or one new device registration."
  - tajuk: "A “refund” email with an attachment"
    mesej: "Your refund claim of RM842.60 has been approved. Please open the attached form and complete your bank account details to receive payment within 3 working days."
    kenapa_bahaya: "Government agencies and banks do not collect account details through email attachments. The form harvests your banking details, and some attachments also install malware."
langkah_pantas:
  - "Close the page and enter nothing more, even if it says the login failed."
  - "If you already entered a password or OTP, call your bank now to freeze the account, then change your banking and email passwords."
  - "If you already installed an app from that link, turn off mobile data and Wi-Fi, remove the app, and factory reset the device if needed."
  - "If money has left your account, call NSRC 997 and file a police report. Report the link and sender number to MCMC."
kemas_kini: "2026-08-15"
---

## How it starts

Phishing does not start with a link. It starts with a sentence that stops you thinking.

The message always sounds like something that must be handled right now: your account will be suspended, a payment failed, reward points are expiring, a refund is waiting to be claimed, a parcel could not be delivered. It can arrive by SMS, WhatsApp, Telegram, email, a Facebook message, or a QR code stuck up in a public place.

The link takes you to a page that looks right. Right logo, right colours, right layout — because it was copied straight from the real site. The only difference is the address at the top of the browser.

Whatever you type on that page goes straight to the syndicate. In many cases they are logging into your real account at that same moment, using you as a machine that supplies OTPs. That is why fake pages so often say “failed, try again” — each attempt hands them a fresh code.

## How to read a web address properly

This is the most useful skill in this whole entry. The real domain is the **last two parts before the first slash**, read from right to left.

```
https://www.maybank2u.com.my/2u/login
        └──────┬──────────┘ └───┬───┘
           real domain        path (can say anything)
```

The four most common tricks:

| Address | Real domain | The trick |
| --- | --- | --- |
| `maybank2u.com.my.secure-login.top` | `secure-login.top` | The brand name is made a subdomain |
| `maybank2u-com-my.xyz` | `maybank2u-com-my.xyz` | Dots swapped for hyphens |
| `secure-login.top/maybank2u.com.my` | `secure-login.top` | The brand name hidden in the path |
| `mαybank2u.com.my` | a punycode domain | Latin letters replaced with lookalike characters |

Two simple rules settle most cases: official Malaysian government sites **always** end in `.gov.my`, and local banks use their own domain, which you can verify on a statement or the back of your card.

## Why it works

We read web addresses the way we read sentences — one glance, left to right, stopping as soon as we see something familiar. Syndicates build their addresses for exactly that weakness: the brand name goes on the left, where the eye stops.

Phones make it harder still. The address bar on a small screen truncates the end of the address, which is the part that matters most. QR codes show nothing at all until you open them.

And the message is deliberately sent while you are busy. The time pressure is not an accident — it is part of the design.

## How to protect yourself

Never open a banking or government link from a message. Open the official app, or type the address yourself. That single habit closes off almost this entire category.

Before typing anything into a login page, stop and read the address from right to left. If you are unsure, copy the address into this portal's [check tool](/semak) — it will show you the technical warning signs in that address.

Treat an OTP as a signature, not a password. It approves one specific action. Read the full OTP text message: if it mentions a transfer or a device registration when you were only trying to log in, stop everything and call your bank.

Turn on two-factor authentication on every important account, and never install an app from a link sent to you.
