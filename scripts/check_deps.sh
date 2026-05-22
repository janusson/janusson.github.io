#!/bin/bash

# ==============================================================================
# check_deps.sh - Dependency Security Checker
# ==============================================================================
# This script checks both Ruby (Gemfile.lock) and Python (requirements.txt)
# dependencies for known CVEs (security vulnerabilities).
# ==============================================================================

echo "========================================="
echo " Starting Dependency Passmark Test"
echo "========================================="

EXIT_CODE=0

# ------------------------------------------------------------------------------
# 1. Ruby Security Check (bundler-audit)
# ------------------------------------------------------------------------------
echo -e "\n[*] Checking Ruby dependencies (Gemfile.lock) for vulnerabilities..."
if ! command -v bundle-audit &> /dev/null; then
    echo "⚠️  'bundler-audit' is not installed."
    echo "   Install it by running: gem install bundler-audit"
    echo "   Skipping Ruby security check..."
else
    echo "Updating ruby-advisory-db..."
    bundle-audit update quiet

    if bundle-audit check; then
        echo "✅ Ruby dependencies are secure."
    else
        echo "❌ [FAIL] Vulnerabilities found in Ruby dependencies!"
        EXIT_CODE=1
    fi
fi

# ------------------------------------------------------------------------------
# 2. Python Security Check (pip-audit)
# ------------------------------------------------------------------------------
echo -e "\n[*] Checking Python dependencies (requirements.txt) for vulnerabilities..."
if [ ! -f "requirements.txt" ]; then
    echo "⚠️  requirements.txt not found. Skipping Python check."
elif ! command -v pip-audit &> /dev/null; then
    echo "⚠️  'pip-audit' is not installed."
    echo "   Install it by running: pip install pip-audit"
    echo "   Skipping Python security check..."
else
    if pip-audit -r requirements.txt; then
        echo "✅ Python dependencies are secure."
    else
        echo "❌ [FAIL] Vulnerabilities found in Python dependencies!"
        EXIT_CODE=1
    fi
fi

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------
echo -e "\n========================================="
if [ $EXIT_CODE -eq 0 ]; then
    echo "🎉 PASS: All audited dependencies are secure."
else
    echo "🚨 FAIL: Vulnerabilities detected. Please review the output above and update the affected packages."
fi
echo "========================================="

exit $EXIT_CODE
