import sys


# Load environment variables from the .env file (if present)
from jwt_token import token
import requests
import ply.lex as lex
import ply.yacc as yacc
from dotenv import load_dotenv
import os

import jwt_token

load_dotenv()

API_URL=os.getenv('API_URL')

t_ignore = ' \t'

variables = {}


def get_headers():
    return {
        "Authorization": f"Bearer {jwt_token.token}",
        "Content-Type": "application/json"
    }

reserved = {
    'if':   'IF',
    'then': 'THEN',
    'else': 'ELSE',
}
HARDCODED_SPACES = {
    'F1_R1':  {'floor': 'FLOOR_1', 'x': 477,  'y': 828},
    'F1_R2':  {'floor': 'FLOOR_1', 'x': 151,  'y': 576},
    'F1_R3':  {'floor': 'FLOOR_1', 'x': 800,  'y': 400},
    'F1_R4':  {'floor': 'FLOOR_1', 'x': 284,  'y': 400},
    'F1_R5':  {'floor': 'FLOOR_1', 'x': 725,  'y': 128},
    'F1_R6':  {'floor': 'FLOOR_1', 'x': 338,  'y': 148},
    'F1_R7':  {'floor': 'FLOOR_1', 'x': 1490, 'y': 266},
    'F1_R8':  {'floor': 'FLOOR_1', 'x': 1798, 'y': 146},
    'F1_R9':  {'floor': 'FLOOR_1', 'x': 1486, 'y': 792},
    'F1_R10': {'floor': 'FLOOR_1', 'x': 1832, 'y': 536},
    'F2_R1':  {'floor': 'FLOOR_2', 'x': 1544, 'y': 782},
    'F2_R2':  {'floor': 'FLOOR_2', 'x': 1836, 'y': 532},
    'F2_R3':  {'floor': 'FLOOR_2', 'x': 1650, 'y': 346},
    'F2_R4':  {'floor': 'FLOOR_2', 'x': 1774, 'y': 174},
    'F2_R5':  {'floor': 'FLOOR_2', 'x': 1364, 'y': 172},
    'F2_R6':  {'floor': 'FLOOR_2', 'x': 729,  'y': 170},
    'F2_R7':  {'floor': 'FLOOR_2', 'x': 329,  'y': 176},
    'F2_R8':  {'floor': 'FLOOR_2', 'x': 291,  'y': 420},
    'F2_R9':  {'floor': 'FLOOR_2', 'x': 185,  'y': 582},
    'F2_R10': {'floor': 'FLOOR_2', 'x': 562,  'y': 640},
    'F2_R11': {'floor': 'FLOOR_2', 'x': 693,  'y': 736},
    'F2_R12': {'floor': 'FLOOR_2', 'x': 375,  'y': 784},
    'F2_R13': {'floor': 'FLOOR_2', 'x': 591,  'y': 898},
}

def resolve_hcid(hcid: str):
    key = hcid.upper()
    if key not in HARDCODED_SPACES:
        print(f"Semantic error: unknown hcId '{hcid}'")
        return None
    return HARDCODED_SPACES[key]

def resources_to_text(resources):
    lines = []

    for r in resources:
        status = "available" if r["isAvailable"] else "unavailable"

        lines.append(
            f"Resource {r['id']}: {r['name']} "
            f"({r['type']}) — Floor {r['floor']}, "
            f"capacity {r['capacity']}, currently {status}."
        )

    return "\n".join(lines)
tokens = [
    'ID',
    'NUMBER',
    'FLOAT',
    'EQUIPMENT',
    'BUY',
    'MEAL',
    'REGISTER',
    'RENT',
    'CANCEL',
    'COLON',
    'COMMA',
    'ASSIGN',
    'DISHTYPE',
    'WEEKDAY',
    'HOUR',
    'DATE',
    'SENSORTYPE',
    'NIF',
    'STRING',
    'USER',
    'USERTYPE',
    'EMAIL',
    'PASSWORD',
    'ADDRESS',
    'GET',
    'RESOURCE_TYPE',
    'RESOURCES',
    'HCID'
] + list(reserved.values())


