# Had kadar pinggir (fasa http_ratelimit).
#
# Ini MELENGKAPI had kadar aplikasi (src/lib/rate-limit.ts), bukan
# menggantikannya. Had pinggir lebih longgar dan menangkap banjir besar sebelum
# ia sampai ke origin; had aplikasi lebih ketat dan mengikut logik perniagaan.

resource "cloudflare_ruleset" "had_kadar" {
  zone_id     = var.zone_id
  name        = "Portal — had kadar pinggir"
  description = "Had kadar untuk endpoint julat, borang laporan, dan log masuk"
  kind        = "zone"
  phase       = "http_ratelimit"

  # Endpoint semakan k-anonymity.
  rules {
    action = "block"
    ratelimit {
      characteristics     = ["ip.src", "cf.colo.id"]
      period              = 60
      requests_per_period = var.rate_limit_julat_per_minit
      mitigation_timeout  = 60
    }
    expression  = "(http.request.uri.path eq \"/api/laporan/julat\")"
    description = "Had kadar: endpoint julat"
    enabled     = true
  }

  # Penghantaran borang laporan.
  rules {
    action = "block"
    ratelimit {
      characteristics     = ["ip.src", "cf.colo.id"]
      period              = 60
      requests_per_period = var.rate_limit_lapor_per_minit
      mitigation_timeout  = 300
    }
    expression  = "(http.request.method eq \"POST\" and starts_with(http.request.uri.path, \"/lapor\"))"
    description = "Had kadar: penghantaran laporan"
    enabled     = true
  }

  # Cubaan log masuk moderator.
  rules {
    action = "block"
    ratelimit {
      characteristics     = ["ip.src", "cf.colo.id"]
      period              = 60
      requests_per_period = var.rate_limit_masuk_per_minit
      mitigation_timeout  = 300
    }
    expression  = "(http.request.method eq \"POST\" and starts_with(http.request.uri.path, \"/moderasi\"))"
    description = "Had kadar: log masuk moderator"
    enabled     = true
  }
}
