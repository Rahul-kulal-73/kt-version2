$base = "https://raw.githubusercontent.com/adithya-b-r/kt/2910d9687201d40c05f5a55b8939f4a15a057fa8"
$dest_landing = "src/components/landing"
$dest_comps = "src/components"
$dest_app = "src/app"

Write-Host "Downloading HeroSection.tsx..."
Invoke-WebRequest -Uri "$base/src/components/landing/HeroSection.tsx" -OutFile "$dest_landing/HeroSection.tsx"

Write-Host "Downloading AboutSection.tsx..."
Invoke-WebRequest -Uri "$base/src/components/landing/AboutSection.tsx" -OutFile "$dest_landing/AboutSection.tsx"

Write-Host "Downloading PricingSection.tsx..."
Invoke-WebRequest -Uri "$base/src/components/landing/PricingSection.tsx" -OutFile "$dest_landing/PricingSection.tsx"

Write-Host "Downloading Footer.tsx..."
Invoke-WebRequest -Uri "$base/src/components/landing/Footer.tsx" -OutFile "$dest_landing/Footer.tsx"

Write-Host "Downloading Navbar.tsx..."
Invoke-WebRequest -Uri "$base/src/components/Navbar.tsx" -OutFile "$dest_comps/Navbar.tsx"

Write-Host "Downloading page.tsx..."
Invoke-WebRequest -Uri "$base/src/app/page.tsx" -OutFile "$dest_app/page.tsx"

Write-Host "Download complete."