def t_EQUIPMENT(t):
    r'[Ss]ala|[Ee]quipamento|[Ss]ensor|[Ll]aboratorio|[Rr]oom|[Ee]quipment|[Ll]ab'
    mapping = {
        'sala': 'room', 'Sala': 'room',
        'equipamento': 'equipment', 'Equipamento': 'equipment',
        'laboratorio': 'lab', 'Laboratorio': 'lab',
        'sensor': 'sensor', 'Sensor': 'sensor',
    }
    t.value = mapping.get(t.value, t.value.lower())
    return t

def t_STRING(t):
    r'"[^"]*"'
    t.value = t.value[1:-1]  # strip quotes
    return t

def t_USERTYPE(t):
    r'[Aa]dmin|[Rr]egular'
    return t

def t_MEAL(t):
    r'[Mm]eal|[Rr]efeição'
    t.value = 'meal'
    return t

def t_HCID(t):
    r'[Ff][0-9]+_[Rr][0-9]+'
    t.value = t.value.upper()
    return t

def t_SENSORTYPE(t):
    r'[Tt]emperature|[Ee]nergy|[Aa]ir[_-]?[Qq]uality|[Oo]ccupancy'
    mapping = {
        'temperature': 'TEMPERATURE',
        'energy':      'ENERGY_CONSUMPTION',
        'occupancy':   'OCCUPANCY',
    }
    v = t.value.lower().replace('-', '_').replace(' ', '_')
    if 'air' in v:
        t.value = 'AIR_QUALITY'
    else:
        t.value = mapping.get(v, v.upper())
    return t

def t_CANCEL(t):
    r'[Cc]ancelar|[Cc]ancel'
    t.value = 'cancel'
    return t

def t_BUY(t):
    r'[Bb]uy|[Cc]omprar'
    t.value = 'buy'
    return t

def t_GET(t):
    r'[Gg]et'
    t.value= 'get'
    return t

def t_RESOURCES(t):
    r'[Rr]esources'
    t.value = 'resources'
    return t

def t_REGISTER(t):
    r'[Rr]egist[ea]r'
    t.value = 'register'
    return t

def t_RENT(t):
    r'[Rr]ent|[Aa]lugar|[Rr]eservar|[Rr]eserve'
    t.value = 'rent'
    return t

def t_DISHTYPE(t):
    r'[Mm]ain|[Dd]essert|[Pp]rincipal|[Ss]obremesa|[Mm]eat|[Ff]ish|[Vv]egetarian|[Dd]iet'
    mapping = {
        'main': 'MEAT', 'principal': 'MEAT',
        'dessert': 'DIET', 'sobremesa': 'DIET',
        'meat': 'MEAT', 'fish': 'FISH',
        'vegetarian': 'VEGETARIAN', 'diet': 'DIET',
    }
    t.value = mapping.get(t.value.lower(), t.value.upper())
    return t

def t_DATE(t):
    r'(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}'
    d, m, y = t.value.split('/')
    t.value = f"{y}-{m}-{d}"
    return t

def t_HOUR(t):
    r'([01][0-9]|2[0-3]):[03]0'
    return t

def t_WEEKDAY(t):
    r'[Mm]onday|[Tt]uesday|[Ww]ednesday|[Tt]hursday|[fF]riday|[Ss]aturday|[Ss]unday|[Ss]egunda-feira|[Tt]erça-feira|[qQ]uarta-feira|[qQ]uinta-feira|[Ss]exta-feira'
    pt_map = {
        'segunda-feira': 'monday', 'terça-feira': 'tuesday',
        'quarta-feira':  'wednesday', 'quinta-feira': 'thursday',
        'sexta-feira':   'friday',
    }
    t.value = pt_map.get(t.value.lower(), t.value.lower())
    return t

def t_EMAIL(t):
    r'[^\s@,]+@[^\s@,]+\.[^\s@,]+'
    return t

