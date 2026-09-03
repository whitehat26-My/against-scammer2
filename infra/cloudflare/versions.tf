# Keperluan Terraform dan penyedia Cloudflare.
#
# Config ini disahkan terhadap penyedia Cloudflare v4. Penyedia v5 memecahkan
# beberapa sumber (antaranya cloudflare_zone_settings_override → cloudflare_zone_setting).
# Kekalkan pin v4 melainkan anda telah memindahkan config ke skema v5.

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.52"
    }
  }
}

provider "cloudflare" {
  # Kunci melalui CLOUDFLARE_API_TOKEN dalam persekitaran — JANGAN letak dalam fail.
  # Token perlu keizinan: Zone.Zone Settings (Edit), Zone.Firewall Services (Edit),
  # Zone.Zone WAF (Edit), Zone.Cache Rules / Config Rules (Edit) untuk zon sasaran.
  # api_token = var.cloudflare_api_token   # (pilihan; lebih baik guna env)
}
