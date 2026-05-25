# Security Audit Report

## Overview
This audit identified 8 security issues in the my-resume-chatbot project. Below is a summary of each finding with recommended fixes.

---

## Critical Issues

**1. Weak Authentication**
No rate limiting or IP blocking is in place, making the system vulnerable to brute-force password attacks.

**2. SQL Injection Vulnerabilities**
User input is not validated before use in database queries, allowing attackers to inject malicious SQL code.

**3. Hardcoded Secrets**
API keys and database credentials are hardcoded directly in the codebase instead of using secure environment variables.

**4. Unauthenticated API Access**
The API accepts requests from anyone without authentication, allowing unauthorized access and abuse.

---

## High Priority Issues

**5. Plain Text Resume Storage**
User resumes are stored in unencrypted plain text files on the file system, risking data exposure.

**6. Outdated Dependencies**
The Express framework is running an outdated version with known security vulnerabilities.

**7. No Input Validation**
Missing input validation across the application can cause crashes and enable various attack vectors.

**8. No Logging or Monitoring**
There is no logging or monitoring in place to detect and respond to security incidents.

---

## Recommendation
Address critical issues (1-4) immediately before deployment. Plan fixes for high priority issues within your next sprint.
