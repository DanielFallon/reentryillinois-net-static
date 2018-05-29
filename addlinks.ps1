# Add links to markdown contents files

function Script:LinkText ($page) {
    "http://www.reentryillinois.net/$page.html"
}

Get-ChildItem -File "$PSScriptRoot/markdown-contents" | % {
    $contents = Get-Content -Raw $_.FullName
    LinkText $_.BaseName | Out-File -Encoding ascii $_.FullName
    $contents | Out-File -Encoding ascii -Append $_.FullName
}