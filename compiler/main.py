import ply.lex as lex
import ply.yacc as yacc

t_ignore = " \t"

variables = dict()

reserved = {
    "if": "IF",
    "then": "THEN",
    "else": "ELSE",
    "comprar": "ACTION",
    "buy": "ACTION",
    "registar": "ACTION",
    "register": "ACTION",
    "reservar": "ACTION",
    "reserve": "ACTION",
    "cancelar": "ACTION",
    "cancel": "ACTION",
    "sala": "ROOM",
    "room": "ROOM",
    "equipamento": "EQUIPMENT",
    "equipment": "EQUIPMENT",
    "sensor": "SENSOR",
    "laboratorio": "LAB",
    "laboratory": "LAB",
}

tokens = [
    "ID",
    "TIME",
    "COLON",
    "COMMA",
] + list(set(reserved.values()))


def t_TIME(t):
    r"([01][0-9]|2[0-3]):[03]0"
    return t


def t_ID(t):
    r"[a-zA-Z]+[0-9]*"
    t.type = reserved.get(t.value.lower(), "ID")
    return t


def t_COLON(t):
    r":"
    return t


def t_COMMA(t):
    r","
    return t


def t_error(t):
    print(f"Illegal character '{t.value[0]}'")
    t.lexer.skip(1)


lexer = lex.lex()


def p_type(p):
    """type : ROOM
    | EQUIPMENT
    | SENSOR
    | LAB"""
    p[0] = p[1]


def p_action(p):
    """registration : ACTION objects"""
    pass


def p_objects(p):
    """objects : type COLON ID COMMA TIME"""
    pass


def p_reservation(p):
    pass


def p_cancellation(p):
    pass


def p_error(p):
    print("Syntax error!")


parser = yacc.yacc()
