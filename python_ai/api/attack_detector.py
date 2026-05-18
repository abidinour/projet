import re

def detect_attack_type(url, content=""):
    text     = (url + " " + content).lower()
    original = url + " " + content

    # ── SQL Injection ─────────────────────────────────────────────
    if any(x in text for x in [
        "select", "union", "drop", "insert", "delete", "update",
        "' or ", "\" or ", "1=1", "or 1=1", "--", "/*", "*/",
        "xp_", "exec(", "cast(", "convert(", "char(", "nchar("
    ]):
        return "sql_injection"

    # ── XSS ──────────────────────────────────────────────────────
    if any(x in text for x in [
        "<script", "alert(", "javascript:", "onerror=", "onload=",
        "onmouseover=", "onfocus=", "onclick=", "<iframe", "<img",
        "document.cookie", "eval(", "src=javascript"
    ]):
        return "xss"

    # ── Remote File Inclusion (RFI) ───────────────────────────────
    if re.search(r'[=?&](https?|ftp)://', text) or \
       any(x in text for x in [
           "=http://", "=https://", "=ftp://",
           "page=http", "file=http", "path=http",
           "include=http", "url=http", "src=http",
           "load=http", "fetch=http"
       ]):
        return "remote_file_inclusion"

    # ── Local File Inclusion (LFI) ────────────────────────────────
    if any(x in text for x in [
        "etc/passwd", "etc/shadow", "boot.ini", "win.ini",
        "proc/self", "windows/system32", "/var/log",
        "..%2f", "%2e%2e", "....//", "..%252f"
    ]):
        return "local_file_inclusion"

    # ── Path Traversal ────────────────────────────────────────────
    if "../" in text or "..\\" in text or "%2e%2e%2f" in text:
        return "path_traversal"

    # ── Command Injection ─────────────────────────────────────────
    if re.search(
        r'[\s;|&`$]+(ls|cat|whoami|id|pwd|wget|curl|nc|bash|sh|python|perl|php)(\s|$|;)',
        text
    ) or any(x in text for x in [
        "; ls", ";ls", "| ls", "|ls",
        "; cat", ";cat", "| cat", "|cat",
        "|whoami", "; whoami", ";whoami",
        "|id", ";id", "& id", "&id",
        "`whoami`", "$(whoami)", "$(id)",
        "&& ls", "|| ls", "; pwd", ";pwd",
        "wget ", "curl ", "/bin/sh", "/bin/bash",
        "127.0.0.1;", "localhost;", "0.0.0.0;"
    ]):
        return "command_injection"

    # ── SSRF ──────────────────────────────────────────────────────
    if any(x in text for x in [
        "169.254.169.254", "metadata.google",
        "192.168.", "10.0.", "172.16."
    ]):
        return "ssrf"

    # ── Unknown / Obfuscated Attack ───────────────────────────────
    special_ratio       = sum(c in "!@#$%^&*?|;`~\\{}[]<>" for c in original) / max(len(original), 1)
    consecutive_special = re.search(r'[!@#$%^&*?|;`~\\]{3,}', original)
    repeated_slashes    = re.search(r'/{3,}', original)
    random_pattern      = re.search(r'\?\?\?|///|@@@|###|\$\$\$', original)

    if special_ratio > 0.3 or consecutive_special or repeated_slashes or random_pattern:
        return "unknown_attack"

    return "none"