import ply.lex as lex
import ply.yacc as yacc

t_ignore = ' \t'


variables  = dict()

reserved = {
        'if':'IF',
        'then':'THEN',
        'else':'ELSE',
        'reservar':'RESERVAR',
        }

tokens=[
        'ID',
        'TYPE',
        'DATA',
        'RESERVE',
        'REGISTER',
        'BUY'
        ] + list(reserved.values())



def t_TIPO(t):
    r'sala|equipamento|sensor|laboratorio'
    return t

def t_ACTION(t):
    r'[cC]omprar|[rR]egistar|[rR]eservar '

    return t

def t_BUY(t):
    r'[Bb]uy|[Cc]omprar'
    t.value = 'buy'
    return t;

def t_REGISTER(t):
    r'[Rr]egist[ea]r'
    t.value = 'register'
    return t

def t_RENT(t):
    r'[Rr]ent|[Aa]lugar'
    t.value = 'rent'
    return t

def t_HORA(t):
    r'([01][0-9]|2[0-3]):[03]0'
    return t

def t_ID(t):
    r'[a-zA-Z]+[0-9]*'
    t.type = reserved.get(t.value,'ID')
    return t

def t_COLON(t):
    r':'
    return t

def t_COMMA(t):
    r','
    return t

def p_action(p):
    '''action: RENT
            | BUY
            | REGISTER  
    '''

def p_instruction(p):
    '''instruction : action TIPO COLON ID COMMA HORA '''


lex.lex()
yacc.yacc()
