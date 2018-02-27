import logging
import sys

try:
    from psycopg2 import connect
    from psycopg2.extras import Json
    from psycopg2.sql import Identifier, Literal, SQL
except ImportError:
    logging.error('Required module psycopg2 not installed.')
    sys.exit(1)


def bulk_insert(cursor, table_name, data, alt_fields, alt_data):
    for row in data:
        fields = [k for k in row.keys()]
        fields.extend(alt_fields)
        values = [v for v in row.values()]
        values.extend(alt_data)

        insert(cursor, table_name, fields, values)


def call_stored_procedure(cursor, name):
    cursor.callproc(name)


def copy_from_csv(cursor, data_file, table_name, fields, delimiter='\t'):
    copy_template = 'COPY {} ({}) FROM STDIN WITH (FORMAT csv, HEADER true, DELIMITER {});'
    sql = SQL(copy_template).format(
        Identifier(table_name),
        SQL(', ').join(map(Identifier, fields)),
        Literal(delimiter)
    )

    cursor.copy_expert(sql, data_file)

def insert(cursor, table_name, fields, values):
    insert_template = 'INSERT INTO {} ({}) VALUES ({});'
    sql = SQL(insert_template).format(
        Identifier(table_name),
        SQL(', ').join(map(Identifier, fields)),
        SQL(', ').join(map(Literal, map(wrap_value, values)))
    )

    cursor.execute(sql)
    logging.info(sql.as_string(cursor))


def insert_return_id(cursor, table_name, fields, values, id_field='id'):
    insert_template = 'INSERT INTO {} ({}) VALUES ({}) RETURNING {};'
    sql = SQL(insert_template).format(
        Identifier(table_name),
        SQL(', ').join(map(Identifier, fields)),
        SQL(', ').join(map(Literal, map(wrap_value, values))),
        Identifier(id_field)
    )

    cursor.execute(sql)
    logging.info(sql.as_string(cursor))
    return cursor.fetchone()[0]


def get_connection(**db_config):
    return connect(**db_config)


def wrap_value(value):
    if isinstance(value, list):
        if any(isinstance(v, (dict, list)) for v in value):
            return Json(value)

    elif isinstance(value, dict):
        return Json(value)

    return value
