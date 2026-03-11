def detect_attack_type(url, content=""):

    text = (url + " " + content).lower()

    if any(x in text for x in [
        "union select",
        "' or 1=1",
        "drop table",
        "select * from",
        "insert into"
    ]):
        return "sql_injection"

    if any(x in text for x in [
        "<script>",
        "alert(",
        "javascript:"
    ]):
        return "xss"

    if "../" in text or "..\\" in text:
        return "path_traversal"

    if any(x in text for x in [
        ";ls",
        ";cat",
        "&&",
        "|"
    ]):
        return "command_injection"

    if "http://" in text or "https://" in text:
        return "remote_file_inclusion"

    return "unknown_attack"