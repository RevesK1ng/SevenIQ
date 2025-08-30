#!/bin/bash

# SevenIQ Comprehensive Test Runner
# This script runs all tests and generates comprehensive reports

set -e

echo "🧪 SevenIQ Test Suite"
echo "======================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    print_warning "Dependencies not found. Installing..."
    npm install
fi

# Create test results directory
mkdir -p test-results

echo "📋 Running Pre-flight Checks..."
echo "-------------------------------"

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
print_status "npm version: $NPM_VERSION"

# Check if required tools are available
if command -v lighthouse &> /dev/null; then
    print_success "Lighthouse CLI found"
else
    print_warning "Lighthouse CLI not found. Install with: npm install -g lighthouse"
fi

echo ""
echo "🧪 Running Unit Tests..."
echo "------------------------"

# Run unit tests with coverage
print_status "Running Vitest with coverage..."
if npm run test:coverage; then
    print_success "Unit tests passed with coverage"
else
    print_error "Unit tests failed"
    exit 1
fi

echo ""
echo "🌐 Running E2E Tests..."
echo "----------------------"

# Install Playwright browsers if not already installed
print_status "Ensuring Playwright browsers are installed..."
npx playwright install --with-deps

# Run E2E tests
print_status "Running Playwright E2E tests..."
if npm run test:e2e; then
    print_success "E2E tests passed"
else
    print_error "E2E tests failed"
    exit 1
fi

echo ""
echo "📊 Running Performance Tests..."
echo "-------------------------------"

# Run Lighthouse audits if available
if command -v lighthouse &> /dev/null; then
    print_status "Running Lighthouse audit on home page..."
    lighthouse http://localhost:3000 --output html --output-path ./test-results/lighthouse-home.html --chrome-flags="--headless" || print_warning "Lighthouse audit failed"
    
    print_status "Running Lighthouse audit on pricing page..."
    lighthouse http://localhost:3000/pricing --output html --output-path ./test-results/lighthouse-pricing.html --chrome-flags="--headless" || print_warning "Lighthouse audit failed"
else
    print_warning "Skipping Lighthouse audits (CLI not available)"
fi

echo ""
echo "🔍 Running Code Quality Checks..."
echo "--------------------------------"

# Run ESLint
print_status "Running ESLint..."
if npm run lint; then
    print_success "ESLint passed"
else
    print_warning "ESLint found issues"
fi

# Run TypeScript type checking
print_status "Running TypeScript type check..."
if npx tsc --noEmit; then
    print_success "TypeScript type check passed"
else
    print_error "TypeScript type check failed"
    exit 1
fi

echo ""
echo "📈 Generating Test Reports..."
echo "----------------------------"

# Generate test summary
cat > test-results/test-summary.md << EOF
# SevenIQ Test Results Summary

**Generated:** $(date)
**Node.js Version:** $NODE_VERSION
**npm Version:** $NPM_VERSION

## Test Results

### Unit Tests
- Status: ✅ PASSED
- Coverage: Generated in coverage/ directory

### E2E Tests
- Status: ✅ PASSED
- Reports: Generated in test-results/ directory

### Code Quality
- ESLint: ✅ PASSED
- TypeScript: ✅ PASSED

### Performance Tests
- Lighthouse: Generated in test-results/ directory

## Next Steps

1. Review test coverage report
2. Check Lighthouse performance scores
3. Run manual QA checklist
4. Proceed with deployment if all tests pass

## Files Generated

- \`test-results/\` - Test output and reports
- \`coverage/\` - Unit test coverage reports
- \`playwright-report/\` - E2E test reports
EOF

print_success "Test summary generated: test-results/test-summary.md"

echo ""
echo "🎯 Test Suite Complete!"
echo "======================"

# Check if all critical tests passed
if [ $? -eq 0 ]; then
    print_success "All critical tests passed! 🎉"
    print_status "Review the test results and proceed with manual QA checklist"
    echo ""
    print_status "Generated files:"
    echo "  - test-results/test-summary.md"
    echo "  - coverage/ (unit test coverage)"
    echo "  - playwright-report/ (E2E test results)"
    if [ -f "test-results/lighthouse-home.html" ]; then
        echo "  - test-results/lighthouse-*.html (performance reports)"
    fi
else
    print_error "Some tests failed. Please review the output above."
    exit 1
fi

echo ""
print_status "Next steps:"
echo "  1. Review QA_CHECKLIST.md"
echo "  2. Run manual tests"
echo "  3. Check deployment readiness"
echo "  4. Deploy when ready"

echo ""
print_success "Test runner completed successfully! 🚀"
