# SevenIQ Test Runner Script
# This script runs all tests with proper configuration and reporting

param(
    [string]$TestType = "all",
    [switch]$Watch,
    [switch]$Coverage,
    [switch]$Verbose,
    [switch]$Help
)

# Show help if requested
if ($Help) {
    Write-Host @"
SevenIQ Test Runner

Usage: .\run-tests.ps1 [options]

Options:
    -TestType <type>    Test type to run (all, unit, e2e, integration) [default: all]
    -Watch              Run tests in watch mode
    -Coverage           Generate coverage report
    -Verbose            Show verbose output
    -Help               Show this help message

Examples:
    .\run-tests.ps1                    # Run all tests
    .\run-tests.ps1 -TestType unit     # Run only unit tests
    .\run-tests.ps1 -Coverage          # Run tests with coverage
    .\run-tests.ps1 -Watch             # Run tests in watch mode
    .\run-tests.ps1 -Verbose           # Run tests with verbose output
"@
    exit 0
}

# Set error action preference
$ErrorActionPreference = "Stop"

# Colors for output
$Colors = @{
    Reset = "`e[0m"
    Red = "`e[31m"
    Green = "`e[32m"
    Yellow = "`e[33m"
    Blue = "`e[34m"
    Magenta = "`e[35m"
    Cyan = "`e[36m"
    White = "`e[37m"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host "$($Colors[$Color])$Message$($Colors.Reset)"
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-ColorOutput "=" * 60 "Cyan"
    Write-ColorOutput "  $Title" "Cyan"
    Write-ColorOutput "=" * 60 "Cyan"
    Write-Host ""
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-ColorOutput "--- $Title ---" "Blue"
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✓ $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠ $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "✗ $Message" "Red"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ $Message" "White"
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Error "This script must be run from the project root directory (where package.json is located)"
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Success "Node.js version: $nodeVersion"
} catch {
    Write-Error "Node.js is not installed or not in PATH"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Success "npm version: $npmVersion"
} catch {
    Write-Error "npm is not installed or not in PATH"
    exit 1
}

# Check if required dependencies are installed
Write-Section "Checking Dependencies"
if (-not (Test-Path "node_modules")) {
    Write-Warning "node_modules not found. Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install dependencies"
        exit 1
    }
    Write-Success "Dependencies installed successfully"
} else {
    Write-Success "Dependencies already installed"
}

# Check if test dependencies are installed
$testDeps = @("vitest", "@testing-library/react", "@testing-library/jest-dom", "jsdom")
foreach ($dep in $testDeps) {
    if (-not (Test-Path "node_modules/$dep")) {
        Write-Warning "Test dependency '$dep' not found. Installing..."
        npm install --save-dev $dep
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install test dependency: $dep"
            exit 1
        }
    }
}

# Function to run tests
function Run-Tests {
    param(
        [string]$Type,
        [string]$Pattern = "",
        [string]$AdditionalArgs = ""
    )
    
    Write-Section "Running $Type Tests"
    
    $testCommand = "npm run test"
    if ($Pattern) {
        $testCommand += " -- $Pattern"
    }
    
    if ($Coverage) {
        $testCommand += " --coverage"
    }
    
    if ($Verbose) {
        $testCommand += " --reporter=verbose"
    }
    
    if ($AdditionalArgs) {
        $testCommand += " $AdditionalArgs"
    }
    
    Write-Info "Command: $testCommand"
    Write-Host ""
    
    # Run the test command
    Invoke-Expression $testCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "$Type tests completed successfully"
    } else {
        Write-Error "$Type tests failed"
        return $false
    }
    
    return $true
}

# Function to run specific test types
function Run-UnitTests {
    Write-Header "Unit Tests"
    return Run-Tests "Unit" "tests/unit/**/*.test.{ts,tsx}"
}

function Run-IntegrationTests {
    Write-Header "Integration Tests"
    return Run-Tests "Integration" "tests/integration/**/*.test.{ts,tsx}"
}

