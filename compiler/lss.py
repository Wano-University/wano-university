import sys
from datetime import datetime
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
    'mobility':'MOBILITY'
}

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
    'RESERVATIONS',
    'ACTIVE',
    'COMPLETED',
    'CANCELED',
    'UPDATE',
    'MOBILITY',
    'MOBILITY_TYPE',
    'MOBILITY_STATUS',
    'FLOOR',
    'HCID'
] + list(reserved.values())
t_COLON  = r':'
t_COMMA  = r','
t_ASSIGN = r'='



HARDCODED_PARKING_SPACES = {
    'F1_R1':  {'floor': 'FLOOR_1', 'x': 410,  'y': 835},
    'F1_R2':  {'floor': 'FLOOR_1', 'x': 480,  'y': 835},
    'F1_R4':  {'floor': 'FLOOR_1', 'x': 550,  'y': 835},
    'F1_R5':  {'floor': 'FLOOR_1', 'x': 620,  'y': 835},
    'F1_R6':  {'floor': 'FLOOR_1', 'x': 690,  'y': 835},
    'F1_R7':  {'floor': 'FLOOR_1', 'x': 760,  'y': 835},
    'F1_R8':  {'floor': 'FLOOR_1', 'x': 1270, 'y': 835},
    'F1_R9':  {'floor': 'FLOOR_1', 'x': 1340, 'y': 835},
    'F1_R10': {'floor': 'FLOOR_1', 'x': 1410, 'y': 835},
    'F1_R11': {'floor': 'FLOOR_1', 'x': 1480, 'y': 835},
    'F1_R12': {'floor': 'FLOOR_1', 'x': 1550, 'y': 835},
    'F1_R13': {'floor': 'FLOOR_1', 'x': 1620, 'y': 835},
    'F1_R14': {'floor': 'FLOOR_1', 'x': 1753, 'y': 810},
    'F1_R15': {'floor': 'FLOOR_1', 'x': 1753, 'y': 760},
    'F1_R16': {'floor': 'FLOOR_1', 'x': 1753, 'y': 710},
    'F1_R17': {'floor': 'FLOOR_1', 'x': 1753, 'y': 660},
    'F1_R18': {'floor': 'FLOOR_1', 'x': 1753, 'y': 610},
    'F1_R19': {'floor': 'FLOOR_1', 'x': 1753, 'y': 210},
    'F1_R20': {'floor': 'FLOOR_1', 'x': 1540, 'y': 710},
    'F1_R21': {'floor': 'FLOOR_1', 'x': 1540, 'y': 660},
    'F1_R22': {'floor': 'FLOOR_1', 'x': 1540, 'y': 610},
    'F1_R23': {'floor': 'FLOOR_1', 'x': 1540, 'y': 560},
    'F1_R24': {'floor': 'FLOOR_1', 'x': 1540, 'y': 510},
    'F1_R25': {'floor': 'FLOOR_1', 'x': 1540, 'y': 460},
    'F1_R26': {'floor': 'FLOOR_1', 'x': 1540, 'y': 410},
    'F1_R27': {'floor': 'FLOOR_1', 'x': 1540, 'y': 360},
    'F1_R28': {'floor': 'FLOOR_1', 'x': 1540, 'y': 310},
    'F1_R29': {'floor': 'FLOOR_1', 'x': 1540, 'y': 260},
    'F1_R30': {'floor': 'FLOOR_1', 'x': 1190, 'y': 760},
    'F1_R31': {'floor': 'FLOOR_1', 'x': 1190, 'y': 710},
    'F1_R32': {'floor': 'FLOOR_1', 'x': 1190, 'y': 660},
    'F1_R33': {'floor': 'FLOOR_1', 'x': 1190, 'y': 610},
    'F1_R34': {'floor': 'FLOOR_1', 'x': 1190, 'y': 560},
    'F1_R35': {'floor': 'FLOOR_1', 'x': 1190, 'y': 510},
    'F1_R36': {'floor': 'FLOOR_1', 'x': 1190, 'y': 460},
    'F1_R37': {'floor': 'FLOOR_1', 'x': 1190, 'y': 410},
    'F1_R38': {'floor': 'FLOOR_1', 'x': 1190, 'y': 360},
    'F1_R39': {'floor': 'FLOOR_1', 'x': 1190, 'y': 310},
    'F1_R40': {'floor': 'FLOOR_1', 'x': 1190, 'y': 260},
    'F1_R41': {'floor': 'FLOOR_1', 'x': 840,  'y': 760},
    'F1_R42': {'floor': 'FLOOR_1', 'x': 840,  'y': 710},
    'F1_R43': {'floor': 'FLOOR_1', 'x': 840,  'y': 660},
    'F1_R44': {'floor': 'FLOOR_1', 'x': 840,  'y': 610},
    'F1_R45': {'floor': 'FLOOR_1', 'x': 840,  'y': 560},
    'F1_R46': {'floor': 'FLOOR_1', 'x': 840,  'y': 510},
    'F1_R47': {'floor': 'FLOOR_1', 'x': 840,  'y': 460},
    'F1_R48': {'floor': 'FLOOR_1', 'x': 840,  'y': 410},
    'F1_R49': {'floor': 'FLOOR_1', 'x': 840,  'y': 360},
    'F1_R50': {'floor': 'FLOOR_1', 'x': 840,  'y': 310},
    'F1_R51': {'floor': 'FLOOR_1', 'x': 840,  'y': 260},
    'F1_R53': {'floor': 'FLOOR_1', 'x': 615,  'y': 710},
    'F1_R54': {'floor': 'FLOOR_1', 'x': 615,  'y': 660},
    'F1_R55': {'floor': 'FLOOR_1', 'x': 615,  'y': 610},
    'F1_R56': {'floor': 'FLOOR_1', 'x': 615,  'y': 560},
    'F1_R57': {'floor': 'FLOOR_1', 'x': 615,  'y': 510},
    'F1_R58': {'floor': 'FLOOR_1', 'x': 615,  'y': 460},
    'F1_R59': {'floor': 'FLOOR_1', 'x': 615,  'y': 410},
    'F1_R60': {'floor': 'FLOOR_1', 'x': 615,  'y': 360},
    'F1_R61': {'floor': 'FLOOR_1', 'x': 615,  'y': 310},
    'F1_R62': {'floor': 'FLOOR_1', 'x': 615,  'y': 260},
    'F1_R63': {'floor': 'FLOOR_1', 'x': 490,  'y': 710},
    'F1_R64': {'floor': 'FLOOR_1', 'x': 490,  'y': 660},
    'F1_R65': {'floor': 'FLOOR_1', 'x': 490,  'y': 610},
    'F1_R66': {'floor': 'FLOOR_1', 'x': 490,  'y': 560},
    'F1_R67': {'floor': 'FLOOR_1', 'x': 490,  'y': 510},
    'F1_R68': {'floor': 'FLOOR_1', 'x': 490,  'y': 460},
    'F1_R69': {'floor': 'FLOOR_1', 'x': 490,  'y': 410},
    'F1_R70': {'floor': 'FLOOR_1', 'x': 490,  'y': 360},
    'F1_R71': {'floor': 'FLOOR_1', 'x': 490,  'y': 310},
    'F1_R72': {'floor': 'FLOOR_1', 'x': 490,  'y': 260},
    'F1_R73': {'floor': 'FLOOR_1', 'x': 277,  'y': 810},
    'F1_R74': {'floor': 'FLOOR_1', 'x': 277,  'y': 760},
    'F1_R75': {'floor': 'FLOOR_1', 'x': 277,  'y': 710},
    'F1_R76': {'floor': 'FLOOR_1', 'x': 277,  'y': 660},
    'F1_R77': {'floor': 'FLOOR_1', 'x': 277,  'y': 610},
    'F1_R78': {'floor': 'FLOOR_1', 'x': 277,  'y': 460},
    'F1_R79': {'floor': 'FLOOR_1', 'x': 277,  'y': 410},
    'F1_R80': {'floor': 'FLOOR_1', 'x': 277,  'y': 360},
    'F1_R81': {'floor': 'FLOOR_1', 'x': 277,  'y': 310},
    'F1_R82': {'floor': 'FLOOR_1', 'x': 277,  'y': 260},
    'F1_R83': {'floor': 'FLOOR_1', 'x': 277,  'y': 210},
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

def mobility_resources_to_text(resources):
    if not resources:
        return "No mobility resources"
    return "\n".join(f"MobilityResource {r['id']}: {r['type']} — Identifier {r['identifier']}, Location {r['location']}, Status {r['status']}." for r in resources)

def reservations_to_text(reservations):

    lines = []

    if(len(reservations)<1):
        lines.append("No reservations")
    for r in reservations:
        start = r["startTime"]
        end = r["endTime"]

        if isinstance(start, datetime):
            start = start.strftime("%Y-%m-%d %H:%M")
        if isinstance(end, datetime):
            end = end.strftime("%Y-%m-%d %H:%M")

        lines.append(
            f"Reservation {r['id']} — User {r['userId']} "
            f"({start} -> {end}), status {r.get('status', 'ACTIVE')}."
        )

    return "\n".join(lines)

def sensors_to_text(sensors):
    if not sensors:
        return "No sensors"
    return "\n".join(f"Sensor {s['id']}: {s['type']} — Space {s['space']}, Floor {s['floor']} " for s in sensors)

def resources_to_text(resources):

    if not resources:
        return "No resources to show"
    lines = []
    for r in resources:
        status = "available" if r["isAvailable"] else "unavailable"

        lines.append(
            f"Resource {r['id']}: {r['name']} "
            f"({r['type']}) — Floor {r['floor']}, "
            f"capacity {r['capacity']}, currently {status}."
        )

    return "\n".join(lines)

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

def t_MOBILITY_TYPE(t):
    r'[Pp]arking[_-]?[Ss]pot|[Ss]cooter|[Bb]icycle'
    mapping = {
        'scooter': 'SCOOTER',
        'bicycle': 'BICYCLE',
    }
    v = t.value.lower().replace('-', '_').replace(' ', '_')
    if 'parking' in v:
        t.value = 'PARKING_SPOT'
    else:
        t.value = mapping.get(v, v.upper())
    return t
def t_MOBILITY_STATUS(t):
    r'[Ff]ree|[Oo]ccupied|[Ii]nactive'
    mapping = {
        'free':     'FREE',
        'occupied': 'OCCUPIED',
        'inactive': 'INACTIVE',
    }
    t.value = mapping.get(t.value.lower(), t.value.upper())
    return t

def t_STRING(t):
    r'"[^"]*"'
    t.value = t.value[1:-1]  # strip quotes
    return t

def t_USERTYPE(t):
    r'[Aa]dmin|[Ss](tudent|taff)|[Tt]eacher'
    return t

#def t_MEAL(t):
#    r'[Mm]eal|[Rr]efeição'
#    t.value = 'meal'
#    return t
#
def t_ACTIVE(t):
    r'[Aa]ctive|[Aa]tiva'
    t.value = 'active'
    return t 
def t_COMPLETED(t):
    r'[Cc](ompleted|ompletada)'
    t.value = 'completed'
    return t 

def t_CANCELED(t):
    r'[Cc](anceled|ancelada)'
    t.value = 'completed'
    return t 

def t_UPDATE(t):
    r'[Uu]pdate|[Aa]lterar'
    t.value="update"
    return t

def t_RESERVATIONS(t):
    r'[Rr]eservations|[Rr]eservas'
    t.value='reservations'
    return t
def t_HCID(t):
    r'[Ff][0-9]+_[Rr][0-9]+'
    t.value = t.value.upper()
    return t

def t_SENSORTYPE(t):
    r'[Tt]emperature|[Ee]nergy|[Aa]ir[_-]?[Qq]uality'
    mapping = {
        'temperature': 'TEMPERATURE',
        'energy':      'ENERGY_CONSUMPTION',
        'air_quality':   'AIR_QUALITY',
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
def t_FLOOR(t):
    r'[Ff][Ll][Oo][Oo][Rr]_[12]'
    t.value = t.value.upper()
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

#RESERVATIONS
def p_instruction_rent_resource(p):
    '''instruction : RENT EQUIPMENT COLON number_or_var COMMA hour_or_var COMMA hour_or_var COMMA date_or_var'''
    resource_id = p[4]
    start_hour  = p[6]
    end_hour    = p[8]
    date        = p[10]

    start_dt = f"{date}T{start_hour}:00"  
    end_dt   = f"{date}T{end_hour}:00"

    payload = {
        'resourceId': resource_id,
        'startTime':  start_dt,
        'endTime':    end_dt,
        'status':     'ACTIVE'   
    }

    response = requests.post(
        f"{API_URL}/api/reservations/",
        json=payload,
        headers=get_headers()  
    )

    data = response.json()
    if response.status_code == 201:
        p[0] = "Reservation created successfully"
    else:
        p[0] = data.get('error', response.json().get('message'))

def p_reservation_status(p):
    """reservation_status : ACTIVE
                          | COMPLETED
                          | CANCELED"""

    mapping = {
        "active": "ACTIVE",
        "completed": "COMPLETED",
        "canceled": "CANCELED",
    }

    p[0] = mapping[p[1]]

def p_instruction_get_reservations(p):
    '''instruction : GET RESERVATIONS'''

    response = requests.get(
            f"{API_URL}/api/reservations/",
            headers=get_headers()
            )

    if(response.status_code == 200):
        p[0] = reservations_to_text(response.json())
        return
    p[0]= "Failed to get Reservations"

def p_instruction_get_reservations_by_user(p):
    '''instruction : GET RESERVATIONS number_or_var'''
    response = requests.get(
            f"{API_URL}/api/reservations/user/{p[3]}",
            headers=get_headers()  
        )
    if(response.status_code == 200):
        p[0] = reservations_to_text(response.json())

        return
    p[0]= "Failed to get Reservations"

def p_instruction_update_reservation(p):
    '''instruction : UPDATE RESERVATIONS  number_or_var reservation_status'''

    status={
            'status':p[4].upper()
            }
    response = requests.patch(
            f"{API_URL}/api/reservations/{p[3]}",
            json=status,
            headers=get_headers()  
        )
    if(response.status_code == 200):
        p[0] = "Update successfull" 

        return
    p[0]= response


#def p_instruction_cancel_resource(p):
#    '''instruction : CANCEL EQUIPMENT COLON number_or_var'''
#    reservation_id = p[4]
#    query = (
#        f'UPDATE "Reservation" '
#        f"SET \"status\" = 'CANCELED' "
#        f'WHERE "id" = {reservation_id};'
#    )
#    p[0] = {
#        'action': 'cancel', 'equipment': p[2],
#        'reservationId': reservation_id,
#        'query': query,
#    }

#def p_instruction_buy_meal(p):
#    '''instruction : BUY MEAL COLON dishtype_or_var COMMA date_or_var'''
#    dish_type = p[4]
#    date      = p[6]
#
#
#    p[0] = {
#        'action': 'buy', 'meal': True,
#    }
#
#def p_instruction_cancel_meal(p):
#    '''instruction : CANCEL MEAL COLON number_or_var'''
#    ticket_id = p[4]
#    p[0] = {
#        'action': 'cancel', 'meal': True,
#        'ticketId': ticket_id,
#    }

#USERS
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
    
#RESOURCES
def p_instruction_register_resource(p):
    '''instruction :  REGISTER EQUIPMENT COLON HCID COMMA number_or_var'''
    
    # Short form: register room : F1_R3
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
        'capacity': p[6],
        'isAvailable': True
        }
    p[0] = resource
    response = requests.post(
        f"{API_URL}/api/resources/",
        json=resource,
        headers=get_headers()
    )
    if(response.status_code == 201):
            p[0]="Success: " ,response.status_code
    else:
            p[0] = "Failed to create resource" + response.text
    print(response)

def p_instruction_get_resources(p):
    '''instruction : GET RESOURCES'''
    response = requests.get(
                f"{API_URL}/api/resources/",
                headers=get_headers()
                )


    if(response.status_code == 200):
        p[0] = resources_to_text(response.json())
    else: 
        p[0] = "Failed to get resources"
    print(resources_to_text(response.json()))



def p_instruction_get_resources_by_floor(p):
    '''instruction : GET RESOURCES number_or_var'''
    if(p[3] > 2):
        p[0]= "Invalid floor (1 or 2)"
        return
    response = requests.get(
                f"{API_URL}/api/resources/floor/FLOOR_{str(p[3]).upper()}",
                headers=get_headers()
                )

    if(response.status_code == 200):
        p[0] = resources_to_text(response.json())
    else:
        p[0] = "Failed to get resources by floor"
    print(resources_to_text(response.json()))

def p_instruction_get_resources_by_type(p):
    '''instruction : GET RESOURCES EQUIPMENT'''

    resource_type = RESOURCE_TYPE.get(p[3])

    if not resource_type:
        p[0] = "Invalid resource type"
        return

    response = requests.get(
        f"{API_URL}/api/resources/type/{resource_type}",
        headers=get_headers()
    )

    data = response.json()

    if isinstance(data, str):
        p[0] = data
        return
    if(response.status_code == 200):
        p[0] = resources_to_text(response.json())
    else:
        p[0] = "Failed to get resources by floor"

#SENSORS
def p_instruction_register_sensor(p):
    '''instruction : REGISTER EQUIPMENT COLON sensortype_or_var COMMA number_or_var COMMA float_or_var COMMA HCID'''

    sensor_type = p[4]
    resource_id = p[6]
    alert_limit = p[8]
    
    space = resolve_hcid(p[10])
    if not space:
        p[0] = None
        return

    payload = {
        'type':         sensor_type,
        'space':        p[10],
        'floor':        space['floor'],
        'resourceId':   resource_id,
        'alertLimit':   alert_limit,
        'xCoordinates': space['x'],
        'yCoordinates': space['y'],
        'isActive':     True,
        'isOccupied':   True,
    }

    response = requests.post(
        f"{API_URL}/api/sensors/",
        json=payload,
        headers=get_headers()
    )

    data = response.json()
    if response.status_code == 201:
        p[0] = "Sensor registered successfully"
    else:
        p[0] = data.get('error', data.get('message', 'Failed to register sensor'))

def p_instruction_get_sensors(p):
    '''instruction : GET EQUIPMENT'''

    if p[2] != 'sensor':
        p[0] = "Invalid instruction"
        return

    response = requests.get(
        f"{API_URL}/api/sensors/",
        headers=get_headers()
    )

    if response.status_code == 200:
        p[0] = sensors_to_text(response.json())
    else:
        p[0] = "Failed to get sensors"

def p_instruction_get_sensors_by_type(p):
    '''instruction : GET EQUIPMENT SENSORTYPE'''

    if p[2] != 'sensor':
        p[0] = "Invalid instruction"
        return

    response = requests.get(
        f"{API_URL}/api/sensors/type/{p[3]}",
        headers=get_headers()
    )

    if response.status_code == 200:
        p[0] = sensors_to_text(response.json())
    else:
        p[0] = "Failed to get sensors"

def p_instruction_get_sensors_by_floor(p):
    '''instruction : GET EQUIPMENT FLOOR'''

    if p[2] != 'sensor':
        p[0] = "Invalid instruction"
        return

    response = requests.get(
        f"{API_URL}/api/sensors/floor/{p[3]}",
        headers=get_headers()
    )

    if response.status_code == 200:
        p[0] = sensors_to_text(response.json())
    else:
        p[0] = "Failed to get sensors"

#MOBILITY RESOURCES



def p_instruction_get_mobility_resources(p):
    '''instruction : GET MOBILITY'''

    response = requests.get(
        f"{API_URL}/api/mobilityResources/",
        headers=get_headers()
    )

    if response.status_code == 200:
        p[0] = mobility_resources_to_text(response.json())
    else:
        p[0] = "Failed to get mobility resources"

def p_instruction_get_mobility_resources_by_type(p):
    '''instruction : GET MOBILITY MOBILITY_TYPE'''

    response = requests.get(
        f"{API_URL}/api/mobilityResources/type/{p[3]}",
        headers=get_headers()
    )

    if response.status_code == 200:
        p[0] = mobility_resources_to_text(response.json())
    else:
        p[0] = "Failed to get mobility resources"

def p_instruction_register_mobility_resource(p):
    '''instruction : REGISTER MOBILITY COLON MOBILITY_TYPE COMMA STRING COMMA HCID'''

    space = resolve_hcid(p[8])
    if not space:
        p[0] = None
        return

    payload = {
        'type':       p[4],
        'identifier': p[6],
        'location':   space['floor'],
        'status':     'FREE',
    }

    response = requests.post(
        f"{API_URL}/api/mobilityResources/",
        json=payload,
        headers=get_headers()
    )

    data = response.json()
    if response.status_code == 201:
        p[0] = "Mobility resource registered successfully"
    else:
        p[0] = data.get('error', data.get('message', 'Failed to register mobility resource'))

def p_instruction_update_mobility_status(p):
    '''instruction : UPDATE MOBILITY number_or_var MOBILITY_STATUS'''

    payload = {'status': p[4]}

    response = requests.patch(
        f"{API_URL}/api/mobilityResources/{p[3]}",
        json=payload,
        headers=get_headers()
    )

    if response.status_code == 200:
        p[0] = "Mobility resource updated successfully"
    else:
        data = response.json()
        p[0] = data.get('error', data.get('message', 'Failed to update mobility resource'))


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

