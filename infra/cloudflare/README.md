# Cloudflare WAF sebagai kod (Terraform)

Config ini memasang lapisan pinggir Cloudflare **selepas** fasa pentest, mengikut
turutan pengukuhan portal. Ia menguruskan tetapan TLS/HSTS zon, WAF terurus +
OWASP, peraturan firewall tersuai (senarai putih IP panel admin), had kadar
pinggir, dan peraturan cache.

Panduan penuh (langkah dashboard, penguncian origin, pengesahan, rollback):
[`docs/cloudflare-waf.md`](../../docs/cloudflare-waf.md).

## Fail

| Fail | Kandungan |
| --- | --- |
| `versions.tf` | Versi Terraform + penyedia Cloudflare (v4) |
| `variables.tf` | Semua input boleh tala |
| `settings.tf` | SSL Full (strict), Always HTTPS, TLS min 1.2, HSTS |
| `waf.tf` | Cloudflare Managed Ruleset + OWASP; firewall tersuai (IP admin) |
| `rate-limit.tf` | Had kadar pinggir: julat, lapor, log masuk |
| `cache.tf` | Pintas cache dinamik; cache aset statik |
| `outputs.tf` | ID ruleset + status sekatan IP |
| `terraform.tfvars.example` | Templat pemboleh ubah |

## Guna

```bash
cd infra/cloudflare
export CLOUDFLARE_API_TOKEN=xxxxxxxx      # jangan simpan dalam fail
cp terraform.tfvars.example terraform.tfvars
# sunting terraform.tfvars: zone_id, zone_name, admin_ip_allowlist

terraform init
terraform plan       # semak dahulu — WAJIB
terraform apply
```

## Keizinan token API

Token perlu, untuk zon sasaran sahaja:

- Zone → Zone Settings → **Edit**
- Zone → Zone WAF → **Edit**
- Zone → Firewall Services → **Edit**
- Zone → Config/Cache Rules → **Edit**

Gunakan token terhad zon, bukan Global API Key.

## Nota

- **Uji `terraform plan` dahulu.** Peraturan WAF boleh menyekat trafik sah jika
  salah tala. Mula `owasp_paranoia_level = "medium"`, pantau, kemudian naikkan.
- Sekatan IP admin di pinggir hanya aktif jika `admin_ip_allowlist` tidak kosong.
  Aplikasi masih melindungi panel dengan log masuk + MFA tanpa mengira ini.
- Penyedia v4 dipin. Jika menaik taraf ke v5, `cloudflare_zone_settings_override`
  perlu dipindah ke `cloudflare_zone_setting`.
