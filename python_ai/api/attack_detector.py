def detect_attack_type(url, content=""):

    text = (url + " " + content).lower()

    # SQL Injection
    if any(x in text for x in [
        "select", "union", "drop", "insert", "delete",
        "' or ", "\" or ", "1=1", "or 1=1"
    ]):
        return "sql_injection"

    # XSS
    if any(x in text for x in [
        "<script", "alert(", "javascript:",
        "onerror=", "onload="
    ]):
        return "xss"

    # Path Traversal
    if "../" in text or "..\\" in text:
        return "path_traversal"

    # File Inclusion
    if any(x in text for x in [
        "etc/passwd", "boot.ini", "win.ini"
    ]):
        return "file_inclusion"

    # Command Injection
    if any(x in text for x in [
        ";ls", ";cat", "|whoami", "|id"
    ]):
        return "command_injection"

    return "unknown_attack"