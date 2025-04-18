#!/bin/bash

# Static Analysis Script for Codebase Audit
# This script runs various analysis tools to identify:
# - Circular dependencies
# - Unused variables and exports
# - Bundle size information

echo "=== MIDATERMINAL CODEBASE ANALYSIS ==="
echo "Running static analysis tools for code quality and dependency audit"
echo ""

# Make sure we're in the project root
PROJECT_ROOT=$(pwd)
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found. Please run this script from the project root."
  exit 1
fi

# Create analysis output directory
ANALYSIS_DIR="$PROJECT_ROOT/analysis"
mkdir -p "$ANALYSIS_DIR"

echo "=== CHECKING FOR CIRCULAR DEPENDENCIES ==="
echo "Running madge to detect circular dependencies..."
echo ""

if ! command -v npx &> /dev/null; then
  echo "Error: npx command not found. Please make sure Node.js is installed correctly."
  exit 1
fi

# Run madge to find circular dependencies
npx madge --circular src/ > "$ANALYSIS_DIR/circular-deps.txt"
if [ $? -eq 0 ]; then
  echo "Circular dependency analysis complete. Results saved to $ANALYSIS_DIR/circular-deps.txt"
else
  echo "Error running madge. Make sure it's installed (npm install -g madge)."
fi
echo ""

# Run import analysis to find unused exports
echo "=== CHECKING FOR UNUSED EXPORTS ==="
echo "Running ESLint to detect potentially unused variables and exports..."
echo ""

npx eslint --no-eslintrc --rule 'no-unused-vars: error' src/ --ext .ts,.tsx --format json > "$ANALYSIS_DIR/unused-vars.json" || true
echo "ESLint analysis complete. Results saved to $ANALYSIS_DIR/unused-vars.json"
echo ""

# Run dependency analysis
echo "=== CHECKING FOR UNUSED DEPENDENCIES ==="
echo "Running depcheck to find unused dependencies..."
echo ""

npx depcheck --json > "$ANALYSIS_DIR/unused-dependencies.json" || true
echo "Dependency analysis complete. Results saved to $ANALYSIS_DIR/unused-dependencies.json"
echo ""

# Run bundle analyzer
echo "=== ANALYZING BUNDLE SIZE ==="
echo "Would you like to analyze the bundle size? This will build the project. (y/n)"
read -r run_bundle_analysis

if [ "$run_bundle_analysis" == "y" ]; then
  echo "Running webpack-bundle-analyzer..."
  echo ""
  
  # This assumes your Next.js build command generates bundle stats
  # You may need to adjust this based on your actual build configuration
  ANALYZE=true npm run build
  
  echo "Bundle analysis complete."
else
  echo "Skipping bundle analysis."
fi
echo ""

echo "=== ANALYSIS SUMMARY ==="
echo "All analysis results have been saved to the $ANALYSIS_DIR directory."
echo ""
echo "Next steps:"
echo "1. Review circular-deps.txt for circular dependencies"
echo "2. Check unused-vars.json for potentially unused code"
echo "3. Examine unused-dependencies.json for dependencies to remove"
echo "4. If bundle analysis was run, review the generated report"
echo ""
echo "=== ANALYSIS COMPLETE ===" 