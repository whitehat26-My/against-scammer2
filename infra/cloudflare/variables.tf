variable "zone_id" {
  description = "ID zon Cloudflare untuk domain portal."
  type        = string
}

variable "zone_name" {
  description = "Nama domain zon, cth. semakscam.my. Digunakan untuk dokumentasi rujukan sahaja."
  type        = string
}

variable "admin_ip_allowlist" {
  description = <<-EOT
    Senarai IP (atau CIDR) yang dibenarkan mencapai /moderasi dan /api/bukti di
    pinggir Cloudflare. Kosongkan untuk mematikan sekatan IP pinggir (panel masih
    dilindungi log masuk + MFA di aplikasi). Contoh: ["203.0.113.10", "198.51.100.0/24"].
  EOT
  type        = list(string)
  default     = []
}

variable "owasp_paranoia_level" {
  description = "Tahap sensitiviti OWASP Core Ruleset: low, medium, high. Mula dengan medium; naikkan selepas memantau positif palsu."
  type        = string
  default     = "medium"

  validation {
    condition     = contains(["low", "medium", "high"], var.owasp_paranoia_level)
    error_message = "owasp_paranoia_level mesti low, medium, atau high."
  }
}

variable "rate_limit_julat_per_minit" {
  description = "Had kadar pinggir untuk /api/laporan/julat setiap IP seminit. Lebih longgar daripada had aplikasi (120/5min) — pinggir menangkap banjir sebelum sampai ke origin."
  type        = number
  default     = 60
}

variable "rate_limit_lapor_per_minit" {
  description = "Had kadar pinggir untuk penghantaran /lapor (POST) setiap IP seminit."
  type        = number
  default     = 10
}

variable "rate_limit_masuk_per_minit" {
  description = "Had kadar pinggir untuk cubaan log masuk /moderasi (POST) setiap IP seminit."
  type        = number
  default     = 8
}

variable "cache_static_ttl" {
  description = "TTL pinggir (saat) untuk aset statik Next (/_next/static/*). Aset ini kekal (hashed), jadi TTL panjang selamat."
  type        = number
  default     = 2592000 # 30 hari
}
