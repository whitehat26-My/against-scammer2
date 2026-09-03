# WAF: ruleset terurus Cloudflare + OWASP Core Ruleset, dan peraturan firewall
# tersuai (senarai putih IP panel admin).

# 1) Ruleset terurus dalam fasa http_request_firewall_managed.
resource "cloudflare_ruleset" "waf_terurus" {
  zone_id     = var.zone_id
  name        = "Portal — WAF terurus"
  description = "Cloudflare Managed Ruleset + OWASP Core Ruleset"
  kind        = "zone"
  phase       = "http_request_firewall_managed"

  # Cloudflare Managed Ruleset (tandatangan serangan biasa).
  rules {
    action = "execute"
    action_parameters {
      id = "efb7b8c949ac4650a09736fc376e9aee"
    }
    expression  = "true"
    description = "Cloudflare Managed Ruleset"
    enabled     = true
  }

  # OWASP Core Ruleset (pemarkahan anomali). Sensitiviti boleh ditala untuk
  # mengurangkan positif palsu selepas pemantauan.
  rules {
    action = "execute"
    action_parameters {
      id = "4814384a9e5d4991b9815dcfc25d2f1f"
      overrides {
        sensitivity_level = var.owasp_paranoia_level
      }
    }
    expression  = "true"
    description = "OWASP Core Ruleset"
    enabled     = true
  }
}

# 2) Peraturan firewall tersuai dalam fasa http_request_firewall_custom.
locals {
  laluan_admin_expr = "(starts_with(http.request.uri.path, \"/moderasi\") or starts_with(http.request.uri.path, \"/api/bukti\"))"

  # Senarai peraturan tersuai. Peraturan senarai putih IP hanya wujud jika
  # admin_ip_allowlist tidak kosong.
  peraturan_tersuai = concat(
    length(var.admin_ip_allowlist) > 0 ? [{
      action      = "block"
      expression  = "${local.laluan_admin_expr} and not (ip.src in {${join(" ", var.admin_ip_allowlist)}})"
      description = "Hadkan panel admin kepada IP tersenarai"
    }] : [],
    [{
      # Cabar permintaan tanpa User-Agent ke laluan admin (isyarat bot mudah).
      action      = "managed_challenge"
      expression  = "${local.laluan_admin_expr} and http.user_agent eq \"\""
      description = "Cabar capaian admin tanpa User-Agent"
    }]
  )
}

resource "cloudflare_ruleset" "firewall_tersuai" {
  zone_id     = var.zone_id
  name        = "Portal — firewall tersuai"
  description = "Senarai putih IP panel admin dan pengerasan asas"
  kind        = "zone"
  phase       = "http_request_firewall_custom"

  dynamic "rules" {
    for_each = local.peraturan_tersuai
    content {
      action      = rules.value.action
      expression  = rules.value.expression
      description = rules.value.description
      enabled     = true
    }
  }
}
