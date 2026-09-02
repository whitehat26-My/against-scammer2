---
slug: parcel-scam
nama: "Parcel scam (fake delivery)"
ringkasan: "An SMS or call about a held parcel that leads to a fake payment page — or to an “officer” with a far more frightening story."
risiko: tinggi
susunan: 4
platform:
  - sms
  - whatsapp
  - panggilan
  - laman-web
juga_dikenali:
  - "Courier scam"
  - "Delivery fee scam"
  - "Parcel smishing"
red_flags:
  - "An SMS about a parcel when you are not expecting any delivery."
  - "The link uses a URL shortener or a domain that does not match the courier company."
  - "The fee asked for is tiny — RM2 to RM5 — so you pay without thinking."
  - "The payment page asks for your full card number, expiry date, CVV and then an OTP."
  - "After you enter the OTP a “failed” message appears and you are asked to try again."
  - "A follow-up call from a “customs officer” or “police officer” about illegal contents in the parcel."
  - "Pressure to act now or the parcel “will be returned” today."
contoh_taktik:
  - tajuk: "Delivery tax SMS"
    mesej: "Your parcel could not be delivered due to an incomplete address. Please update and settle RM3.20 within 12 hours: hxxps://pos-my-delivery[.]top/update"
    kenapa_bahaya: "That domain does not belong to the courier. The real target is not RM3.20 — it is your full card details and OTP, which are then used for much larger transactions."
  - tajuk: "The repeatedly “failed” OTP"
    mesej: "Payment failed. Please re-enter the verification code sent to your phone."
    kenapa_bahaya: "Each code you enter authorises one real transaction behind the scenes. The “failure” is how they harvest several OTPs in a row."
  - tajuk: "Escalation into a Macau scam"
    mesej: "Sir, the parcel in your name contains counterfeit bank cards and documents suspected of being used for money laundering. I will transfer you to the investigating officer."
    kenapa_bahaya: "Parcel scams are often the doorway into a Macau scam. That second stage is far more costly because it targets your entire savings."
langkah_pantas:
  - "Do not click the link. Check the delivery status in the courier's official app or on a web address you type yourself."
  - "If you already entered card details, call your bank at once to block the card and cancel the transaction."
  - "If you already gave an OTP, treat the account as exposed — call your bank and 997 now."
  - "Report the sender number and the link to MCMC."
kemas_kini: "2026-08-15"
---

## How it starts

You get an SMS or WhatsApp message saying your parcel could not be delivered. The reason is always small and believable: an incomplete address, an unpaid duty, nobody home.

The message contains a link. The page that opens looks almost exactly like the real courier's site — right logo, right colours, tidy form. The only difference is the domain.

The fee is small on purpose. RM3 is not worth thinking hard about, and that is the point. What is actually collected is your full card number, expiry date, CVV, and then your OTP.

Some cases stop there with unauthorised charges on the card. Others continue: days later you get a call about illegal contents in that parcel, and you are now inside a Macau scam.

## Why it works

Almost everyone is waiting for something. With the volume of online shopping today, a message about a held parcel nearly always arrives at a plausible moment.

The small amount lowers your defences too. Our brains judge risk by the amount requested, not by the data handed over. RM3.20 feels like a small decision, when what you actually gave away were the keys to your account.

## How to protect yourself

Never open a tracking link from a message. Open the courier's official app, or type their website address yourself, and enter the tracking number there.

Read the domain letter by letter before entering anything. Official Malaysian company sites usually end in `.com.my` or `.com`, not an unusual domain ending.

Remember that an OTP is permission for one transaction. If a page keeps asking you to re-enter it because of a “failure”, you are authorising several transactions in a row. Stop and call your bank.