function Run-E2ETests {
    Write-Header "End-to-End Tests"
    
    # Check if Playwright is installed
    if (-not (Test-Path "node_modules/@playwright/test")) {
        Write-Warning "Playwright not found. Installing..."
        npx playwright install
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install Playwright"
            return $false
        }
    }
    
    # Check if Playwright browsers are installed
    if (-not (Test-Path "node_modules/.cache/playwright")) {
        Write-Warning "Playwright browsers not found. Installing..."
        npx playwright install-deps
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install Playwright browsers"
            return $false
        }
    }
    
    return Run-Tests "E2E" "tests/e2e/**/*.spec.{ts,tsx}"
}

function Run-AllTests {
    Write-Header "All Tests"
    
    $success = $true
    
    # Run unit tests
    if (-not (Run-UnitTests)) {
        $success = $false
    }
    
    # Run integration tests
    if (-not (Run-IntegrationTests)) {
        $success = $false
    }
    
    # Run E2E tests
    if (-not (Run-E2ETests)) {
        $success = $false
    }
    
    return $success
}

# Function to generate coverage report
function Generate-CoverageReport {
    Write-Section "Generating Coverage Report"
    
    if (Test-Path "coverage") {
        Write-Info "Coverage directory already exists"
    } else {
        Write-Info "Creating coverage directory"
        New-Item -ItemType Directory -Path "coverage" -Force | Out-Null
    }
    
    # Run tests with coverage
    $coverageCommand = "npm run test:coverage"
    Write-Info "Command: $coverageCommand"
    
    Invoke-Expression $coverageCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Coverage report generated successfully"
        
        # Open coverage report if possible
        $coverageHtml = "coverage/index.html"
        if (Test-Path $coverageHtml) {
            Write-Info "Coverage report available at: $coverageHtml"
            try {
                Start-Process $coverageHtml
                Write-Success "Coverage report opened in browser"
            } catch {
                Write-Warning "Could not open coverage report automatically"
            }
        }
    } else {
        Write-Error "Failed to generate coverage report"
        return $false
    }
    
    return $true
}

# Function to run tests in watch mode
function Run-TestsWatch {
    Write-Header "Watch Mode"
    Write-Info "Starting tests in watch mode..."
    Write-Info "Press Ctrl+C to stop"
    
    $watchCommand = "npm run test:watch"
    if ($Pattern) {
        $watchCommand += " -- $Pattern"
    }
    
    Write-Info "Command: $watchCommand"
    Write-Host ""
    
    Invoke-Expression $watchCommand
}

# Main execution
try {
    Write-Header "SevenIQ Test Runner"
    Write-Info "Test Type: $TestType"
    Write-Info "Watch Mode: $Watch"
    Write-Info "Coverage: $Coverage"
    Write-Info "Verbose: $Verbose"
    
    $startTime = Get-Date
    
    # Run tests based on type
    $success = $false
    switch ($TestType.ToLower()) {
        "unit" { $success = Run-UnitTests }
        "integration" { $success = Run-IntegrationTests }
        "e2e" { $success = Run-E2ETests }
        "all" { $success = Run-AllTests }
        default {
            Write-Error "Invalid test type: $TestType"
            Write-Info "Valid types: unit, integration, e2e, all"
            exit 1
        }
    }
    
    # Generate coverage report if requested
    if ($Coverage -and $success) {
        $success = Generate-CoverageReport
    }
    
    # Run in watch mode if requested
    if ($Watch -and $success) {
        Run-TestsWatch
        exit 0
    }
    
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    Write-Header "Test Results"
    if ($success) {
        Write-Success "All tests completed successfully!"
        Write-Info "Duration: $($duration.ToString('mm\:ss'))"
        
        if ($Coverage) {
            Write-Info "Coverage report generated in: coverage/"
        }
        
        exit 0
    } else {
        Write-Error "Some tests failed!"
        Write-Info "Duration: $($duration.ToString('mm\:ss'))"
        Write-Info "Check the output above for details"
        exit 1
    }
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    Write-Error "Stack trace: $($_.ScriptStackTrace)"
    exit 1
}
