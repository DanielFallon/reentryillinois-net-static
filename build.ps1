#!/usr/bin/env pwsh

Copy-Item -Recurse -Path (Join-Path $PSScriptRoot "oldhtml/*") -Destination (Join-Path $PSScriptRoot "html")