def t_PASSWORD(t):
    r'(?=[^,\s]*[a-z])(?=[^,\s]*[A-Z])[^,\s]{8,}'
    return t
def t_USER(t):
    r'[Uu]ser|[Uu]suário'
    t.value='user'
    return t

def t_FLOAT(t):
    r'[0-9]+\.[0-9]+'
    t.value = float(t.value)
    return t

def t_ID(t):
    r'[a-zA-Z_][a-zA-Z0-9_]*'
    t.type = reserved.get(t.value, 'ID')
    return t


def t_NIF(t):
    r'\d{9}'
    return t

def t_NUMBER(t):
    r'[0-9]+'
    t.value = int(t.value)
    return t


t_COLON  = r':'
t_COMMA  = r','
t_ASSIGN = r'='

def t_error(t):
    print(f"Illegal character '{t.value[0]}'")
    t.lexer.skip(1)


def resolveVariable(name):
    if name not in variables:
        print(f"Semantic error: undefined variable '{name}'")
        return None
    return variables[name]

RESOURCE_TYPE = {
    'room':      'ROOM',
    'lab':       'LABORATORY',
    'equipment': 'EQUIPMENT',
}


def p_statement_assign(p):
    '''statement : ID ASSIGN value'''
    variables[p[1]] = p[3]
    p[0] = {'assign': p[1], 'value': p[3]}
    print(f"  [var] {p[1]} = {p[3]}")

def p_statement_instruction(p):
    '''statement : instruction'''
    p[0] = p[1]

def p_value(p):
    '''value : NUMBER
             | FLOAT
             | DATE
             | HOUR
             | WEEKDAY
             | DISHTYPE
             | SENSORTYPE
             | ID'''
    p[0] = p[1]


def p_number_or_var(p):
    '''number_or_var : NUMBER 
                     | ID'''
    p[0] = resolveVariable(p[1]) if p.slice[1].type == 'ID' else p[1]

def p_float_or_var(p):
    '''float_or_var : FLOAT 
                    | NUMBER 
                    | ID'''
    p[0] = resolveVariable(p[1]) if p.slice[1].type == 'ID' else p[1]

def p_date_or_var(p):
    '''date_or_var : DATE 
                    | ID'''
    p[0] = resolveVariable(p[1]) if p.slice[1].type == 'ID' else p[1]

def p_hour_or_var(p):
    '''hour_or_var : HOUR
                   | ID'''
    p[0] = resolveVariable(p[1]) if p.slice[1].type == 'ID' else p[1]

def p_dishtype_or_var(p):
    '''dishtype_or_var : DISHTYPE
                       | ID'''
    p[0] = resolveVariable(p[1]) if p.slice[1].type == 'ID' else p[1]

def p_sensortype_or_var(p):
    '''sensortype_or_var : SENSORTYPE 
                         | ID'''
    p[0] = resolveVariable(p[1]) if p.slice[1].type == 'ID' else p[1]

def p_instruction_rent_resource(p):
    '''instruction : RENT EQUIPMENT COLON number_or_var COMMA hour_or_var COMMA hour_or_var COMMA date_or_var'''
    resource_id = p[4]
    start_hour  = p[6]
    end_hour    = p[8]
    date        = p[10]

    start_dt = f"{date}T{start_hour}:00"  # ISO format for new Date() in JS
    end_dt   = f"{date}T{end_hour}:00"

    payload = {
        'resourceId': resource_id,
        'startTime':  start_dt,
        'endTime':    end_dt,
        'status':     'ACTIVE'   # or whatever your default is
        # userId and mobilityResourceId are handled server-side from the token
    }

    response = requests.post(
        f"{API_URL}/api/reservations/",
        json=payload,
        headers=get_headers()  # token carries userId, Node extracts it
    )

    data = response.json()
    if response.status_code == 201:
        p[0] = "Reservation created successfully"
    else:
        p[0] = data.get('error', response.json().get('message'))
