[CmdletBinding()]
param()

$baseUri = "http://localhost:3000"

Describe "GetItems" {
    It "gets scenes" {
        $pixel = Invoke-RestMethod -Uri $baseUri/api/scenes -Method Get
        $pixel | Should not be $null
        $pixel.Count | Should begreaterthan 0
    }

    It "gets instruments" {
        $pixel = Invoke-RestMethod -Uri $baseUri/api/instruments -Method Get
        $pixel | Should not be $null
        $pixel.Count | Should begreaterthan 0
    }

    It "gets instrumenttypes" {
        $pixel = Invoke-RestMethod -Uri $baseUri/api/instrumenttypes -Method Get
        $pixel | Should not be $null
        $pixel.Count | Should begreaterthan 0
    }

    It "gets shows" {
        $pixel = Invoke-RestMethod -Uri $baseUri/api/shows -Method Get
        $pixel | Should not be $null
        $pixel.Count | Should begreaterthan 0
    }
}