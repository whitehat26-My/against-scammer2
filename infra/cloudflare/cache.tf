# Peraturan cache (fasa http_request_cache_settings).
#
# Kandungan dinamik dan sensitif TIDAK boleh di-cache di pinggir: hasil moderasi
# berubah, halaman laporan berubah selepas tindakan moderator, dan endpoint julat
# mesti sentiasa segar. Aplikasi sudah menghantar Cache-Control: no-store pada
# laluan ini; peraturan di sini ialah lapisan kedua yang eksplisit.
#
# Aset statik Next (/_next/static/*) di-hash mengikut kandungan, jadi selamat
# untuk di-cache lama di pinggir.

resource "cloudflare_ruleset" "cache" {
  zone_id     = var.zone_id
  name        = "Portal — peraturan cache"
  description = "Pintas cache untuk laluan dinamik; cache aset statik"
  kind        = "zone"
  phase       = "http_request_cache_settings"

  # Jangan cache laluan dinamik/sensitif.
  rules {
    action = "set_cache_settings"
    action_parameters {
      cache = false
    }
    expression = join(" or ", [
      "starts_with(http.request.uri.path, \"/api/\")",
      "starts_with(http.request.uri.path, \"/moderasi\")",
      "starts_with(http.request.uri.path, \"/lapor\")",
      "starts_with(http.request.uri.path, \"/laporan\")",
      "starts_with(http.request.uri.path, \"/berita/sahkan\")",
      "starts_with(http.request.uri.path, \"/berita/berhenti\")",
      "http.request.uri.path eq \"/semak\"",
    ])
    description = "Jangan cache laluan dinamik/sensitif"
    enabled     = true
  }

  # Cache aset statik Next dengan agresif.
  rules {
    action = "set_cache_settings"
    action_parameters {
      cache = true
      edge_ttl {
        mode    = "override_origin"
        default = var.cache_static_ttl
      }
    }
    expression  = "(starts_with(http.request.uri.path, \"/_next/static/\"))"
    description = "Cache aset statik Next (hashed)"
    enabled     = true
  }
}
