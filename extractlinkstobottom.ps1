function Script:ExtractLinksFromHtml ($content) {
    $html = New-Object -Com "HTMLFile"

    $html.IHTMLDocument2_Write($content);

    $links = $html.getElementsByTagName("a")
    $links | % {
        "[$($_.InnerHTML)]: $($_.href)"
        
    }
}

Get-ChildItem -File "$PSScriptRoot/markdown-contents" | % {
    $contents = Get-Content -Raw $_.FullName
    $contents | Out-File -Encoding ascii -Append $_.FullName
    ExtractLinksFromHtml $contents | Out-File -Append -Encoding ascii $_.FullName    
}