# Security Policy

## Supported Versions

This is a template repository; fixes are applied to the `main` branch.

## Reporting a Vulnerability

Please **do not** open a public issue for security problems.

Report privately via GitHub Security Advisories:
<https://github.com/Mister-Hope/portfolio-template/security/advisories/new>

or e-mail **mister-hope@outlook.com**. Please include:

- a description of the issue and its impact,
- reproduction steps or a minimal proof of concept,
- the affected version/commit.

You can expect an initial response within a few days.

## Scope Notes

- The configuration file (`config.*`) is trusted build-time input: it is code for `.ts`/`.js`
  configs and can load `markdown-it` plugins at build time.
- Markdown content may contain raw HTML by design; do not feed untrusted content into a config
  file.
- Deployed sites are static; the browser bundle contains the whole resolved config.
