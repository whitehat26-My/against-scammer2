output "waf_terurus_id" {
  description = "ID ruleset WAF terurus."
  value       = cloudflare_ruleset.waf_terurus.id
}

output "firewall_tersuai_id" {
  description = "ID ruleset firewall tersuai."
  value       = cloudflare_ruleset.firewall_tersuai.id
}

output "had_kadar_id" {
  description = "ID ruleset had kadar."
  value       = cloudflare_ruleset.had_kadar.id
}

output "sekatan_ip_admin_aktif" {
  description = "Sama ada senarai putih IP admin di pinggir diaktifkan."
  value       = length(var.admin_ip_allowlist) > 0
}
