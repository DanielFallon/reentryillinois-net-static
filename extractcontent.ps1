function Script:ExtractHtmlFromFile ($FilePath) {
    $content = Get-Content $FilePath -Raw
    $html = New-Object -Com "HTMLFile"

    $html.IHTMLDocument2_Write($content);

    $html.getElementById("content") | % InnerHtml
}


Get-ChildItem "$PSScriptRoot/oldhtml" | % {
    ExtractHtmlFromFile $_.FullName | Out-File "$PSScriptRoot/markdown-contents/$($_.BaseName).md"
}