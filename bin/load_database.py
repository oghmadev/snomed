#!/usr/bin/env python3
from datetime import datetime
from glob import iglob
from db_utils import copy_from_csv, get_connection
from script_utils import create_arg_parser, get_config, get_data_file_path

def init_snomed():
    db_config = get_config('postgres')

    with get_connection(**db_config) as connection:
        with connection.cursor() as cursor:
            cursor.execute(open(get_data_file_path('sql/extensions.sql'), 'r').read())
            cursor.execute(open(get_data_file_path('sql/indexes.sql'), 'r').read())

            for f in iglob(get_data_file_path('sct2_Concept*.txt')):
                with open(f, 'r') as data_file:
                    fields = ('id', 'effectiveTime', 'active', 'moduleId', 'definitionStatusId')
                    copy_from_csv(cursor, data_file, 'Concept', fields)

            for f in iglob(get_data_file_path('sct2_Description*.txt')):
                with open(f, 'r') as data_file:
                    fields = ('id', 'effectiveTime', 'active', 'moduleId', 'conceptId', 'languageCode', 'typeId', 'term', 'caseSignificanceId')
                    copy_from_csv(cursor, data_file, 'Description', fields)

            for f in iglob(get_data_file_path('sct2_Relationship*.txt')):
                with open(f, 'r') as data_file:
                   fields = ('id', 'effectiveTime', 'active', 'moduleId', 'sourceId', 'destinationId', 'relationshipGroup', 'typeId', 'characteristicTypeId', 'modifierId')
                   copy_from_csv(cursor, data_file, 'Relationship', fields)

            for f in iglob(get_data_file_path('sct2_TransitiveClosure*.txt')):

                with open(f, 'r') as data_file:
                    fields = ('subtypeId', 'supertypeId')
                    copy_from_csv(cursor, data_file, 'TransitiveClosure', fields)

            connection.commit()


def main():
    create_arg_parser(prog_name=__file__, desc='Init SNOMED related tables')

    init_snomed()


if __name__ == '__main__':
    main()
