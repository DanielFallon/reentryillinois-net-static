function Script:ExtractHtmlFromFile ($FilePath) {
    $content = Get-Content $FilePath -Raw
    $html = New-Object -Com "HTMLFile"

    $html.IHTMLDocument2_Write($content);

    $html.getElementById("content") | % InnerHtml
}


Get-ChildItem -File "$PSScriptRoot/oldhtml" | % {
    ExtractHtmlFromFile $_.FullName | %{$_ -replace "`r`n","`n" }|Out-File -NoNewline -encoding ASCII "$PSScriptRoot/markdown-contents/$($_.BaseName).md"
}