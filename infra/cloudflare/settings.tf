# Tetapan peringkat zon: TLS, HTTPS, dan HSTS.
#
# SSL "strict" (Full (strict)) MEWAJIBKAN sijil sah pada origin — samada sijil
# platform hos (Vercel/Netlify) atau Cloudflare Origin CA. Ini menghalang
# serangan MITM antara Cloudflare dan origin. Jangan guna "flexible": ia
# menyulitkan hanya separuh jalan dan memecahkan pelbagai andaian keselamatan.

resource "cloudflare_zone_settings_override" "portal" {
  zone_id = var.zone_id

  settings {
    ssl                      = "strict"
    always_use_https         = "on"
    min_tls_version          = "1.2"
    tls_1_3                  = "on"
    automatic_https_rewrites = "on"
    opportunistic_encryption = "on"
    brotli                   = "on"
    security_level           = "medium"
    browser_check            = "on"
    challenge_ttl            = 1800

    # HSTS di pinggir. Aplikasi juga menetapkan HSTS (src/middleware.ts) sebagai
    # sandaran untuk capaian terus ke origin; kedua-duanya serasi.
    security_header {
      enabled            = true
      max_age            = 63072000 # 2 tahun
      include_subdomains = true
      preload            = true
      nosniff            = true
    }
  }
}