def p_instruction_cancel_resource(p):
    '''instruction : CANCEL EQUIPMENT COLON number_or_var'''
    reservation_id = p[4]
    query = (
        f'UPDATE "Reservation" '
        f"SET \"status\" = 'CANCELED' "
        f'WHERE "id" = {reservation_id};'
    )
    p[0] = {
        'action': 'cancel', 'equipment': p[2],
        'reservationId': reservation_id,
        'query': query,
    }

def p_instruction_buy_meal(p):
    '''instruction : BUY MEAL COLON dishtype_or_var COMMA date_or_var'''
    dish_type = p[4]
    date      = p[6]


    p[0] = {
        'action': 'buy', 'meal': True,
    }

def p_instruction_cancel_meal(p):
    '''instruction : CANCEL MEAL COLON number_or_var'''
    ticket_id = p[4]
    p[0] = {
        'action': 'cancel', 'meal': True,
        'ticketId': ticket_id,
    }

def p_instruction_register_user(p):
    '''instruction : REGISTER USER COLON STRING COMMA STRING COMMA NIF COMMA EMAIL COMMA ID COMMA PASSWORD COMMA USERTYPE'''
    p[0]={
            'name': p[4],
            'address':p[6],
            'nif':p[8],
            'email':p[10],
            'login':p[12],
            'password':p[14],
            'type':p[16].upper()
            }

    response = requests.post(
        f"{API_URL}/api/users/register",
        json=p[0],
        headers=get_headers()
    )
    print(response)

def p_instruction_register_resource(p):
    '''instruction : REGISTER EQUIPMENT COLON ID COMMA number_or_var COMMA number_or_var COMMA number_or_var COMMA number_or_var
                   | REGISTER EQUIPMENT COLON HCID'''
    
    # Short form: register room : F1_R3
    if len(p) == 5:
        space = resolve_hcid(p[4])
        if not space:
            p[0] = None
            return
        resource = {
            'type': RESOURCE_TYPE.get(p[2]),
            'name': p[4],
            'floor': space['floor'],
            'xCoordinates': space['x'],
            'yCoordinates': space['y'],
            'capacity': 0,
            'isAvailable': True
        }
    else:
        resource = {
            'type': p[2],
            'name': p[4],
            'capacity': p[6],
            'floor': p[8],
            'isAvailable': 'true',
            'xCoordinates': p[10],
            'yCoordinates': p[12],
        }

    p[0] = resource
    response = requests.post(
        f"{API_URL}/api/resources/",
        json=resource,
        headers=get_headers()
    )
    print(response.json())
def p_instruction_get_resources(p):
    '''instruction : GET RESOURCES'''
    response = requests.get(
                f"{API_URL}/api/resources/",
                headers=get_headers()
                )

    p[0] = resources_to_text(response.json())
    print(resources_to_text(response.json()))



def p_instruction_register_sensor(p):
    '''instruction : REGISTER EQUIPMENT COLON sensortype_or_var COMMA number_or_var COMMA float_or_var'''
    sensor_type  = p[4]
    resource_id  = p[6]
    alert_limit  = p[8]

    p[0] = {
        'action': 'register', 'target': 'sensor',
        'sensorType': sensor_type, 'resourceId': resource_id,
        'alertLimit': alert_limit,
    }
def p_action(p):
    '''action : RENT 
              | BUY 
              | REGISTER 
              | CANCEL'''
    p[0] = p[1]

def p_error(p):
    if p:
        print(f"Syntax error at token: {p}")
    else:
        print("Syntax error at EOF")


lexer  = lex.lex()
parser = yacc.yacc()

#print("Ready. Examples:")
#print("  rent room : 3 , 09:00 , 10:00 , 25/06/2025")
#print("  cancel room : 42")
#print("  buy meal : MEAT , 25/06/2025")
#print("  cancel meal : 15")
#print("  register room : LabA , 30")
#print("  register sensor : temperature , 3 <sensor_id> , 28.5 <alert_limit>")
#print("")
#
#while True:
#    try:
#        s = input('> ').strip()
#    except EOFError:
#        break
#    if not s:
#        continue
#
#    result = parser.parse(s)
#
#    if result:
#        print(result)
