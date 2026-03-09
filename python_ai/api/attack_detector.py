def detect_attack_type(url, content):

    text = (url + " " + content).lower()

    patterns = {

        "sql_injection":[
            "union select","select ","drop table",
            "insert into","delete from"," or 1=1","' or '1'='1"
        ],

        "xss":[
            "<script","alert(","javascript:","onerror=","onload="
        ],

        "command_injection":[
            ";ls",";cat",";whoami","|ls","|cat","&&"
        ],

        "path_traversal":[
            "../","..\\"
        ],

        "file_inclusion":[
            "/etc/passwd","boot.ini","/proc/self/environ"
        ],

        "directory_traversal":[
            "../../"
        ],

        "shell_injection":[
            "$(","`"
        ],

        "ldap_injection":[
            "*)(uid=*"
        ],

        "xpath_injection":[
            " or '1'='1"
        ],

        "open_redirect":[
            "redirect="
        ],

        "csrf":[
            "csrf_token"
        ],

        "cookie_poisoning":[
            "cookie="
        ],

        "xml_injection":[
            "<?xml"
        ],

        "ssi_injection":[
            "<!--#exec"
        ],

        "buffer_overflow":[
            "aaaaaaaaaaaa"
        ],

        "remote_file_inclusion":[
            "http://"
        ],

        "local_file_inclusion":[
            "../etc"
        ],

        "template_injection":[
            "{{"
        ],

        "code_injection":[
            "eval("
        ],

        "log_poisoning":[
            "/var/log"
        ]

    }

    for attack, plist in patterns.items():

        for p in plist:

            if p in text:
                return attack

    return "unknown_attack"