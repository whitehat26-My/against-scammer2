---
slug: penyamaran-pegawai
nama: "Government & bank officer impersonation"
ringkasan: "Calls, texts or messages claiming to come from your bank, LHDN, JPJ, EPF or a telco — aimed at getting your OTP, password or an app installed."
risiko: sangat-tinggi
susunan: 6
platform:
  - panggilan
  - sms
  - whatsapp
  - e-mel
  - laman-web
juga_dikenali:
  - "Fake bank officer scam"
  - "LHDN / JPJ / EPF scam"
  - "OTP phishing"
  - "APK scam"
red_flags:
  - "The caller claims to be from your bank and already knows some of your details."
  - "An urgent message: your credit card has been charged, your account will be frozen, an insurance policy has been activated."
  - "You are asked to verify your identity by giving an OTP, PIN, password or security answers."
  - "You are asked to install an app from a link (an APK file) so the problem can be “fixed remotely”."
  - "The caller ID looks identical to the bank's official number — numbers can be spoofed."
  - "An SMS contains a link to a banking login page that imitates the real one."
  - "An “LHDN” or “EPF” email about a refund that requires you to enter account details."
  - "Pressure to act immediately and not to end the call."
contoh_taktik:
  - tajuk: "An unrecognised credit card charge"
    mesej: "This is the bank's fraud unit. We detected a RM4,299 transaction at an electronics store in Johor. If this was not you, I can cancel it now. To cancel, please confirm the 6-digit code just sent to your phone."
    kenapa_bahaya: "That code cancels nothing. It authorises a transaction or registers a new device. A real bank officer will never ask for an OTP under any circumstances."
  - tajuk: "Installing a support app"
    mesej: "So we can inspect your account, please download our support app from this link and allow screen permission. It is only for the duration of this call."
    kenapa_bahaya: "The APK gives the syndicate the ability to read your screen and intercept SMS, including OTPs. Once installed, they can enter your banking app without asking you anything further."
  - tajuk: "Tax refund"
    mesej: "LHDN: You are eligible for a tax refund of RM1,268.40. Please update your bank account details before the 30th to receive payment: hxxps://lhdn-refund-my[.]xyz"
    kenapa_bahaya: "Malaysian government agencies use `.gov.my` domains. This page exists to harvest your banking login details."
langkah_pantas:
  - "End the call and phone your bank using the number on the back of your card."
  - "If you gave an OTP, call the bank to freeze the account and change your passwords immediately."
  - "If you installed an app, turn off mobile data and Wi-Fi, remove the app, and factory reset the device if needed."
  - "Call 997 and file a police report if money has left your account."
kemas_kini: "2026-08-15"
---

## How it starts

Every version of this scam shares one goal: to make you hand over the keys to your own account.

It may arrive as a call from a “bank fraud unit” about a suspicious charge. It may be an SMS about an insurance policy that has been activated, or an LHDN email about a tax refund. Sometimes it is a message from a “telco” about reward points about to expire.

The convincing part is the detail. They may know your full name, the last four digits of your card, or which bank you use. That information comes from data leaks sold online.

Once trust is established, the real request appears: confirm the 6-digit code, enter your password on a linked page, or install an app so they can “help remotely”.

## Why it works

This script reverses the roles. You are not asked to give money — you are asked to stop something bad from happening. The urge to protect your own money makes people move faster than greed ever does.

Caller ID spoofing makes it harder still. Your bank's official number can appear on your screen even when the call comes from somewhere else, so checking the caller's number proves nothing.

## How to protect yourself

The rule is simple and has no exceptions: **no bank, police or government officer will ever ask for your OTP, password or PIN.** Anyone who asks, however convincing, is not an officer.

End the call and dial back using an official number you look up yourself. If the call was genuine, the bank can confirm it on their official line.

Never install an app from a link sent to you. Download only through official app stores, and be careful with any app requesting permission to read SMS or to display over other apps.

For government matters, type the address yourself and make sure it ends in `.gov.my`.
