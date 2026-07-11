# Security and responsible use

## Purpose

This repository documents a format-level covert channel in ignored DEFLATE alignment bits and provides a laboratory proof of concept for defensive research.

Use it only on files and systems you own or are explicitly authorized to test. Do not use it to conceal executable content, evade inspection, or bypass organizational controls.

## Reporting an issue

When publishing this repository, replace this section with your preferred contact method. A useful report should include:

- affected file and commit
- expected and observed behavior
- minimal reproducer that contains no sensitive data
- whether the issue affects the web page, inserter, restorer, or deployment workflow

Avoid attaching live malware, credentials, private archives, or confidential data to a public issue.

## Defensive interpretation

- A zero-length stored block can be legitimate.
- `00 00 FF FF` is not sufficient evidence by itself.
- Non-zero alignment bits are an anomaly signal, not a standalone verdict.
- Robust detection requires bit-accurate DEFLATE parsing and contextual scoring.
- Decompress-and-recompress normalization can remove the channel where byte-for-byte preservation is not required.
