# ---------------------------------------------------------------
# Update loader files in sandbox to reference new *-SRD.js datasets
# Safe: Creates backups before modifying
# ---------------------------------------------------------------

$sandboxLoad  = "C:\Users\bruce\OneDrive\D&D-Sandbox\loaders"

# Map old filenames to new filenames
$filenameMap = @{
    "spells-converted.js"      = "spells-SRD.js"
    "magic-items-converted.js" = "magic-items-SRD.js"
    "monsters-converted.js"    = "monsters-SRD.js"
}

# Get all JS files in loaders folder
$loaderFiles = Get-ChildItem -Path $sandboxLoad -Filter "*.js"

foreach ($file in $loaderFiles) {
    $filePath = $file.FullName
    $backupPath = $filePath + ".bak"

    # Create backup
    Copy-Item $filePath $backupPath -Force
    Write-Host "Backup created: $($file.Name).bak"

    # Read file content
    $content = Get-Content $filePath -Raw

    # Replace all old references with new SRD names
    foreach ($oldName in $filenameMap.Keys) {
        $newName = $filenameMap[$oldName]
        if ($content -match [regex]::Escape($oldName)) {
            $content = $content -replace [regex]::Escape($oldName), $newName
            Write-Host "Updated reference: $oldName → $newName in $($file.Name)"
        }
    }

    # Write updated content back to file
    Set-Content -Path $filePath -Value $content
}

Write-Host "`nAll loader files updated to reference *-SRD.js datasets."
# ---------------------------------------------------------------
