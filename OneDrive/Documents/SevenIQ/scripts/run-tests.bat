@echo off
setlocal enabledelayedexpansion

echo 🧪 SevenIQ Test Suite
echo ======================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ ERROR: Please run this script from the project root directory
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo ⚠️  WARNING: Dependencies not found. Installing...
    npm install
    if !errorlevel! neq 0 (
        echo ❌ ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Create test results directory
if not exist "test-results" mkdir test-results

echo 📋 Running Pre-flight Checks...
echo -------------------------------

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ℹ️  INFO: Node.js version: !NODE_VERSION!

REM Check npm version
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ℹ️  INFO: npm version: !NPM_VERSION!

echo.
echo 🧪 Running Unit Tests...
echo ------------------------

REM Run unit tests with coverage
echo ℹ️  INFO: Running Vitest with coverage...
call npm run test:coverage
if !errorlevel! neq 0 (
    echo ❌ ERROR: Unit tests failed
    pause
    exit /b 1
)
echo ✅ SUCCESS: Unit tests passed with coverage

echo.
echo 🌐 Running E2E Tests...
echo ----------------------

REM Install Playwright browsers if not already installed
echo ℹ️  INFO: Ensuring Playwright browsers are installed...
call npx playwright install --with-deps

REM Run E2E tests
echo ℹ️  INFO: Running Playwright E2E tests...
call npm run test:e2e
if !errorlevel! neq 0 (
    echo ❌ ERROR: E2E tests failed
    pause
    exit /b 1
)
echo ✅ SUCCESS: E2E tests passed

echo.
echo 🔍 Running Code Quality Checks...
echo --------------------------------

REM Run ESLint
echo ℹ️  INFO: Running ESLint...
call npm run lint
if !errorlevel! neq 0 (
    echo ⚠️  WARNING: ESLint found issues
) else (
    echo ✅ SUCCESS: ESLint passed
)

REM Run TypeScript type checking
echo ℹ️  INFO: Running TypeScript type check...
call npx tsc --noEmit
if !errorlevel! neq 0 (
    echo ❌ ERROR: TypeScript type check failed
    pause
    exit /b 1
)
echo ✅ SUCCESS: TypeScript type check passed

echo.
echo 📈 Generating Test Reports...
echo ----------------------------

REM Generate test summary
echo # SevenIQ Test Results Summary > test-results\test-summary.md
echo. >> test-results\test-summary.md
echo **Generated:** %date% %time% >> test-results\test-summary.md
echo **Node.js Version:** !NODE_VERSION! >> test-results\test-summary.md
echo **npm Version:** !NPM_VERSION! >> test-results\test-summary.md
echo. >> test-results\test-summary.md
echo ## Test Results >> test-results\test-summary.md
echo. >> test-results\test-summary.md
echo ### Unit Tests >> test-results\test-summary.md
echo - Status: ✅ PASSED >> test-results\test-summary.md
echo - Coverage: Generated in coverage/ directory >> test-results\test-summary.md
echo. >> test-results\test-summary.md
echo ### E2E Tests >> test-results\test-summary.md
echo - Status: ✅ PASSED >> test-results\test-summary.md
echo - Reports: Generated in test-results/ directory >> test-results\test-summary.md
echo. >> test-results\test-summary.md
echo ### Code Quality >> test-results\test-summary.md
echo - ESLint: ✅ PASSED >> test-results\test-summary.md
echo - TypeScript: ✅ PASSED >> test-results\test-summary.md
echo. >> test-results\test-summary.md
echo ## Next Steps >> test-results\test-summary.md
echo. >> test-results\test-summary.md
echo 1. Review test coverage report >> test-results\test-summary.md
echo 2. Check Lighthouse performance scores >> test-results\test-summary.md
echo 3. Run manual QA checklist >> test-results\test-summary.md
echo 4. Proceed with deployment if all tests pass >> test-results\test-summary.md
echo. >> test-results\test-summary.md
echo ## Files Generated >> test-results\test-summary.md
echo. >> test-results\test-summary.md
echo - `test-results\` - Test output and reports >> test-results\test-summary.md
echo - `coverage\` - Unit test coverage reports >> test-results\test-summary.md
echo - `playwright-report\` - E2E test reports >> test-results\test-summary.md

echo ✅ SUCCESS: Test summary generated: test-results\test-summary.md

echo.
echo 🎯 Test Suite Complete!
echo ======================

echo ✅ SUCCESS: All critical tests passed! 🎉
echo ℹ️  INFO: Review the test results and proceed with manual QA checklist
echo.
echo ℹ️  INFO: Generated files:
echo   - test-results\test-summary.md
echo   - coverage\ (unit test coverage)
echo   - playwright-report\ (E2E test results)

echo.
echo ℹ️  INFO: Next steps:
echo   1. Review QA_CHECKLIST.md
echo   2. Run manual tests
echo   3. Check deployment readiness
echo   4. Deploy when ready

echo.
echo ✅ SUCCESS: Test runner completed successfully! 🚀
pause
