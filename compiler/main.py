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
        ] + list(reserved.values())



def t_TIPO(t):
    r'sala|equipamento|sensor|laboratorio'
    return t

def t_ACTION(t):
    r'[cC]omprar|[rR]egistar|[rR]eservar '

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
    '''registo: ACTION objects  '''

def p_objects(p):
    '''TIPO COLON ID COMMA HORA '''

def p_reserva()

def p_cancelamento()

